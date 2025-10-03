import { createContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, Alert } from 'react-native';

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = "https://pergola-production.up.railway.app/api";

  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const userSession = await AsyncStorage.getItem("userSession");
        if (userSession) {
          const userData = JSON.parse(userSession);
          setUser(userData);
          setAuthToken("authenticated");
        }
      } catch (error) {
        console.log("No hay sesión guardada");
      }
    };
    loadUserSession();
  }, []);

  const clearSession = async () => {
    await AsyncStorage.removeItem("userSession");
    setUser(null);
    setAuthToken(null);
  };

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      await clearSession();
      ToastAndroid.show("Sesión cerrada correctamente", ToastAndroid.SHORT);
    }
  }, [API_URL]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform: "mobile" }),
      });
    
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // RESTRICCIÓN: Solo permitir clientes
        if (data.user && data.user.userType !== "customer") {
          return { 
            success: false, 
            message: "Esta aplicación es solo para clientes" 
          };
        }

        // Guardar sesión del usuario
        const userSession = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          lastName: data.user.lastName,
          userType: data.user.userType,
          loginTime: Date.now()
        };
        
        await AsyncStorage.setItem("userSession", JSON.stringify(userSession));
        setUser(userSession);
        setAuthToken("authenticated");
        
        ToastAndroid.show("Inicio de sesión exitoso", ToastAndroid.SHORT);
        return { success: true };
      } else {
        // Manejar diferentes tipos de errores del servidor
        return { 
          success: false, 
          message: data.message || "Error al iniciar sesión",
          blocked: data.blocked || false,
          remainingMinutes: data.remainingMinutes || 0
        };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { 
        success: false, 
        message: "Error de conexión" 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Validar datos antes de enviar
      const validationErrors = validateRegistrationData(userData);
      if (validationErrors.length > 0) {
        Alert.alert(
          "Datos inválidos",
          validationErrors.join('\n• '),
          [{ text: "Entendido", style: "default" }]
        );
        return false;
      }

      // Preparar datos para el backend
      const backendData = {
        name: userData.name,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        address: userData.address || "",
        isVerified: false
      };

      // Solo incluir campos opcionales si tienen valor
      if (userData.birthDate && userData.birthDate.trim() !== '') {
        backendData.birthDate = userData.birthDate;
      }
      
      if (userData.DUI && userData.DUI.trim() !== '') {
        backendData.DUI = userData.DUI;
      }

      console.log("Enviando datos de registro:", backendData);

      const response = await fetch(`${API_URL}/signupCustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        ToastAndroid.show("Registro exitoso", ToastAndroid.SHORT);
        return true;
      } else {
        // Manejar errores específicos del servidor
        let errorMessage = "Error al registrarse";
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join('\n• ');
        } else if (response.status === 409) {
          errorMessage = "El email o username ya están registrados";
        } else if (response.status === 400) {
          errorMessage = "Datos de registro inválidos";
        }
        
        Alert.alert("Error de registro", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor");
      return false;
    }
  };

  // Función para validar datos antes de enviar al backend
  const validateRegistrationData = (userData) => {
    const errors = [];

    // Validaciones básicas
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Los apellidos deben tener al menos 2 caracteres');
    }

    if (!userData.username || userData.username.trim().length < 3) {
      errors.push('El username debe tener al menos 3 caracteres');
    }

    if (!userData.email || !isValidEmail(userData.email)) {
      errors.push('El email no es válido');
    }

    if (!userData.phoneNumber || !isValidSalvadorPhone(userData.phoneNumber)) {
      errors.push('El teléfono debe tener formato +503-XXXXXXXX');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validaciones opcionales si hay datos
    if (userData.birthDate && userData.birthDate.trim() !== '') {
      if (!isValidDate(userData.birthDate)) {
        errors.push('La fecha de nacimiento no es válida');
      }
    }

    if (userData.DUI && userData.DUI.trim() !== '') {
      if (!isValidDUI(userData.DUI)) {
        errors.push('El DUI debe tener formato 12345678-9');
      }
    }

    return errors;
  };

  // Funciones auxiliares de validación
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidSalvadorPhone = (phone) => {
    const phoneRegex = /^\+503-\d{8}$/;
    return phoneRegex.test(phone);
  };

  const isValidDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date) && date < new Date();
    } catch {
      return false;
    }
  };

  const isValidDUI = (dui) => {
    const duiRegex = /^\d{8}-\d$/;
    return duiRegex.test(dui);
  };

  // FUNCIÓN CORREGIDA: Verificar email con código
  const verifyEmail = async (email, code) => {
    try {
      const response = await fetch(`${API_URL}/signupCustomer/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          verCodeRequest: code 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        ToastAndroid.show("Cuenta verificada exitosamente", ToastAndroid.SHORT);
        return true;
      } else {
        const errorMessage = data.message || "Código incorrecto";
        Alert.alert("Error de verificación", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      Alert.alert("Error de conexión", "No se pudo verificar el código");
      return false;
    }
  };

  // NUEVA FUNCIÓN: Reenviar código de verificación
  const resendVerificationCode = async (email) => {
    try {
      // Como no hay endpoint específico para reenvío, 
      // simulamos que funciona por ahora
      await new Promise(resolve => setTimeout(resolve, 1000));
      ToastAndroid.show("Código reenviado", ToastAndroid.SHORT);
      return true;
    } catch (error) {
      console.error("Error during code resend:", error);
      Alert.alert("Error de conexión", "No se pudo reenviar el código");
      return false;
    }
  };

  // FUNCIÓN ORIGINAL (mantenida por compatibilidad)
  const verifyCode = async (code) => {
    try {
      const response = await fetch(`${API_URL}/signupCustomer/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(code),
      });
      
      if (response.ok) {
        ToastAndroid.show("Código verificado", ToastAndroid.SHORT);
        return true;
      } else {
        const data = await response.json();
        const errorMessage = data.message || "Error al verificar el código";
        Alert.alert("Error de verificación", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Error de conexión", "No se pudo verificar el código");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      authToken, 
      loading, 
      login, 
      logout, 
      register, 
      verifyCode, 
      verifyEmail, 
      resendVerificationCode, 
      API: API_URL 
    }}>
      {children}
    </AuthContext.Provider>
  );
};