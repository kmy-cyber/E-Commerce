import { api } from './api.config';
import { ROUTES, STORAGE_KEYS } from '../config/constants';

export class AuthService {
  static async loginAdmin(password: string) {
    return api.post<{ token: string }>(ROUTES.ADMIN.LOGIN, { password });
  }

  static setAdminToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
  }

  static removeAdminToken() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  }
}