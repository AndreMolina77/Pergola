import { useState, useContext, useCallback } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

const useCollections = () => {
  const { authToken } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "https://your-api-url.com/api/collections";

  const getHeaders = (contentType = 'application/json') => ({
    'Content-Type': contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` })
  });

  const handleError = useCallback((error, defaultMessage) => {
    console.error('Collections API Error:', error);
    
    let message = defaultMessage;
    if (error.message?.includes('Network')) {
      message = 'Error de conexión. Verifica tu internet.';
    } else if (error.message?.includes('timeout')) {
      message = 'La operación tardó demasiado tiempo.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    
    setError(message);
    return message;
  }, []);

  // CREATE
  const createCollection = useCallback(async (collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Agregar los campos de texto
      formData.append('name', collectionData.name);
      formData.append('description', collectionData.description || '');
      formData.append('isActive', collectionData.isActive !== undefined ? collectionData.isActive : true);
      
      // Agregar imagen si existe
      if (collectionData.image) {
        formData.append('image', {
          uri: collectionData.image.uri,
          type: collectionData.image.type || 'image/jpeg',
          name: collectionData.image.name || 'collection_image.jpg',
        });
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders('multipart/form-data'),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear colección');
      }

      // Actualizar la lista de colecciones localmente
      setCollections(prev => [...prev, result.data]);
      
      Alert.alert('Éxito', 'Colección creada con éxito');
      return { success: true, data: result.data };

    } catch (error) {
      const message = handleError(error, 'Error al crear colección');
      Alert.alert('Error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // READ ALL
  const getAllCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener colecciones');
      }

      setCollections(result);
      return { success: true, data: result };

    } catch (error) {
      const message = handleError(error, 'Error al obtener colecciones');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // READ PUBLIC COLLECTIONS
  const getPublicCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/public`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener colecciones públicas');
      }

      setCollections(result);
      return { success: true, data: result };

    } catch (error) {
      const message = handleError(error, 'Error al obtener colecciones públicas');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // READ ONE BY ID
  const getCollectionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener colección');
      }

      return { success: true, data: result };

    } catch (error) {
      const message = handleError(error, 'Error al obtener colección');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // UPDATE
  const updateCollection = useCallback(async (id, collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Agregar los campos que se van a actualizar
      if (collectionData.name !== undefined) {
        formData.append('name', collectionData.name);
      }
      if (collectionData.description !== undefined) {
        formData.append('description', collectionData.description);
      }
      if (collectionData.isActive !== undefined) {
        formData.append('isActive', collectionData.isActive);
      }
      
      // Agregar imagen si existe
      if (collectionData.image) {
        formData.append('image', {
          uri: collectionData.image.uri,
          type: collectionData.image.type || 'image/jpeg',
          name: collectionData.image.name || 'collection_image.jpg',
        });
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders('multipart/form-data'),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar colección');
      }

      // Actualizar la lista de colecciones localmente
      setCollections(prev => prev.map(collection => 
        collection._id === id ? result.data : collection
      ));
      
      Alert.alert('Éxito', 'Colección actualizada con éxito');
      return { success: true, data: result.data };

    } catch (error) {
      const message = handleError(error, 'Error al actualizar colección');
      Alert.alert('Error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // DELETE
  const deleteCollection = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar colección');
      }

      // Actualizar la lista de colecciones localmente
      setCollections(prev => prev.filter(collection => collection._id !== id));
      
      Alert.alert('Éxito', 'Colección eliminada con éxito');
      return { success: true };

    } catch (error) {
      const message = handleError(error, 'Error al eliminar colección');
      Alert.alert('Error', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // Función helper para mostrar confirmación antes de eliminar
  const confirmDeleteCollection = useCallback((id, collectionName) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar la colección "${collectionName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteCollection(id),
        },
      ]
    );
  }, [deleteCollection]);

  return {
    // State
    collections,
    loading,
    error,
    
    // Actions
    createCollection,
    getAllCollections,
    getPublicCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    confirmDeleteCollection,
    
    // Utils
    setCollections,
    setError,
  };
};

export default useCollections;