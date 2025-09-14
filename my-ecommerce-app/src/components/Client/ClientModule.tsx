// src/components/Client/ClientModule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AppContextType, Product } from '../../interfaces';
import { ProductService, CategoryService } from '../../services';
import ProductPreviewCard from './ProductPreviewCard';
import ProductModal from './ProductModal';
import CartDisplay from './CartDisplay';
import CartTimer from './CartTimer';

interface ClientModuleProps {
  appContext: AppContextType;
}

const ClientModule: React.FC<ClientModuleProps> = ({ appContext }) => {
  const { 
    products, 
    setProducts, 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    updateCartItemQuantity,
    timeLeft,
    formatTime,
    isActive
  } = appContext;

  const [showCart, setShowCart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['Todas']);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error al cargar productos:', err.message);
        setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
      } else {
        console.error('Error inesperado al cargar productos:', err);
        setError('Ocurrió un error inesperado al cargar los productos.');
      }
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  const fetchProductCategories = useCallback(async () => {
    try {
      const response = await CategoryService.getCategories();
      const fetchedCategoryNames = response.data.map((cat: any) => cat.name);
      setAvailableCategories(['Todas', ...fetchedCategoryNames]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error al cargar categorías:', err.message);
      } else {
        console.error('Error inesperado al cargar categorías:', err);
      }
      setAvailableCategories(['Todas', 'Electrónicos', 'Ropa', 'Aseo', 'Comida', 'Otros']);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchProductCategories();
  }, [fetchProducts, fetchProductCategories]);

  const totalItemsInCart: number = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'Todas'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* Temporizador del carrito */}
      <CartTimer 
        timeLeft={timeLeft || 0}
        formatTime={formatTime || '0:00'}
        isActive={isActive || false}
      />
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 text-center mb-6 sm:mb-8">
          Bienvenido a nuestra Tienda
        </h2>

      <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg shadow-inner">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-3 sm:px-5 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300
              ${selectedCategory === category
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow'
              }`}
          >
            {category}
          </button>
        ))}
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="hidden sm:inline">Ver Carrito</span>
          <span className="sm:hidden">Carrito</span>
          ({totalItemsInCart})
        </button>
      </div>

      {showCart && (
        <CartDisplay
          products={products}
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          onClose={() => setShowCart(false)}
          updateCartItemQuantity={updateCartItemQuantity} // Pass the new function
        />
      )}

      {loading ? (
        <p className="text-center text-gray-600 text-xl">Cargando productos...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-xl">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-xl col-span-full">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductPreviewCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={showProductModal}
          onClose={handleCloseModal}
          addToCart={addToCart}
        />
      )}
      </div>
    </>
  );
};

export default ClientModule;