// hooks/useCollections.js
import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const useCollections = () => {
  const { authToken } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://your-api-url.com/api/collections";

  const getHeaders = (contentType = "application/json") => ({
    "Content-Type": contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  });

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  // CREATE
  const createCollection = useCallback(async (collectionData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", collectionData.name);
      formData.append("description", collectionData.description || "");
      formData.append("isActive", collectionData.isActive ?? true);

      if (collectionData.image) {
        formData.append("image", {
          uri: collectionData.image.uri,
          type: collectionData.image.type || "image/jpeg",
          name: collectionData.image.name || "collection_image.jpg",
        });
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders("multipart/form-data"),
        body: formData,
      });

      const result = await handleResponse(response, "Error al crear colección");
      setCollections(prev => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ALL
  const getAllCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener colecciones");
      setCollections(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ PUBLIC
  const getPublicCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/public`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener colecciones públicas");
      setCollections(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ONE BY ID
  const getCollectionById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener colección");
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // UPDATE
  const updateCollection = useCallback(async (id, collectionData) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (collectionData.name !== undefined) formData.append("name", collectionData.name);
      if (collectionData.description !== undefined) formData.append("description", collectionData.description);
      if (collectionData.isActive !== undefined) formData.append("isActive", collectionData.isActive);
      if (collectionData.image) {
        formData.append("image", {
          uri: collectionData.image.uri,
          type: collectionData.image.type || "image/jpeg",
          name: collectionData.image.name || "collection_image.jpg",
        });
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders("multipart/form-data"),
        body: formData,
      });

      const result = await handleResponse(response, "Error al actualizar colección");
      setCollections(prev => prev.map(c => (c._id === id ? result.data : c)));
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // DELETE
  const deleteCollection = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(response, "Error al eliminar colección");
      setCollections(prev => prev.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    collections,
    loading,
    error,
    createCollection,
    getAllCollections,
    getPublicCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    setCollections,
    setError
  };
};

export default useCollections;
