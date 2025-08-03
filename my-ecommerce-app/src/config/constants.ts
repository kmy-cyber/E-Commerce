export const API_CONFIG = {
  BASE_URL: "http://localhost:3002/api",
  TIMEOUT: 10000,
  CART_EXPIRY_MINUTES: 30,
};

export const ROUTES = {
  PRODUCTS: "/products",
  ADMIN: {
    PRODUCTS: "/admin/products",
    CATEGORIES: "/admin/categories",
    DASHBOARD: "/admin/dashboard",
    LOGIN: "/auth/login",
  },
  CATEGORIES: "/categories",
  RESERVATIONS: "/reservations",
};

export const STORAGE_KEYS = {
  ADMIN_TOKEN: "adminToken",
  CART_ID: "cartId",
};

export const FALLBACK_CATEGORIES = [
  "Electrónicos",
  "Ropa",
  "Aseo",
  "Comida",
  "Otros",
];