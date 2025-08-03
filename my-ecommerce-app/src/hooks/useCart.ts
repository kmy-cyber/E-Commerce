import { useState, useCallback } from 'react';
import { CartItem, Product } from '../interfaces';
import { ProductService, CartService } from '../services';
import { useCartId } from './useCartId';
import { useCartTimer } from './useCartTimer';
import { API_CONFIG } from '../config/constants';
import { toast } from 'react-toastify';

export const useCart = (products: Product[]) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { cartId } = useCartId();

  const handleCartTimeout = useCallback(async () => {
    console.log('Carrito expirado, liberando reservas...');
    try {
      await CartService.releaseReservation(cartId);
      setCart([]);
      toast.info('Tu carrito ha expirado. Los productos han sido liberados para otros usuarios.');
    } catch (error) {
      console.error('Error al liberar reservas:', error);
    }
  }, [cartId]);

  const { timeLeft, isActive, resetTimer, stopTimer, formatTime } = useCartTimer(cartId, handleCartTimeout);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Producto no encontrado.');
        return;
      }

      const availableStockResponse = await ProductService.getAvailableStock(productId);
      const availableStock = availableStockResponse.data.availableStock;

      const existingCartItem = cart.find(item => item.productId === productId);
      const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
      const totalQuantityInCart = currentCartQuantity + quantity;

      if (totalQuantityInCart > availableStock) {
        const availableToAdd = availableStock - currentCartQuantity;
        if (availableToAdd <= 0) {
          toast.warning(`Este producto está temporalmente agotado o reservado por otros usuarios. Stock disponible: ${availableStock}`);
        } else {
          toast.warning(`Solo puedes agregar ${availableToAdd} unidades más de este producto. Stock disponible: ${availableStock}, ya tienes ${currentCartQuantity} en el carrito.`);
        }
        return;
      }

      await CartService.reserveStock(cartId, productId, quantity);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + API_CONFIG.CART_EXPIRY_MINUTES * 60 * 1000);

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === productId
              ? { 
                  ...item, 
                  quantity: item.quantity + quantity,
                  reservedAt: now,
                  expiresAt: expiresAt
                }
              : item
          );
        } else {
          return [...prevCart, { 
            productId, 
            quantity,
            reservedAt: now,
            expiresAt: expiresAt
          }];
        }
      });

      if (!isActive) {
        resetTimer();
      }

      console.log(`${quantity} unidad(es) de ${product.name} reservadas temporalmente en el carrito.`);

    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error al agregar el producto al carrito. Por favor, intenta de nuevo.');
      }
      throw error;
    }
  }, [products, cart, cartId, isActive, resetTimer]);

  const removeFromCart = useCallback(async (productId: number) => {
    try {
      const cartItem = cart.find(item => item.productId === productId);
      if (!cartItem) {
        console.log('Item no encontrado en el carrito');
        return;
      }

      try {
        await CartService.releaseReservation(cartId, productId);
        console.log('Reserva liberada exitosamente');
      } catch (error) {
        console.warn('Error al liberar reserva:', error);
      }

      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
      
      if (cart.length === 1) {
        stopTimer();
      }
      
      console.log('Producto removido exitosamente del carrito');
      
    } catch (error: any) {
      console.error('Error al remover del carrito:', error);
      toast.error('Error al remover el producto del carrito. Por favor, intenta de nuevo.');
    }
  }, [cart, cartId, stopTimer]);

  const clearCart = useCallback(async () => {
    try {
      try {
        await CartService.releaseReservation(cartId);
        console.log('Todas las reservas liberadas exitosamente');
      } catch (error) {
        console.warn('Error al liberar reservas:', error);
      }

      setCart([]);
      stopTimer();
      console.log('Carrito vaciado exitosamente');
      
    } catch (error: any) {
      console.error('Error al limpiar carrito:', error);
      toast.error('Error al limpiar el carrito. Por favor, intenta de nuevo.');
    }
  }, [cartId, stopTimer]);

  const updateCartItemQuantity = useCallback(async (productId: number, newQuantity: number) => {
    try {
      const currentCartItem = cart.find(item => item.productId === productId);
      if (!currentCartItem) return;

      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error('Producto no encontrado');
        return;
      }

      if (newQuantity < product.minOrderQuantity) {
        toast.warning(`La cantidad mínima para este producto es ${product.minOrderQuantity} unidades.`);
        return;
      }

      if (newQuantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const availableStockResponse = await ProductService.getAvailableStock(productId);
      const availableStock = availableStockResponse.data.availableStock + currentCartItem.quantity;

      if (newQuantity > availableStock) {
        toast.warning(`No puedes tener más de ${availableStock} unidades de este producto en el carrito (stock disponible considerando reservas).`);
        return;
      }

      const quantityDifference = newQuantity - currentCartItem.quantity;

      if (quantityDifference > 0) {
        await CartService.reserveStock(cartId, productId, quantityDifference);
      } else if (quantityDifference < 0) {
        await CartService.releaseReservation(cartId, productId);
        await CartService.reserveStock(cartId, productId, newQuantity);
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + API_CONFIG.CART_EXPIRY_MINUTES * 60 * 1000);

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId
            ? { 
                ...item, 
                quantity: newQuantity,
                reservedAt: now,
                expiresAt: expiresAt
              }
            : item
        )
      );

      console.log(`Cantidad actualizada en carrito: ${newQuantity}`);

    } catch (error: any) {
      console.error('Error al actualizar cantidad en carrito:', error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error al actualizar la cantidad. Por favor, intenta de nuevo.');
      }
    }
  }, [cart, cartId, removeFromCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    cartId,
    timeLeft,
    formatTime,
    isActive: isActive && cart.length > 0,
  };
};