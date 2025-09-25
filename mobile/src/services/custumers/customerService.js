import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";

// Obtener perfil del cliente autenticado
export const getCustomerProfile = async () => {
  try {
    const response = await apiClient.get(endpoints.customers.profile);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener cliente por ID
export const getCustomerById = async (id) => {
  try {
    const response = await apiClient.get(endpoints.customers.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar perfil de cliente
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await apiClient.put(endpoints.customers.byId(id), customerData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar cliente por ID
export const deleteCustomer = async (id) => {
  try {
    const response = await apiClient.delete(endpoints.customers.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error.response?.data || error.message);
    throw error;
  }
};
