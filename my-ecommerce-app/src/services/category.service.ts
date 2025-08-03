import { api, publicApi } from './api.config';
import { ROUTES } from '../config/constants';

export class CategoryService {
  static async getCategories() {
    return publicApi.get(ROUTES.CATEGORIES);
  }

  static async getCategoryById(id: number) {
    return publicApi.get(`${ROUTES.CATEGORIES}/${id}`);
  }

  static async createCategory(categoryData: { name: string; description?: string }) {
    return api.post(ROUTES.ADMIN.CATEGORIES, categoryData);
  }

  static async updateCategory(id: number, categoryData: { name: string; description?: string }) {
    return api.put(`${ROUTES.ADMIN.CATEGORIES}/${id}`, categoryData);
  }

  static async deleteCategory(id: number) {
    return api.delete(`${ROUTES.ADMIN.CATEGORIES}/${id}`);
  }

  static async getCategoryStats() {
    return api.get(`${ROUTES.ADMIN.CATEGORIES}/stats/all`);
  }
}