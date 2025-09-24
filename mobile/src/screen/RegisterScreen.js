import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function RegisterScreen({ navigation }) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [dui, setDui] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: birthDate || new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === "dismissed") return;
        if (selectedDate) setBirthDate(selectedDate);
      },
      mode: "date",
      is24Hour: true,
      maximumDate: new Date(),
    });
  };

  const handleConfirm = (date) => {
    setBirthDate(date);
    setDatePickerVisibility(false);
  };

  const handleRegister = async () => {
    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !telefono ||
      !birthDate ||
      !dui ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // Validación del teléfono
    const phoneRegex = /^\+503[-\d]{8,12}$/;
    if (!phoneRegex.test(telefono)) {
      Alert.alert("Error", "Formato de teléfono inválido. Usa +503XXXXXXXX");
      return;
    }

    // Validación de DUI
    const duiRegex = /^\d{8}-\d{1}$/;
    if (!duiRegex.test(dui)) {
      Alert.alert("Error", "DUI inválido. Usa el formato 12345678-9");
      return;
    }

    const parsedDate = birthDate.toISOString().split("T")[0];

    const formData = {
      name: nombres.trim(),
      lastName: apellidos.trim(),
      username: correo.split("@")[0].toLowerCase(),
      email: correo.trim().toLowerCase(),
      phoneNumber: telefono.trim(),
      birthDate: parsedDate,
      DUI: dui.trim(),
      address: address.trim(),
      password: password,
    };

    // 🔍 Debug
    console.log("📤 Enviando datos:", JSON.stringify(formData, null, 2));

    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/signupCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📥 Respuesta del servidor:", data);

      if (response.ok) {
        Alert.alert("Éxito", "Registro exitoso");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "Error al registrar");
      }
    } catch (error) {
      console.error("❌ Error al conectar con servidor:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-outline" size={40} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Crea una cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombres" value={nombres} onChangeText={setNombres} />
      <TextInput style={styles.input} placeholder="Apellidos" value={apellidos} onChangeText={setApellidos} />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Número de teléfono (+503XXXXXXXX)"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="DUI (12345678-9)"
        value={dui}
        onChangeText={setDui}
        keyboardType="numbers-and-punctuation"
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() =>
          Platform.OS === "android"
            ? showDatePickerAndroid()
            : setDatePickerVisibility(true)
        }
      >
        <Text style={{ color: birthDate ? "#000" : "#999", fontSize: 16 }}>
          {birthDate ? birthDate.toLocaleDateString() : "Selecciona fecha de nacimiento"}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <AntDesign name="eyeo" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <AntDesign name="eyeo" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 62,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 62,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  eyeIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    right: 15,
  },
  button: {
    width: "100%",
    height: 62,
    backgroundColor: "#A73249",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

