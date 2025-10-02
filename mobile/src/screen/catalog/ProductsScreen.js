// src/screens/catalog/ProductsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductGrid from "../../components/product/ProductGrid";

// 👉 productos mockeados con reviews incluidos
const mockProducts = [
  {
    id: 1,
    name: "Anillo de Plata Elegante",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Jewellery_ring_icon.png/240px-Jewellery_ring_icon.png",
    price: 39.99,
    description: "Anillo de plata esterlina 925 con acabado pulido.",
    reviews: [
      { id: 1, user: "Ana", rating: 5, comment: "Me encantó el diseño." },
      { id: 2, user: "Carlos", rating: 4, comment: "Muy bonito, talla exacta." },
    ],
  },
  {
    id: 2,
    name: "Pulsera de Oro Laminado",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Bracelet_icon.png/240px-Bracelet_icon.png",
    price: 49.99,
    description: "Pulsera ajustable de oro laminado de 18k.",
    reviews: [{ id: 1, user: "Lucía", rating: 5, comment: "Se ve de lujo." }],
  },
  {
    id: 3,
    name: "Collar con Dije de Corazón",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Necklace_icon.png/240px-Necklace_icon.png",
    price: 29.99,
    description: "Collar con dije en forma de corazón, acero inoxidable.",
    reviews: [],
  },
  {
    id: 4,
    name: "Aretes de Acero Inoxidable",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Earrings_icon.png/240px-Earrings_icon.png",
    price: 19.99,
    description: "Aretes antialérgicos de acero inoxidable.",
    reviews: [{ id: 1, user: "Marta", rating: 4, comment: "Buenos y económicos." }],
  },
  {
    id: 5,
    name: "Tobillera Bronce Minimalista",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Footwear_icon.png/240px-Footwear_icon.png",
    price: 24.99,
    description: "Tobillera minimalista de bronce, ajustable.",
    reviews: [],
  },
];

export default function ProductsScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const handleClearSearch = () => setSearch("");

  return (
    <View style={styles.container}>
      {/* Header con volver + búsqueda */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearSearch}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
      >
        <TouchableOpacity style={[styles.chip, { backgroundColor: "#A73249" }]}>
          <Text style={styles.chipText}>Descuento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chip, { backgroundColor: "#3D1609" }]}>
          <Text style={styles.chipText}>Precio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chip, { backgroundColor: "#E8E1D8" }]}>
          <Text style={[styles.chipText, { color: "#3D1609" }]}>
            Ordenar por:
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chip, { backgroundColor: "#3D1609" }]}>
          <Text style={styles.chipText}>Ofertas</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Resultados */}
      <Text style={styles.resultsText}>
        Total de resultados: {mockProducts.length}
      </Text>

      {/* Grid de productos */}
      <ProductGrid
        products={mockProducts}
        onPress={(product) =>
          navigation.navigate("ProductDetail", { product }) // 👈 lleva reviews también
        }
        onFavorite={(product) => console.log("Favorito:", product)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3D1609",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  searchContainer: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#E8E1D8",
    borderWidth: 1,
    borderColor: "#A73249",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#3D1609",
  },
  clearBtn: {
    paddingHorizontal: 6,
  },
  clearText: {
    fontSize: 18,
    color: "#A73249",
  },
  filtersRow: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "row",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  resultsText: {
    fontSize: 12,
    color: "#3D1609",
    marginLeft: 16,
    marginBottom: 4,
  },
});
