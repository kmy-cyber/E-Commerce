import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants';

export const useCartId = () => {
  const [cartId, setCartId] = useState<string>('');

  useEffect(() => {
    // Intentar obtener el ID del carrito desde localStorage
    let existingCartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
    
    if (!existingCartId) {
      // Generar un nuevo ID único para el carrito
      existingCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(STORAGE_KEYS.CART_ID, existingCartId);
    }
    
    setCartId(existingCartId);
  }, []);

  const clearCartId = () => {
    localStorage.removeItem(STORAGE_KEYS.CART_ID);
    const newCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.CART_ID, newCartId);
    setCartId(newCartId);
  };

  return { cartId, clearCartId };
};