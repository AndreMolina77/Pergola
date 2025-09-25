import { storeData, getData, removeData } from "./storage/asyncStorageService";

const CART_KEY = "cart";

// Obtener carrito
export const getCart = async () => {
  const cart = await getData(CART_KEY);
  return cart || [];
};

// Agregar producto al carrito
export const addToCart = async (item) => {
  try {
    const cart = await getCart();
    cart.push(item);
    await storeData(CART_KEY, cart);
    return cart;
  } catch (error) {
    console.error("❌ Error agregando al carrito:", error);
  }
};

// Eliminar producto por ID
export const removeFromCart = async (itemId) => {
  try {
    let cart = await getCart();
    cart = cart.filter((item) => item.id !== itemId);
    await storeData(CART_KEY, cart);
    return cart;
  } catch (error) {
    console.error("❌ Error eliminando del carrito:", error);
  }
};

// Vaciar carrito
export const clearCart = async () => {
  try {
    await removeData(CART_KEY);
  } catch (error) {
    console.error("❌ Error vaciando el carrito:", error);
  }
};
