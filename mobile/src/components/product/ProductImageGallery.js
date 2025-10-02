// components/product/ProductImageGallery.js
import React from "react";
import { View, Image, ScrollView, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window"); // ancho de pantalla

export default function ProductImageGallery({ images }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300, // altura fija de la galería
    marginBottom: 10,
  },
  image: {
    width: width, // cada imagen ocupa todo el ancho
    height: "100%",
  },
});
