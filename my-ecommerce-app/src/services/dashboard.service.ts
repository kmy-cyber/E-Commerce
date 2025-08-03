import { api } from './api.config';
import { ROUTES } from '../config/constants';

export class DashboardService {
  static async getDashboardStats() {
    return api.get(`${ROUTES.ADMIN.DASHBOARD}/stats`);
  }

  static async getLowStockProducts(threshold?: number) {
    return api.get(`${ROUTES.ADMIN.DASHBOARD}/low-stock${threshold ? `?threshold=${threshold}` : ''}`);
  }

  static async getOutOfStockProducts() {
    return api.get(`${ROUTES.ADMIN.DASHBOARD}/out-of-stock`);
  }

  static async getSalesReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`${ROUTES.ADMIN.DASHBOARD}/sales-report${params.toString() ? `?${params.toString()}` : ''}`);
  }
}