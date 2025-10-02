// src/screens/catalog/ProductDetailScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ReviewsSection from "../../components/product/ReviewsSection";

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Info básica */}
      <View style={styles.infoSection}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* Botón de añadir al carrito */}
      <TouchableOpacity
        style={styles.addCartButton}
        onPress={() => navigation.navigate("Cart")} // 👈 te lleva directo al carrito
      >
        <Text style={styles.addCartText}>Añadir al carrito</Text>
      </TouchableOpacity>

      {/* Reviews */}
      <ReviewsSection reviews={product.reviews || []} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },
  infoSection: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3D1609",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#A73249",
    marginVertical: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  addCartButton: {
    backgroundColor: "#A73249",
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
