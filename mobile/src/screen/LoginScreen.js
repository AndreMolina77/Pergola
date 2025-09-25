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
import Checkbox from "expo-checkbox";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login, authToken } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    if (authToken) {
      navigation.replace("TabNavigator");
    }
  }, [authToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigation.replace("TabNavigator");
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
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
        {/* Mensaje de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>¡Bienvenido de nuevo!</Text>
          <Text style={styles.welcomeSubtitle}>
            Ingresa a tu cuenta para continuar con tu experiencia
          </Text>
        </View>

        {/* Formulario de Login */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Iniciar Sesión</Text>
          
          {/* Campos del Formulario */}
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#A73249AA"
                value={password}
                onChangeText={setPassword}
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

          {/* Recordar y Olvidar Contraseña */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? "#A73249" : undefined}
                disabled={loading}
                style={styles.checkbox}
              />
              <Text style={styles.rememberText}>Recuérdame</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate("RecoverPassword")}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Login */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{" "}
          <Text 
            style={styles.footerLink} 
            onPress={() => navigation.navigate("Register")}
          >
            Crea una
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    paddingBottom: 20, // Espacio para el footer
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 5,
    flexWrap: "wrap", // Por si el texto es muy largo
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  rememberText: {
    fontFamily: "Nunito-SemiBold",
    color: "#3D1609",
    fontSize: 14,
    flex: 1,
  },
  forgotText: {
    color: "#A73249",
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
    flexShrink: 0, // No se encoge
  },
  loginButton: {
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
  },
  buttonDisabled: {
    backgroundColor: "#A7324980",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
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