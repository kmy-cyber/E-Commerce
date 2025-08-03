import { useState } from 'react';
import { AuthService } from '../services';

export const useAuth = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(AuthService.isAuthenticated());

  const handleAdminLogin = async (password: string): Promise<boolean> => {
    try {
      const response = await AuthService.loginAdmin(password);
      if (response.data.token) {
        AuthService.setAdminToken(response.data.token);
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Error de login:', error);
      return false;
    }
  };

  const handleAdminLogout = () => {
    AuthService.removeAdminToken();
    setIsAdminLoggedIn(false);
  };

  return {
    isAdminLoggedIn,
    handleAdminLogin,
    handleAdminLogout
  };
};