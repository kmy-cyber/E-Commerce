import { api, publicApi } from './api.config';
import { Product, ProductFormData } from '../interfaces';
import { ROUTES } from '../config/constants';

export class ProductService {
  static async getProducts() {
    return publicApi.get<Product[]>(ROUTES.PRODUCTS);
  }

  static async addProduct(productData: ProductFormData | FormData) {
    const config = productData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    return api.post<Product>(ROUTES.ADMIN.PRODUCTS, productData, config);
  }

  static async updateProduct(id: number, productData: ProductFormData | FormData) {
    const config = productData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    return api.put<Product>(`${ROUTES.ADMIN.PRODUCTS}/${id}`, productData, config);
  }

  static async deleteProduct(id: number) {
    return api.delete(`${ROUTES.ADMIN.PRODUCTS}/${id}`);
  }

  static async updateProductStock(id: number, quantity: number) {
    return publicApi.put(`${ROUTES.PRODUCTS}/${id}/stock`, { quantity });
  }

  static async restoreProductStock(id: number, quantity: number) {
    return publicApi.put(`${ROUTES.PRODUCTS}/${id}/restore-stock`, { quantity });
  }

  static async getAvailableStock(productId: number) {
    return publicApi.get(`${ROUTES.PRODUCTS}/${productId}/available-stock`);
  }
}