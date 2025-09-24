import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login, authToken } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si ya existe una sesión activa
  useEffect(() => {
    if (authToken) {
      navigation.replace("TabNavigator");
    }
  }, [authToken]);

  const handleLogin = async () => {
    // Validaciones básicas
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

  return (
    <View style={styles.container}>
      {/* Header */}
      
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <AntDesign 
            name={showPassword ? "eye" : "eyeo"} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <View style={styles.rememberContainer}>
        <Checkbox
          value={rememberMe}
          onValueChange={setRememberMe}
          color={rememberMe ? "#3D1609" : undefined}
          disabled={loading}
        />
        <Text style={styles.rememberText}>Recuérdame</Text>
      </View>

      {/* Continuar */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Iniciando..." : "Continuar"}
        </Text>
      </TouchableOpacity>

      {/* Restablecer contraseña */}
      <Text style={styles.forgotText}>
        ¿Olvidaste tu contraseña?{" "}
        <Text 
          style={styles.linkText} 
          onPress={() => navigation.navigate("RecoverPassword")}
        >
          Restablecer
        </Text>
      </Text>

      

      {/* Crear cuenta */}
      <Text style={styles.bottomText}>
        ¿No tienes una cuenta?{" "}
        <Text 
          style={styles.linkText} 
          onPress={() => navigation.navigate("Register")}
        >
          Crea una
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    marginTop: 60
  },
  input: {
    width: "100%",
    height: 62,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    marginTop: 40,
    marginBottom: 30
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 62,
    marginBottom: 10
  },
  inputPassword: {
    flex: 1,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 62,
    fontSize: 16,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 15,
    height: 62,
    justifyContent: "center",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30
  },
  rememberText: {
    marginLeft: 8,
    fontWeight: "bold",
    color: "#3D1609",
  },
  button: {
    width: "100%",
    height: 62,
    backgroundColor: "#A73249",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 30
  },
  buttonDisabled: {
    backgroundColor: "#A7324980",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotText: {
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 14,
    marginTop: 30
  },
  linkText: {
    color: "#3D1609",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D0C4B8",
  },
  bottomText: {
    textAlign: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    color: "#3D1609",
    fontSize: 14,
  },
});