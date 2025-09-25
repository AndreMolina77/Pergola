import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";

// Obtener todos los diseños personalizados
export const getCustomDesigns = async () => {
  try {
    const response = await apiClient.get(endpoints.customDesigns.base);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener diseños personalizados:", error.response?.data || error.message);
    throw error;
  }
};

// Crear un diseño personalizado
export const createCustomDesign = async (designData) => {
  try {
    const response = await apiClient.post(endpoints.customDesigns.base, designData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear diseño personalizado:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener un diseño por ID
export const getCustomDesignById = async (id) => {
  try {
    const response = await apiClient.get(endpoints.customDesigns.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener diseño personalizado:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un diseño
export const updateCustomDesign = async (id, designData) => {
  try {
    const response = await apiClient.put(endpoints.customDesigns.byId(id), designData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar diseño personalizado:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un diseño
export const deleteCustomDesign = async (id) => {
  try {
    const response = await apiClient.delete(endpoints.customDesigns.byId(id));
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar diseño personalizado:", error.response?.data || error.message);
    throw error;
  }
};
