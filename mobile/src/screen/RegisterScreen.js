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
  ScrollView
} from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";

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
      telefono: "",
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

  const updateFormData = (step, field, value) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const currentData = formData[`step${step + 1}`];
    
    switch(step) {
      case 0: // Step 1
        if (!currentData.nombres || !currentData.apellidos || !currentData.username) {
          Alert.alert("Error", "Por favor completa todos los campos");
          return false;
        }
        return true;

      case 1: // Step 2
        if (!currentData.email || !currentData.telefono) {
          Alert.alert("Error", "Email y teléfono son obligatorios");
          return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentData.email)) {
          Alert.alert("Error", "Por favor ingresa un email válido");
          return false;
        }
        return true;

      case 2: // Step 3
        if (!currentData.password || !currentData.confirmPassword) {
          Alert.alert("Error", "Ambas contraseñas son obligatorias");
          return false;
        }
        
        if (currentData.password !== currentData.confirmPassword) {
          Alert.alert("Error", "Las contraseñas no coinciden");
          return false;
        }
        
        if (currentData.password.length < 6) {
          Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
          return false;
        }

        if (!acceptTerms) {
          Alert.alert("Error", "Debes aceptar los términos y condiciones");
          return false;
        }
        return true;

      default:
        return true;
    }
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
        name: formData.step1.nombres,
        lastName: formData.step1.apellidos,
        username: formData.step1.username,
        email: formData.step2.email,
        phoneNumber: formData.step2.telefono,
        birthDate: formData.step2.birthDate || "",
        DUI: formData.step2.DUI || "",
        password: formData.step3.password,
        address: formData.step3.address || "",
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
              <Text style={styles.label}>Nombres</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tus nombres"
                placeholderTextColor="#A73249AA"
                value={formData.step1.nombres}
                onChangeText={(text) => updateFormData("step1", "nombres", text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellidos</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tus apellidos"
                placeholderTextColor="#A73249AA"
                value={formData.step1.apellidos}
                onChangeText={(text) => updateFormData("step1", "apellidos", text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea un nombre de usuario"
                placeholderTextColor="#A73249AA"
                value={formData.step1.username}
                onChangeText={(text) => updateFormData("step1", "username", text)}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#A73249AA"
                value={formData.step2.email}
                onChangeText={(text) => updateFormData("step2", "email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="+503 XXXX XXXX"
                placeholderTextColor="#A73249AA"
                value={formData.step2.telefono}
                onChangeText={(text) => updateFormData("step2", "telefono", text)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de nacimiento (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#A73249AA"
                value={formData.step2.birthDate}
                onChangeText={(text) => updateFormData("step2", "birthDate", text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>DUI (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="XXXXXXXX-X"
                placeholderTextColor="#A73249AA"
                value={formData.step2.DUI}
                onChangeText={(text) => updateFormData("step2", "DUI", text)}
                editable={!loading}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Crea una contraseña segura"
                  placeholderTextColor="#A73249AA"
                  value={formData.step3.password}
                  onChangeText={(text) => updateFormData("step3", "password", text)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
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
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#A73249AA"
                  value={formData.step3.confirmPassword}
                  onChangeText={(text) => updateFormData("step3", "confirmPassword", text)}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
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
              <Text style={styles.label}>Dirección (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu dirección completa"
                placeholderTextColor="#A73249AA"
                value={formData.step3.address}
                onChangeText={(text) => updateFormData("step3", "address", text)}
                editable={!loading}
                multiline={true}
                numberOfLines={2}
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
                Acepto los términos y condiciones y la política de privacidad
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
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 20, // Espacio para el footer
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 32,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 38,
  },
  welcomeSubtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
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
    marginBottom: 30,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepNumberInactive: {
    color: "#3D1609",
  },
  stepLine: {
    width: 40,
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
    padding: 25,
    marginBottom: 20, // Espacio antes del footer
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
  loginTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 30,
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
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
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
    textAlignVertical: "top", // Para multiline
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
    paddingRight: 60, // Más espacio para el ícono
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Cambio para mejor alineación
    marginTop: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2, // Pequeño ajuste de alineación
  },
  termsText: {
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  navButton: {
    height: 56,
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
    minWidth: 100, // Ancho mínimo para consistencia
  },
  prevButton: {
    backgroundColor: "#F5EDE8",
    borderWidth: 2,
    borderColor: "#A73249",
    flex: 0.5, // Botón anterior más pequeño
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
    fontSize: 16,
  },
  nextButtonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: "#D0C4B8",
    alignItems: "center",
    backgroundColor: "#E3C6B8", // Asegurar color de fondo
  },
  footerText: {
    textAlign: "center",
    color: "#3D1609",
    fontSize: 15,
    fontFamily: "Nunito-Regular",
    lineHeight: 20,
  },
  footerLink: {
    color: "#A73249",
    fontFamily: "Nunito-Bold",
    textDecorationLine: "underline",
  },
});