import React, { useState, useContext, useEffect } from "react";
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
  ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";

const RecoverPasswordScreen = ({ navigation }) => {
  const { API } = useContext(AuthContext);
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Código, 3: Nueva contraseña
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  // Countdown timer para reenvío de código
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Paso 1: Solicitar código de recuperación
  const handleRequestCode = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recoveryPassword/requestCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Se ha enviado un código de recuperación a tu correo electrónico");
        setCurrentStep(2);
        setCountdown(120); // 2 minutos para reenvío
      } else {
        Alert.alert("Error", data.message || "No se pudo enviar el código de recuperación");
      }
    } catch (error) {
      console.error("Error requesting recovery code:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const handleVerifyCode = async () => {
    if (!code || code.length !== 5) {
      Alert.alert("Error", "Por favor ingresa el código de 5 dígitos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recoveryPassword/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Código verificado correctamente");
        setCurrentStep(3);
      } else {
        Alert.alert("Error", data.message || "Código incorrecto");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      Alert.alert("Error", "No se pudo verificar el código");
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Cambiar contraseña
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recoveryPassword/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Éxito", 
          "Contraseña cambiada correctamente", 
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "No se pudo cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API}/recoveryPassword/requestCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Se ha reenviado el código de recuperación");
        setCountdown(120); // 2 minutos para reenvío
      } else {
        Alert.alert("Error", data.message || "No se pudo reenviar el código");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      Alert.alert("Error", "No se pudo reenviar el código");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      <View style={styles.steps}>
        <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
        <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
        <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabels}>
        <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Email</Text>
        <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Código</Text>
        <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Nueva Contraseña</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un código de verificación
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor="#A73249AA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRequestCode}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Enviar Código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#A73249" />
        <Text style={styles.backButtonText}>Volver al Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.title}>Verificar Código</Text>
      <Text style={styles.subtitle}>
        Hemos enviado un código de 5 dígitos a {email}
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Código de verificación</Text>
        <TextInput
          style={styles.input}
          placeholder="12345"
          placeholderTextColor="#A73249AA"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={5}
          editable={!loading}
        />
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          ¿No recibiste el código?{" "}
        </Text>
        <TouchableOpacity 
          onPress={handleResendCode}
          disabled={loading || countdown > 0}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.resendLink, 
            (loading || countdown > 0) && styles.resendLinkDisabled
          ]}>
            Reenviar {countdown > 0 && `(${formatTime(countdown)})`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleVerifyCode}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Verificar Código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentStep(1)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#A73249" />
        <Text style={styles.backButtonText}>Cambiar email</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.title}>Nueva Contraseña</Text>
      <Text style={styles.subtitle}>
        Crea una nueva contraseña para tu cuenta
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Ingresa tu nueva contraseña"
            placeholderTextColor="#A73249AA"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIconContainer}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#3D1609" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Confirma tu nueva contraseña"
            placeholderTextColor="#A73249AA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIconContainer}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons 
              name={showConfirmPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#3D1609" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleChangePassword}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentStep(2)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#A73249" />
        <Text style={styles.backButtonText}>Volver al código</Text>
      </TouchableOpacity>
    </View>
  );

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backHeaderButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#3D1609" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Indicador de pasos */}
        {renderStepIndicator()}

        {/* Contenido del paso actual */}
        <View style={styles.card}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RecoverPasswordScreen;

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
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backHeaderButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: "#3D1609",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5EDE8',
    borderWidth: 2,
    borderColor: '#D0C4B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  stepNumber: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#3D1609",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#D0C4B8',
  },
  stepLineActive: {
    backgroundColor: '#A73249',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  stepLabel: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: "#3D1609AA",
    textAlign: 'center',
    width: 80,
  },
  stepLabelActive: {
    color: "#3D1609",
    fontFamily: "Nunito-SemiBold",
  },
  card: {
    backgroundColor: "#F5EDE8",
    borderRadius: 20,
    padding: 25,
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
  },
  stepContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    opacity: 0.8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#3D1609",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  inputPassword: {
    width: "100%",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
    paddingRight: 60,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 56,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#A73249",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A73249",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A7324980",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#A73249",
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    marginLeft: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  resendText: {
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
    fontSize: 14,
  },
  resendLink: {
    color: "#A73249",
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  resendLinkDisabled: {
    color: "#A7324980",
  },
});