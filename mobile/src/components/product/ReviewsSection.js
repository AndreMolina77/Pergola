// src/components/product/ReviewsSection.js
import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

// Simulación de reseñas
const reviews = [
  {
    id: "1",
    user: "Ana",
    avatar: "https://i.pravatar.cc/50?img=1",
    rating: 5,
    comment: "Muy bonito y de excelente calidad.",
  },
  {
    id: "2",
    user: "Luis",
    avatar: "https://i.pravatar.cc/50?img=2",
    rating: 4,
    comment: "Me gustó mucho, aunque tardó un poco el envío.",
  },
  {
    id: "3",
    user: "María",
    avatar: "https://i.pravatar.cc/50?img=3",
    rating: 5,
    comment: "Superó mis expectativas, lo recomiendo.",
  },
];

// Componente para mostrar estrellas
const Stars = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? "★" : "☆"
  ).join(" ");
  return <Text style={styles.stars}>{stars}</Text>;
};

export default function ReviewsSection() {
  const average =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <View style={styles.container}>
      {/* Overall de calificación */}
      <View style={styles.overall}>
        <Text style={styles.score}>{average.toFixed(1)}/5</Text>
        <Stars rating={Math.round(average)} />
      </View>

      {/* Lista de reseñas */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.reviewContent}>
              <Text style={styles.username}>{item.user}</Text>
              <Stars rating={item.rating} />
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  overall: {
    alignItems: "center",
    marginBottom: 12,
  },
  score: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D1609",
  },
  stars: {
    fontSize: 18,
    color: "#A73249",
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
    color: "#3D1609",
  },
  comment: {
    fontSize: 13,
    color: "#333",
    marginTop: 4,
  },
});
