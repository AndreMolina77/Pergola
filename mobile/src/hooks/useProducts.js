// hooks/useProducts.js
import { useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const useProducts = () => {
  const { authToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración de la API
  const API_URL = 'https://pergola-production.up.railway.app/api'; // Cambia por tu URL
  
  // Headers base para las requests
  const getHeaders = (contentType = 'application/json') => ({
    'Content-Type': contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` })
  });

  // Helper para manejar errores
  const handleError = useCallback((error, defaultMessage) => {
    console.error('Products API Error:', error);
    
    let message = defaultMessage;
    if (error.message.includes('Network')) {
      message = 'Error de conexión. Verifica tu internet.';
    } else if (error.message.includes('timeout')) {
      message = 'La operación tardó demasiado tiempo.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    
    setError(message);
    return message;
  }, []);

  // CREATE - Crear producto
  const createProduct = useCallback(async (productData, images = []) => {
    try {
      setLoading(true);
      setError(null);

      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Agregar datos del producto
      Object.keys(productData).forEach(key => {
        if (productData[key] !== undefined && productData[key] !== null) {
          if (Array.isArray(productData[key])) {
            productData[key].forEach(item => {
              formData.append(key, item);
            });
          } else {
            formData.append(key, productData[key]);
          }
        }
      });

      // Agregar imágenes si existen
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.name || `product_image_${index}.jpg`
          });
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` })
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Actualizar lista local
      setProducts(prev => [...prev, data.data]);
      
      return { success: true, data: data.data };
    } catch (error) {
      const errorMessage = handleError(error, 'Error al crear el producto');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // READ - Obtener todos los productos
  const getProducts = useCallback(async (isPublic = false) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isPublic ? '/products/public' : '/products';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = handleError(error, 'Error al obtener productos');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, getHeaders, handleError]);

  // READ - Obtener producto por ID
  const getProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'GET',
        headers: getHeaders(),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = handleError(error, 'Error al obtener el producto');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, getHeaders, handleError]);

  // UPDATE - Actualizar producto
  const updateProduct = useCallback(async (productId, updates, newImages = []) => {
    try {
      setLoading(true);
      setError(null);

      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Agregar datos de actualización
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
          if (Array.isArray(updates[key])) {
            updates[key].forEach(item => {
              formData.append(key, item);
            });
          } else {
            formData.append(key, updates[key]);
          }
        }
      });

      // Agregar nuevas imágenes si existen
      if (newImages && newImages.length > 0) {
        newImages.forEach((image, index) => {
          formData.append('images', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.name || `product_update_${index}.jpg`
          });
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` })
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Actualizar lista local
      setProducts(prev => 
        prev.map(product => 
          product._id === productId ? data.data : product
        )
      );
      
      return { success: true, data: data.data };
    } catch (error) {
      const errorMessage = handleError(error, 'Error al actualizar el producto');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, handleError]);

  // DELETE - Eliminar producto
  const deleteProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Eliminar de la lista local
      setProducts(prev => prev.filter(product => product._id !== productId));
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleError(error, 'Error al eliminar el producto');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, getHeaders, handleError]);

  // Helper para confirmar eliminación
  const confirmDeleteProduct = useCallback((productId, productName, onConfirm) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar "${productName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onConfirm(productId)
        }
      ]
    );
  }, []);

  // Helper para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper para filtrar productos
  const filterProducts = useCallback((searchTerm, category = null, highlighted = null) => {
    return products.filter(product => {
      const matchesSearch = searchTerm ? 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codeProduct.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesCategory = category ? 
        product.category?._id === category || product.category?.name === category 
        : true;
      
      const matchesHighlighted = highlighted !== null ? 
        product.highlighted === highlighted 
        : true;

      return matchesSearch && matchesCategory && matchesHighlighted;
    });
  }, [products]);

  // Helper para obtener productos destacados
  const getHighlightedProducts = useCallback(() => {
    return products.filter(product => product.highlighted);
  }, [products]);

  return {
    // Estado
    products,
    loading,
    error,
    
    // Acciones CRUD
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    
    // Helpers
    confirmDeleteProduct,
    clearError,
    filterProducts,
    getHighlightedProducts,
    
    // Setters adicionales
    setProducts,
    setError
  };
};

export default useProducts;