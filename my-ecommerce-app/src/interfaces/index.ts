// src/interfaces/index.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  enrollmentPrice: number;
  stock: number;
  category: string;
  minOrderQuantity: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
  reservedAt?: Date;
  expiresAt?: Date;
}

export interface StockReservation {
  cartId: string;
  productId: number;
  quantity: number;
  reservedAt: Date;
  expiresAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  imageUrl: string;
  enrollmentPrice: number | '';
  stock: number | '';
  category: string;
  minOrderQuantity: number | '';
}

export interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateCartItemQuantity: (productId: number, newQuantity: number) => Promise<void>;
  isAdminLoggedIn: boolean;
  handleAdminLogin: (password: string) => Promise<boolean>;
  handleAdminLogout: () => void;
  setView: React.Dispatch<React.SetStateAction<'client' | 'admin'>>;
  cartId?: string;
  timeLeft?: number;
  formatTime?: string;
  isActive?: boolean;
}

// New interfaces for Toast
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

// Footer configuration interfaces
export interface FooterConfig {
  id?: number;
  companyName: string;
  companyDescription: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  showSocialMedia: boolean;
  copyrightText: string;
}