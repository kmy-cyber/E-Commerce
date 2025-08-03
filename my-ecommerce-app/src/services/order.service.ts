import { api } from "./api.config";

export class OrderService {
  static async getPendingOrders() {
    try {
      const response = await api.get("/orders/pending");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getAllOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    console.log("🚀 OrderService: Haciendo petición GET a /orders", params);
    try {
      const response = await api.get("/orders", { params });
      console.log("✅ OrderService: Respuesta exitosa de /orders", response);
      return response;
    } catch (error) {
      console.error("❌ OrderService: Error en /orders", error);
      throw error;
    }
  }

  static async confirmOrder(orderId: number) {
    console.log(`🚀 OrderService: Confirmando orden ${orderId}`);
    try {
      const response = await api.post(`/orders/${orderId}/confirm`);
      console.log("✅ OrderService: Orden confirmada exitosamente", response);
      return response;
    } catch (error) {
      console.error("❌ OrderService: Error al confirmar orden", error);
      throw error;
    }
  }

  static async rejectOrder(orderId: number, reason?: string) {
    console.log(`🚀 OrderService: Rechazando orden ${orderId}`, reason);
    try {
      const response = await api.post(`/orders/${orderId}/reject`, { reason });
      console.log("✅ OrderService: Orden rechazada exitosamente", response);
      return response;
    } catch (error) {
      console.error("❌ OrderService: Error al rechazar orden", error);
      throw error;
    }
  }
}
