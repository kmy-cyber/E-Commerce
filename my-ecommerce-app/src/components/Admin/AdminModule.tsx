// src/components/Admin/AdminModule.tsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { AppContextType, Product } from "../../interfaces"; // Importa las interfaces
import { ProductService } from "../../services"; // Importa el servicio de productos
import AdminLogin from "./AdminLogin"; // Importa el componente AdminLogin
import AddProductForm from "./AddProductForm"; // Importa el componente AddProductForm
import ProductListAdmin from "./ProductListAdmin"; // Importa el componente ProductListAdmin
import AdminDashboard from "./AdminDashboard"; // Importa el componente AdminDashboard
import CategoryManager from "./CategoryManager"; // Importa el componente CategoryManager
import OrderManagement from "./OrderManagement"; // Importa el componente OrderManagement
import ConfigurationManager from "./ConfigurationManager"; // Importa el componente ConfigurationManager

interface AdminModuleProps {
  appContext: AppContextType; //
}

const AdminModule: React.FC<AdminModuleProps> = ({ appContext }) => {
  const {
    isAdminLoggedIn,
    handleAdminLogin,
    handleAdminLogout,
    products,
    setProducts,
  } = appContext; //

  const [editingProduct, setEditingProduct] = useState<Product | null>(null); //
  const [activeTab, setActiveTab] = useState<string>("dashboard"); //

  // Función para cargar productos
  const fetchProducts = useCallback(async () => { //
    try {
      const response = await ProductService.getProducts(); //
      setProducts(response.data); //
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) { //
        console.error(
          "Error al cargar productos para el admin:",
          error.message
        ); //
        alert(
          "Error al cargar productos. Asegúrate de que el backend esté funcionando."
        ); //
      } else {
        console.error(
          "Error inesperado al cargar productos para el admin:",
          error
        ); //
        alert("Ocurrió un error inesperado al cargar los productos."); //
      }
    }
  }, [setProducts]); //

  useEffect(() => {
    if (isAdminLoggedIn) { //
      fetchProducts(); //
    }
  }, [isAdminLoggedIn, fetchProducts]); //

  if (!isAdminLoggedIn) {
    return <AdminLogin handleAdminLogin={handleAdminLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header moderno */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-2 sm:p-3 rounded-xl flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent truncate">
                  Panel de Administración
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">
                  Gestiona tu inventario y productos
                </p>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              className="flex items-center justify-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex-shrink-0 text-xs sm:text-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Cerrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-4 lg:space-x-8">
            {[
              {
                id: "dashboard",
                name: "Dashboard",
                shortName: "Dashboard",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                id: "products",
                name: "Productos",
                shortName: "Productos",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
              },
              {
                id: "add-product",
                name: "Agregar Producto",
                shortName: "Agregar",
                icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
              },
              {
                id: "categories",
                name: "Categorías",
                shortName: "Categorías",
                icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
              },
              {
                id: "orders",
                name: "Órdenes",
                shortName: "Órdenes",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                id: "settings",
                name: "Configuración",
                shortName: "Config",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-3 lg:px-4 border-b-4 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-300 min-w-0 flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.shortName}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && <AdminDashboard products={products} setActiveTab={setActiveTab} />}

        {activeTab === "products" && (
          <ProductListAdmin
            products={products}
            setEditingProduct={setEditingProduct}
            fetchProducts={fetchProducts}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "add-product" && (
          <AddProductForm
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            fetchProducts={fetchProducts}
          />
        )}

        {activeTab === "categories" && <CategoryManager products={products} />}

        {activeTab === "orders" && <OrderManagement />}

        {activeTab === "settings" && <ConfigurationManager />}
      </div>
    </div>
  );
};

export default AdminModule;