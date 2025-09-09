// src/components/Client/ProductModal.tsx
import React, { useState } from 'react';
import { Product } from '../../interfaces';
import { toast } from 'react-toastify';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  addToCart: (productId: number, quantity: number) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const handleAddToCart = async () => {
    if (quantity < product.minOrderQuantity) {
      toast.warning(`La cantidad mínima para este producto es ${product.minOrderQuantity} unidades.`);
      return;
    }
    
    if (product.stock !== undefined && product.stock >= quantity) {
      try {
        await addToCart(product.id, quantity);
        toast.success(`${quantity} unidad(es) de ${product.name} añadidas al carrito.`);
        onClose();
      } catch (error) {
        // El error ya se maneja en la función addToCart
        console.error('Error al agregar al carrito:', error);
      }
    } else if (product.stock === 0) {
      toast.error('Producto agotado.');
    } else {
      toast.warning('Por favor, verifica el stock disponible.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header del modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen del producto */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.imageUrl || `https://placehold.co/600x400/ADD8E6/000000?text=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = target.nextElementSibling as HTMLDivElement;
                    if (errorDiv) {
                      errorDiv.style.display = 'flex';
                    }
                  }}
                />
                <div
                  className="hidden absolute inset-0 bg-gray-300 items-center justify-center text-gray-700 font-medium"
                  style={{ display: 'none' }}
                >
                  Imagen no encontrada
                </div>
              </div>
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    product.stock !== undefined && product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock !== undefined && product.stock > 0
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No hay descripción disponible para este producto.'}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  {/* Dynamically update price based on quantity */}
                  <span className="text-4xl font-bold text-teal-700">
                    ${Number(product.enrollmentPrice * quantity).toFixed(2)}
                  </span>
                </div>

                {product.stock !== undefined && product.stock > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Cantidad:
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min={product.minOrderQuantity}
                        max={product.stock}
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newQuantity = parseInt(e.target.value) || product.minOrderQuantity;
                          setQuantity(Math.min(Math.max(newQuantity, product.minOrderQuantity), product.stock || product.minOrderQuantity));
                        }}
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-red-600 font-medium">Este producto está agotado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;