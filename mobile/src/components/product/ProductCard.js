// src/components/product/ProductCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductCard = ({ product, onPress, onFavorite }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Botón corazón (favorito) */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavorite(product)}
        >
          <Text style={styles.heart}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Nombre del producto */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 159,
    height: 259,
    borderRadius: 12,
    backgroundColor: "#fff",
    margin: 8,
    elevation: 4, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 6,
  },
  heart: {
    fontSize: 16,
    color: "#4B1E0E", // tu color vino/café
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3d1609",
    textAlign: "center",
  },
});

export default ProductCard;
