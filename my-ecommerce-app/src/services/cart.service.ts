import { publicApi } from './api.config';
import { ROUTES } from '../config/constants';

export class CartService {
  static async reserveStock(cartId: string, productId: number, quantity: number) {
    return publicApi.post(`${ROUTES.PRODUCTS}/${productId}/reserve`, { cartId, quantity });
  }

  static async releaseReservation(cartId: string, productId?: number) {
    return publicApi.delete(`${ROUTES.RESERVATIONS}/${cartId}${productId ? `/${productId}` : ''}`);
  }

  static async confirmReservation(cartId: string) {
    return publicApi.post(`${ROUTES.RESERVATIONS}/${cartId}/confirm`);
  }

  static async createOrder(cartId: string, customerData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress?: string;
    notes?: string;
  }) {
    return publicApi.post(`${ROUTES.RESERVATIONS}/${cartId}/create-order`, customerData);
  }
}