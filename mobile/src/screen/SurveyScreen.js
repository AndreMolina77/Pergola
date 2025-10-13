import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";
import TextInputField from "../components/TextInputField";
import SizeSelector from "../components/SizeSelector";

const SurveyScreen = ({ navigation, route }) => {
  const { user, API } = useContext(AuthContext);

  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState("");
  const [jewelSize, setJewelSize] = useState("");
  const [preferredColors, setPreferredColors] = useState("");
  const [preferredMaterials, setPreferredMaterials] = useState("");
  const [preferredJewelStyle, setPreferredJewelStyle] = useState("");
  const [purchaseOpportunity, setPurchaseOpportunity] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  // Cargar datos existentes del usuario si existen
  useEffect(() => {
    if (user) {
      // Aquí podrías cargar los datos existentes del usuario si los tienes
      console.log("Usuario actual:", user);
    }
  }, [user]);

  const handleFinish = async () => {
    if (!user) {
      Alert.alert("Error", "No se pudo identificar al usuario");
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para enviar al backend
      const surveyData = {
        allergies: allergies.trim() || "",
        budget: budget.trim() || "",
        jewelSize: jewelSize || "",
        preferredColors: preferredColors.split(',').map(color => color.trim()).filter(color => color !== ""),
        preferredMaterials: preferredMaterials.split(',').map(material => material.trim()).filter(material => material !== ""),
        preferredJewelStyle: preferredJewelStyle.split(',').map(style => style.trim()).filter(style => style !== ""),
        purchaseOpportunity: purchaseOpportunity.trim() || ""
      };

      console.log("Enviando datos de encuesta:", surveyData);

      const response = await fetch(`${API}/customers/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "¡Éxito!",
          "Tus preferencias han sido guardadas correctamente",
          [
            {
              text: "Continuar",
              onPress: () => navigation.navigate("Home")
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "No se pudieron guardar las preferencias");
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Saltar Encuesta",
      "¿Estás seguro de que quieres saltar la encuesta? Puedes completarla más tarde en tu perfil.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Saltar",
          onPress: () => navigation.navigate("Home")
        }
      ]
    );
  };

  const isValidForm = () => {
    // Todos los campos son opcionales, pero al menos uno debe estar lleno
    return allergies.trim() !== "" ||
      budget.trim() !== "" ||
      jewelSize !== "" ||
      preferredColors.trim() !== "" ||
      preferredMaterials.trim() !== "" ||
      preferredJewelStyle.trim() !== "" ||
      purchaseOpportunity.trim() !== "";
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#3D1609" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preferencias</Text>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        </View>

        {/* Contenido Principal */}
        <View style={styles.content}>
          <Text style={styles.title}>Cuéntanos{"\n"}sobre tus preferencias</Text>
          <Text style={styles.subtitle}>
            Esta información nos ayudará a recomendarte productos que se adapten mejor a tus gustos
          </Text>

          {/* Alergias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alergias a materiales</Text>
            <Text style={styles.sectionDescription}>
              Escribe los materiales a los que eres alérgico (separados por comas)
            </Text>
            <TextInputField
              label="Alergias a materiales"
              placeholder="Ej: Níquel, Plata, Cobre..."
              value={allergies}
              onChangeText={setAllergies}
              editable={!loading}
              multiline={true}
              numberOfLines={3}
              inputStyle={{
                minHeight: 48,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Tamaño de Joyas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tamaño preferido de joyas</Text>
            <Text style={styles.sectionDescription}>
              Selecciona el tamaño que más te gusta
            </Text>
            <SizeSelector
              selectedSize={jewelSize}
              onSelect={setJewelSize}
              disabled={loading}
            />
          </View>

          {/* Presupuesto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presupuesto estimado</Text>
            <Text style={styles.sectionDescription}>
              Tu rango de presupuesto para joyería (en USD)
            </Text>
            <TextInputField
              label="Presupuesto estimado (USD)"
              placeholder="Ej: $100 - $300"
              value={budget}
              onChangeText={setBudget}
              keyboardType="default"
              editable={!loading}
              inputStyle={{
                minHeight: 48,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Colores Preferidos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Colores favoritos</Text>
            <Text style={styles.sectionDescription}>
              Colores que prefieres en joyería (separados por comas)
            </Text>
            <TextInputField
              label="Colores favoritos"
              placeholder="Ej: Dorado, Plateado, Rosa..."
              value={preferredColors}
              onChangeText={setPreferredColors}
              editable={!loading}
              inputStyle={{
                minHeight: 48,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Materiales Preferidos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materiales preferidos</Text>
            <Text style={styles.sectionDescription}>
              Materiales que más te gustan (separados por comas)
            </Text>
            <TextInputField
              placeholder="Ej: Oro, Plata, Diamantes..."
              value={preferredMaterials}
              onChangeText={setPreferredMaterials}
              editable={!loading}
              inputStyle={{
                minHeight: 48,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Estilos de Joyería */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estilos de joyería</Text>
            <Text style={styles.sectionDescription}>
              Estilos que prefieres (separados por comas)
            </Text>
            <TextInputField
              placeholder="Ej: Minimalista, Vintage, Bohemio..."
              value={preferredJewelStyle}
              onChangeText={setPreferredJewelStyle}
              editable={!loading}
              inputStyle={{
                minHeight: 48,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Oportunidad de Compra */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Oportunidad de compra</Text>
            <Text style={styles.sectionDescription}>
              ¿Para qué ocasión planeas comprar joyería?
            </Text>
            <TextInputField
              placeholder="Ej: Regalo de cumpleaños, Bodas, Uso diario..."
              value={purchaseOpportunity}
              onChangeText={setPurchaseOpportunity}
              editable={!loading}
              multiline={true}
              numberOfLines={3}
              inputStyle={{
                minHeight: 56,
                maxHeight: 100,
                textAlignVertical: 'top',
                flexWrap: 'wrap',
                paddingHorizontal: 10
              }}
            />
          </View>

          {/* Botón Finalizar */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isValidForm() || loading) && styles.buttonDisabled
            ]}
            onPress={handleFinish}
            disabled={!isValidForm() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Guardar Preferencias</Text>
            )}
          </TouchableOpacity>

          {/* Nota */}
          <Text style={styles.note}>
            * Todos los campos son opcionales. Puedes actualizar esta información en cualquier momento desde tu perfil.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SurveyScreen;

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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#E3C6B8",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: "#3D1609",
    textAlign: "center",
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    color: "#A73249",
  },
  content: {
    flex: 1,
    backgroundColor: "#F5EDE8",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    marginTop: 10,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#3D1609",
    marginBottom: 6,
  },
  sectionDescription: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: "#3D1609",
    marginBottom: 12,
    opacity: 0.7,
    lineHeight: 18,
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
    marginTop: 20,
    marginBottom: 15,
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
  note: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: "#3D1609",
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 16,
    marginTop: 10,
  },
});