import AsyncStorage from "@react-native-async-storage/async-storage";

// Guardar un valor en AsyncStorage
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`❌ Error guardando en AsyncStorage (${key}):`, error);
  }
};

// Obtener un valor desde AsyncStorage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`❌ Error obteniendo de AsyncStorage (${key}):`, error);
    return null;
  }
};

// Eliminar un valor de AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Error eliminando de AsyncStorage (${key}):`, error);
  }
};

// Limpiar todo el almacenamiento
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("❌ Error limpiando AsyncStorage:", error);
  }
};
