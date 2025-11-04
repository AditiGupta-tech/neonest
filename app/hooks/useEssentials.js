import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const useEssentials = () => {
  const { isAuth } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  // Fetch inventory from API
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api/essentials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch inventory");
      }

      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  // Add new item
  const addItem = useCallback(async (newItem) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api/essentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add item");
      }

      const addedItem = await response.json();
      setInventory(prev => [...prev, addedItem]);
      return addedItem;
    } catch (err) {
      setError(err.message);
      console.error("Error adding item:", err);
      throw err;
    }
  }, [getAuthToken]);

  // Update item
  const updateItem = useCallback(async (id, updatedItem) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`/api/essentials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      const updatedItemData = await response.json();
      setInventory(prev => prev.map(item => item._id === id ? updatedItemData : item));
      return updatedItemData;
    } catch (err) {
      setError(err.message);
      console.error("Error updating item:", err);
      throw err;
    }
  }, [getAuthToken]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`/api/essentials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete item");
      }

      setInventory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting item:", err);
      throw err;
    }
  }, [getAuthToken]);

  // Update stock
  const updateStock = useCallback(async (id, newStock) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`/api/essentials/stock/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentStock: parseInt(newStock) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update stock");
      }

      const updatedItem = await response.json();
      setInventory(prev => prev.map(item => item._id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      console.error("Error updating stock:", err);
      throw err;
    }
  }, [getAuthToken]);

  // Computed values
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minThreshold);
  const outOfStockItems = inventory.filter(item => item.currentStock === 0);
  
  const stats = {
    totalItems: inventory.length,
    lowStockCount: lowStockItems.length,
    outOfStockCount: outOfStockItems.length,
    inStockCount: inventory.length - lowStockItems.length,
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data
  useEffect(() => {
    if (isAuth) {
      fetchInventory();
    } else {
      setInventory([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isAuth, fetchInventory]);

  return {
    inventory,
    isLoading,
    error,
    lowStockItems,
    outOfStockItems,
    stats,
    actions: {
      fetchInventory,
      addItem,
      updateItem,
      deleteItem,
      updateStock,
      clearError,
    },
  };
};

export default useEssentials;