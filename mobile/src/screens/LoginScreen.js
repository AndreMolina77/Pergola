import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  CheckBox,
  Alert,
} from "react-native";
import api from "../api/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        Alert.alert("Éxito", "Has iniciado sesión correctamente");
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", response.data.message || "Datos incorrectos");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <Image
          source={require("../../assets/back-icon.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <Image
            source={require("../../assets/eye-icon.png")}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <View style={styles.rememberContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
          tintColors={{ true: "#3D1609", false: "#3D1609" }}
        />
        <Text style={styles.rememberText}>Recuérdame</Text>
      </View>

      {/* Continuar */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      {/* Restablecer contraseña */}
      <Text style={styles.forgotText}>
        ¿Olvidaste tu contraseña?{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("RecoverPassword")}>
          Restablecer
        </Text>
      </Text>

      {/* Social login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text>Continuar con Apple</Text>
          <Image
            source={require("../../assets/apple-icon.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text>Continuar con Google</Text>
          <Image
            source={require("../../assets/google-icon.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text>Continuar con Facebookk</Text>
          <Image
            source={require("../../assets/facebook-icon.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Crear cuenta */}
      <Text style={styles.bottomText}>
        ¿No tienes una cuenta?{" "}
        <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>
          Crea una
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    padding: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    marginBottom: 10,
  },
  backIcon: {
    width: 48,
    height: 48,
    tintColor: "#3D1609",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: 393,
    height: 62,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 393,
    height: 62,
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 62,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
  },
  eyeIcon: {
    width: 32,
    height: 32,
    tintColor: "#3D1609",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rememberText: {
    marginLeft: 5,
    color: "#3D1609",
  },
  button: {
    width: 393,
    height: 62,
    backgroundColor: "#A73249",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotText: {
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "#3D1609",
    fontWeight: "bold",
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  socialButton: {
    width: 388.26,
    height: 56,
    backgroundColor: "#E3C6B8",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  bottomText: {
    textAlign: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
    color: "#3D1609",
  },
});
