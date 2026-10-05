import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

export interface EstimateItem {
  product: Product;
  quantity: number;
}

interface EstimateContextType {
  estimateItems: EstimateItem[];
  addToEstimate: (product: Product, quantity?: number) => void;
  removeFromEstimate: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearEstimate: () => void;
  totalEstimatePrice: number;
  totalItemsCount: number;
  isEstimateDrawerOpen: boolean;
  setIsEstimateDrawerOpen: (open: boolean) => void;
  isInEstimate: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

const ESTIMATE_STORAGE_KEY = 'ayyan_estimate_cart_items_v1';

export const EstimateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>(() => {
    try {
      const saved = localStorage.getItem(ESTIMATE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved estimate items:', e);
    }
    return [];
  });

  const [isEstimateDrawerOpen, setIsEstimateDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(estimateItems));
    } catch (e) {
      console.warn('Failed to save estimate items to localStorage:', e);
    }
  }, [estimateItems]);

  const addToEstimate = useCallback((product: Product, quantity: number = 1) => {
    setEstimateItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromEstimate = useCallback((productId: string) => {
    setEstimateItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromEstimate(productId);
      return;
    }
    setEstimateItems(prev => 
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  }, [removeFromEstimate]);

  const clearEstimate = useCallback(() => {
    setEstimateItems([]);
  }, []);

  const isInEstimate = useCallback((productId: string) => {
    return estimateItems.some(item => item.product.id === productId);
  }, [estimateItems]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = estimateItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }, [estimateItems]);

  const totalEstimatePrice = estimateItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItemsCount = estimateItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <EstimateContext.Provider
      value={{
        estimateItems,
        addToEstimate,
        removeFromEstimate,
        updateQuantity,
        clearEstimate,
        totalEstimatePrice,
        totalItemsCount,
        isEstimateDrawerOpen,
        setIsEstimateDrawerOpen,
        isInEstimate,
        getItemQuantity
      }}
    >
      {children}
    </EstimateContext.Provider>
  );
};

export const useEstimate = () => {
  const context = useContext(EstimateContext);
  if (!context) {
    throw new Error('useEstimate must be used within an EstimateProvider');
  }
  return context;
};
