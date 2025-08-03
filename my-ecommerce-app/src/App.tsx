import React, { useState } from "react";
import { AppContextType } from "./interfaces";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/layout/Layout";
import ClientModule from "./components/Client/ClientModule";
import AdminModule from "./components/Admin/AdminModule";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';
import "./index.css";

const App: React.FC = () => {
  const [view, setView] = useState<"client" | "admin">("client");

  // Hooks personalizados para manejar la lógica de negocio
  const { products, setProducts } = useProducts();
  const { isAdminLoggedIn, handleAdminLogin, handleAdminLogout } = useAuth();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    cartId,
    timeLeft,
    formatTime,
    isActive,
  } = useCart(products);

  // Valor del contexto de la aplicación
  const appContextValue: AppContextType = {
    products,
    setProducts,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    isAdminLoggedIn,
    handleAdminLogin,
    handleAdminLogout,
    setView,
    cartId,
    timeLeft,
    formatTime,
    isActive: isActive && cart.length > 0,
  };

  return (
    <AppProvider value={appContextValue}>
      <Layout view={view} onViewChange={setView}>
        {view === "client" ? (
          <ClientModule appContext={appContextValue} />
        ) : (
          <AdminModule appContext={appContextValue} />
        )}
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="colored"
        toastStyle={{
          borderRadius: '8px',
          fontWeight: '500'
        }}
        style={{
          width: 'auto',
          maxWidth: '500px'
        }}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppProvider>
  );
};

export default App;
