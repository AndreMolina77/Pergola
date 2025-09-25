import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";

// Obtener todos los pedidos
export const getOrders = async () => {
  try {
    const response = await apiClient.get(endpoints.orders.base);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error.response?.data || error.message);
    throw error;
  }
};

// Crear un pedido
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(endpoints.orders.base, orderData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear pedido:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener un pedido por ID
export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(endpoints.orders.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener pedido:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un pedido
export const updateOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(endpoints.orders.byId(id), orderData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar pedido:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un pedido
export const deleteOrder = async (id) => {
  try {
    const response = await apiClient.delete(endpoints.orders.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error.response?.data || error.message);
    throw error;
  }
};
