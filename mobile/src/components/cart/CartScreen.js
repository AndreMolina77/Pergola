// src/screens/cart/CartScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

export default function CartScreen({ navigation }) {
  // Datos de prueba (después conectamos con contexto o API)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Anillo de plata",
      description: "Diseño elegante",
      image: "https://via.placeholder.com/60",
      price: 25,
    },
    {
      id: 2,
      name: "Pulsera dorada",
      description: "Detalles modernos",
      image: "https://via.placeholder.com/60",
      price: 30,
    },
  ]);

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = cartItems.length > 0 ? 5 : 0;
  const discount = subtotal > 50 ? 5 : 0;
  const total = subtotal + shipping - discount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito</Text>
      </View>

      {/* Sección de productos */}
      <View style={styles.cartSection}>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearAll}>
            <Text style={styles.clearAllText}>Borrar todo</Text>
          </TouchableOpacity>
        )}
        {cartItems.length > 0 ? (
          <ScrollView style={styles.scroll}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          </View>
        )}
      </View>

      {/* Resumen de precios */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coste envío</Text>
          <Text style={styles.summaryValue}>${shipping}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Descuento</Text>
          <Text style={styles.summaryValue}>-${discount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>
            ${total}
          </Text>
        </View>
      </View>

      {/* Botón de pagar */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payText}>Proceder con el pago</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#3D1609",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#3D1609",
    marginRight: 48, // compensa espacio del back
  },
  cartSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    height: 374,
    marginBottom: 16,
    position: "relative",
  },
  scroll: {
    flex: 1,
  },
  clearAll: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  clearAllText: {
    fontSize: 12,
    color: "#A73249",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    height: 80,
    alignItems: "center",
  },
  itemImage: {
    width: "20%",
    height: "100%",
    borderRadius: 6,
    marginRight: 8,
  },
  itemInfo: {
    width: "80%",
    justifyContent: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D1609",
  },
  itemDescription: {
    fontSize: 12,
    color: "#555",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
  },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    height: 128,
    justifyContent: "space-between",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#333",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  totalLabel: {
    fontWeight: "700",
  },
  totalValue: {
    fontWeight: "700",
    color: "#A73249",
  },
  payButton: {
    backgroundColor: "#A73249",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
