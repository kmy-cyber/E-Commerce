// src/components/Admin/ProductListAdmin.tsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { Product } from "../../interfaces"; // Importa la interfaz Product
import { ProductService } from "../../services"; // Importa el servicio de productos

interface ProductListAdminProps {
  products: Product[];
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  fetchProducts: () => void;
  setActiveTab: (tabId: string) => void;
}

const ProductListAdmin: React.FC<ProductListAdminProps> = ({
  products,
  setEditingProduct,
  fetchProducts,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const categorySet = new Set(products.map((product) => product.category));
    const uniqueCategories = Array.from(categorySet);
    return uniqueCategories.sort();
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleDelete = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await ProductService.deleteProduct(id);
        alert("Producto eliminado con éxito!");
        fetchProducts();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error al eliminar producto:", error.message);
          alert(
            "Error al eliminar el producto. Asegúrate de que el backend esté funcionando y estés autenticado."
          );
        } else {
          console.error("Error inesperado al eliminar producto:", error);
          alert("Ocurrió un error inesperado al eliminar el producto.");
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header de la sección */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Inventario de Productos
              </h3>
              <p className="text-teal-100 text-sm">
                Gestiona y edita tus productos
              </p>
            </div>
          </div>
          {(searchTerm || selectedCategory) && (
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-white text-sm font-medium">
                Filtros activos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda por nombre */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar productos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="sm:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm appearance-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div>
            Mostrando {filteredProducts.length} de {products.length} productos
            {searchTerm && (
              <span className="ml-2 text-teal-600 font-medium">
                • Búsqueda: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="ml-2 text-teal-600 font-medium">
                • Categoría: {selectedCategory}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredProducts.length === 0 ? (
          searchTerm || selectedCategory ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron productos
              </h4>
              <p className="text-gray-500 mb-4">
                No hay productos que coincidan con los filtros aplicados.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                No hay productos
              </h4>
              <p className="text-gray-500">
                Comienza agregando tu primer producto usando el formulario de
                arriba.
              </p>
            </div>
          )
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              No hay productos
            </h4>
            <p className="text-gray-500">
              Comienza agregando tu primer producto usando el formulario de
              arriba.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span>Producto</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span>Categoría</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span>Precio</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <span>Stock</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {/* Display product image instead of initial */}
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              product.imageUrl ||
                              `https://placehold.co/64x64/ADD8E6/000000?text=Producto`
                            }
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none"; // Hide the broken image
                              const errorDiv =
                                target.nextElementSibling as HTMLDivElement;
                              if (errorDiv) {
                                errorDiv.style.display = "flex"; // Show the fallback div
                              }
                            }}
                          />
                          <div
                            className="hidden absolute inset-0 bg-gray-200 items-center justify-center text-gray-600 font-medium text-xs text-center p-1"
                            style={{ display: "none" }} // Initially hidden
                          >
                            No Image
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description || "Sin descripción"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-lg font-bold text-green-600">
                        ${Number(product.enrollmentPrice).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            product.stock > 10
                              ? "bg-green-400"
                              : product.stock > 0
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <span
                          className={`font-semibold ${
                            product.stock > 10
                              ? "text-green-600"
                              : product.stock > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setActiveTab("add-product"); // Set active tab to 'add-product' when editing
                          }}
                          className="flex items-center space-x-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListAdmin;
