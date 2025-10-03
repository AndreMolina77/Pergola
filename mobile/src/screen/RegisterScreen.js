import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // DATOS COMPLETOS DEL REGISTRO
  const [formData, setFormData] = useState({
    step1: {
      nombres: "",
      apellidos: "",
      username: ""
    },
    step2: {
      email: "",
      telefono: "+503-",
      birthDate: "",
      DUI: ""
    },
    step3: {
      password: "",
      confirmPassword: "",
      address: ""
    }
  });

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  // STEPS CONFIGURACIÓN
  const STEPS = [
    {
      title: "Información Personal",
      subtitle: "Comencemos con tus datos básicos"
    },
    {
      title: "Contacto e Identificación", 
      subtitle: "Necesitamos esta información para tu seguridad"
    },
    {
      title: "Seguridad",
      subtitle: "Crea una contraseña segura para tu cuenta"
    }
  ];

  // FUNCIONES DE FORMATEO
  const formatPhoneNumber = (text) => {
    // Mantener siempre el prefijo +503-
    const prefix = "+503-";
    let numbers = text.replace(/\D/g, ''); // Solo números
    
    // Si se borra el prefijo, restaurarlo
    if (!text.startsWith(prefix)) {
      numbers = numbers.slice(3); // Remover 503 si está duplicado
    }
    
    // Limitar a 8 dígitos después del prefijo
    numbers = numbers.slice(0, 8);
    
    return prefix + numbers;
  };

  const formatDUI = (text) => {
    // Solo números
    let numbers = text.replace(/\D/g, '');
    
    // Limitar a 9 dígitos
    numbers = numbers.slice(0, 9);
    
    // Formato: 12345678-9
    if (numbers.length > 8) {
      return numbers.slice(0, 8) + '-' + numbers.slice(8);
    }
    return numbers;
  };

  const formatBirthDate = (text) => {
    // Solo números
    let numbers = text.replace(/\D/g, '');
    
    // Limitar a 8 dígitos
    numbers = numbers.slice(0, 8);
    
    // Formato: DD/MM/AAAA
    if (numbers.length >= 5) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    } else if (numbers.length >= 3) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    return numbers;
  };

  // FUNCIONES DE VALIDACIÓN MEJORADAS
  const validateField = (field, value, step) => {
    const errors = [];
    
    switch(field) {
      case 'nombres':
        if (!value || value.trim().length < 2) {
          errors.push('Los nombres deben tener al menos 2 caracteres');
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.push('Los nombres solo pueden contener letras');
        }
        break;
        
      case 'apellidos':
        if (!value || value.trim().length < 2) {
          errors.push('Los apellidos deben tener al menos 2 caracteres');
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.push('Los apellidos solo pueden contener letras');
        }
        break;
        
      case 'username':
        if (!value || value.trim().length < 3) {
          errors.push('El nombre de usuario debe tener al menos 3 caracteres');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
        }
        break;
        
      case 'email':
        if (!value || value.trim() === '') {
          errors.push('El correo electrónico es obligatorio');
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push('El formato del correo electrónico no es válido');
          }
        }
        break;
        
      case 'telefono':
        if (!value || value.trim() === '') {
          errors.push('El número de teléfono es obligatorio');
        } else {
          const phoneRegex = /^\+503-\d{8}$/;
          if (!phoneRegex.test(value)) {
            errors.push('El teléfono debe tener el formato +503-XXXXXXXX');
          }
        }
        break;
        
      case 'birthDate':
        if (value && value.trim() !== '') {
          const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
          if (!dateRegex.test(value)) {
            errors.push('La fecha debe tener el formato DD/MM/AAAA');
          } else {
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            const today = new Date();
            
            if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
              errors.push('La fecha de nacimiento no es válida');
            } else if (date >= today) {
              errors.push('La fecha de nacimiento debe ser anterior a hoy');
            } else if (year < 1900 || year > today.getFullYear() - 13) {
              errors.push('Debes tener al menos 13 años');
            }
          }
        }
        break;
        
      case 'DUI':
        if (value && value.trim() !== '') {
          const duiRegex = /^\d{8}-\d$/;
          if (!duiRegex.test(value)) {
            errors.push('El DUI debe tener el formato 12345678-9');
          }
        }
        break;
        
      case 'password':
        if (!value || value.length < 6) {
          errors.push('La contraseña debe tener al menos 6 caracteres');
        }
        if (!/(?=.*[a-z])/.test(value)) {
          errors.push('La contraseña debe contener al menos una letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          errors.push('La contraseña debe contener al menos una letra mayúscula');
        }
        if (!/(?=.*\d)/.test(value)) {
          errors.push('La contraseña debe contener al menos un número');
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.push('Debes confirmar tu contraseña');
        } else if (value !== formData.step3.password) {
          errors.push('Las contraseñas no coinciden');
        }
        break;
    }
    
    return errors;
  };

  const updateFormData = (step, field, value) => {
    let formattedValue = value;
    
    // Aplicar formateo automático
    if (field === 'telefono') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'DUI') {
      formattedValue = formatDUI(value);
    } else if (field === 'birthDate') {
      formattedValue = formatBirthDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: formattedValue
      }
    }));
  };

  const validateStep = (step) => {
    const currentData = formData[`step${step + 1}`];
    const allErrors = [];
    
    switch(step) {
      case 0: // Step 1
        const step1Fields = ['nombres', 'apellidos', 'username'];
        step1Fields.forEach(field => {
          const errors = validateField(field, currentData[field]);
          allErrors.push(...errors);
        });
        break;

      case 1: // Step 2
        const requiredFields = ['email', 'telefono'];
        const optionalFields = ['birthDate', 'DUI'];
        
        requiredFields.forEach(field => {
          const errors = validateField(field, currentData[field]);
          allErrors.push(...errors);
        });
        
        optionalFields.forEach(field => {
          if (currentData[field] && currentData[field].trim() !== '') {
            const errors = validateField(field, currentData[field]);
            allErrors.push(...errors);
          }
        });
        break;

      case 2: // Step 3
        const step3Fields = ['password', 'confirmPassword'];
        step3Fields.forEach(field => {
          const errors = validateField(field, currentData[field]);
          allErrors.push(...errors);
        });
        
        if (!acceptTerms) {
          allErrors.push('Debes aceptar los términos y condiciones');
        }
        break;
    }
    
    if (allErrors.length > 0) {
      Alert.alert(
        "Errores de validación",
        allErrors.join('\n• '),
        [{ text: "Entendido", style: "default" }]
      );
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleFinalSubmit();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    try {
      // PREPARAR DATOS FINALES PARA LA API
      const finalData = {
        name: formData.step1.nombres.trim(),
        lastName: formData.step1.apellidos.trim(),
        username: formData.step1.username.trim(),
        email: formData.step2.email.trim(),
        phoneNumber: formData.step2.telefono,
        birthDate: formData.step2.birthDate ? convertDateToISO(formData.step2.birthDate) : "",
        DUI: formData.step2.DUI || "",
        password: formData.step3.password,
        address: formData.step3.address.trim() || "",
        isVerified: false
      };

      const success = await register(finalData);
      
      if (success) {
        Alert.alert("Éxito", "Registro completado. Verifica tu email.");
        navigation.navigate("EmailVerification", { email: finalData.email });
      } else {
        Alert.alert("Error", "No se pudo completar el registro");
      }
    } catch (error) {
      Alert.alert("Error", "Error en el registro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const convertDateToISO = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day).toISOString();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      {STEPS.map((_, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={[
            styles.stepCircle, 
            index <= currentStep ? styles.stepActive : styles.stepInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              index <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {index + 1}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View style={[
              styles.stepLine,
              index < currentStep ? styles.stepLineActive : styles.stepLineInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombres *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tus nombres"
                placeholderTextColor="#A73249AA"
                value={formData.step1.nombres}
                onChangeText={(text) => updateFormData("step1", "nombres", text)}
                editable={!loading}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellidos *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tus apellidos"
                placeholderTextColor="#A73249AA"
                value={formData.step1.apellidos}
                onChangeText={(text) => updateFormData("step1", "apellidos", text)}
                editable={!loading}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de usuario *</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea un nombre de usuario"
                placeholderTextColor="#A73249AA"
                value={formData.step1.username}
                onChangeText={(text) => updateFormData("step1", "username", text)}
                autoCapitalize="none"
                editable={!loading}
                maxLength={20}
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#A73249AA"
                value={formData.step2.email}
                onChangeText={(text) => updateFormData("step2", "email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={styles.input}
                placeholder="+503-XXXXXXXX"
                placeholderTextColor="#A73249AA"
                value={formData.step2.telefono}
                onChangeText={(text) => updateFormData("step2", "telefono", text)}
                keyboardType="numeric"
                editable={!loading}
                maxLength={13}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#A73249AA"
                value={formData.step2.birthDate}
                onChangeText={(text) => updateFormData("step2", "birthDate", text)}
                keyboardType="numeric"
                editable={!loading}
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>DUI</Text>
              <TextInput
                style={styles.input}
                placeholder="12345678-9"
                placeholderTextColor="#A73249AA"
                value={formData.step2.DUI}
                onChangeText={(text) => updateFormData("step2", "DUI", text)}
                keyboardType="numeric"
                editable={!loading}
                maxLength={10}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Crea una contraseña segura"
                  placeholderTextColor="#A73249AA"
                  value={formData.step3.password}
                  onChangeText={(text) => updateFormData("step3", "password", text)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  maxLength={50}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconContainer}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#3D1609" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>
                Debe contener mayúsculas, minúsculas y números
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar contraseña *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#A73249AA"
                  value={formData.step3.confirmPassword}
                  onChangeText={(text) => updateFormData("step3", "confirmPassword", text)}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  maxLength={50}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconContainer}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#3D1609" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tu dirección completa"
                placeholderTextColor="#A73249AA"
                value={formData.step3.address}
                onChangeText={(text) => updateFormData("step3", "address", text)}
                editable={!loading}
                multiline={true}
                numberOfLines={2}
                maxLength={200}
              />
            </View>

            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <Checkbox
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                color={acceptTerms ? "#A73249" : undefined}
                disabled={loading}
                style={styles.checkbox}
              />
              <Text style={styles.termsText}>
                Acepto los términos y condiciones y la política de privacidad *
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con botón de volver */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#3D1609" />
          </TouchableOpacity>
        </View>

        {/* Mensaje de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Crea tu cuenta</Text>
          <Text style={styles.welcomeSubtitle}>
            {STEPS[currentStep].subtitle}
          </Text>
        </View>

        {/* Indicador de Steps */}
        {renderStepIndicator()}

        {/* Card del Formulario */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>{STEPS[currentStep].title}</Text>
          
          {/* Contenido del Step */}
          {renderStepContent()}

          {/* Botones de Navegación */}
          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevStep}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.prevButtonText}>Anterior</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.navButton, 
                styles.nextButton,
                { flex: currentStep > 0 ? 1 : 1 },
                loading && styles.buttonDisabled
              ]} 
              onPress={handleNextStep}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.nextButtonText}>
                  {currentStep === STEPS.length - 1 ? "Crear cuenta" : "Siguiente"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{" "}
          <Text 
            style={styles.footerLink} 
            onPress={() => navigation.navigate("Login")}
          >
            Inicia sesión
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: screenHeight * 0.02,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: screenHeight * 0.03,
  },
  welcomeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: Math.min(32, screenWidth * 0.08),
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: Math.min(38, screenWidth * 0.095),
  },
  welcomeSubtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: Math.min(16, screenWidth * 0.04),
    color: "#3D1609",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: screenHeight * 0.03,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  stepActive: {
    backgroundColor: "#A73249",
    borderColor: "#A73249",
  },
  stepInactive: {
    backgroundColor: "transparent",
    borderColor: "#3D1609",
  },
  stepNumber: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepNumberInactive: {
    color: "#3D1609",
  },
  stepLine: {
    width: 30,
    height: 2,
    marginHorizontal: 5,
  },
  stepLineActive: {
    backgroundColor: "#A73249",
  },
  stepLineInactive: {
    backgroundColor: "#3D160980",
  },
  loginCard: {
    backgroundColor: "#F5EDE8",
    borderRadius: 20,
    padding: Math.max(20, screenWidth * 0.05),
    marginBottom: 20,
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E8D5C9",
    minHeight: screenHeight * 0.4,
  },
  loginTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: Math.min(24, screenWidth * 0.06),
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 25,
  },
  formSection: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontFamily: "Nunito-SemiBold",
    color: "#3D1609",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Nunito-Regular",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  inputPassword: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Nunito-Regular",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
    paddingRight: 55,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 50,
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: "Nunito-Regular",
    color: "#A73249",
    marginTop: 5,
    marginLeft: 5,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 15,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  navButton: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 100,
  },
  prevButton: {
    backgroundColor: "#F5EDE8",
    borderWidth: 2,
    borderColor: "#A73249",
    flex: 0.4,
  },
  nextButton: {
    backgroundColor: "#A73249",
    shadowColor: "#A73249",
  },
  buttonDisabled: {
    backgroundColor: "#A7324980",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  prevButtonText: {
    color: "#A73249",
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
  },
  nextButtonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
    borderTopWidth: 1,
    borderTopColor: "#D0C4B8",
    alignItems: "center",
    backgroundColor: "#E3C6B8",
  },
  footerText: {
    textAlign: "center",
    color: "#3D1609",
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    lineHeight: 18,
  },
  footerLink: {
    color: "#A73249",
    fontFamily: "Nunito-Bold",
    textDecorationLine: "underline",
  },
});