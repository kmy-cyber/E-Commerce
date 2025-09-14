// src/components/Client/ProductCard.tsx
import React, { useState } from 'react';
import { Product } from '../../interfaces'; // Importa la interfaz Product
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: Product;
  addToCart: (productId: number, quantity: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = async () => {
    if (quantity > 0 && product.stock >= quantity) {
      try {
        await addToCart(product.id, quantity);
        toast.success(`${quantity} unidad(es) de ${product.name} añadidas al carrito.`);
      } catch (error) {
        // El error ya se maneja en la función addToCart
        console.error('Error al agregar al carrito:', error);
      }
    } else if (product.stock === 0) {
      toast.error('Producto agotado.');
    } else {
      toast.warning('Por favor, introduce una cantidad válida.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col h-full"> {/* Sombra más sutil */}
      <div className="relative w-full h-40 sm:h-48">
        <img
          src={product.imageUrl || `https://placehold.co/400x300/ADD8E6/000000?text=${product.name}`}
          alt={product.name}
          className="w-full h-40 sm:h-48 object-cover object-center"
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
          className="hidden absolute inset-0 bg-gray-200 items-center justify-center text-gray-600 font-medium"
          style={{ display: 'none' }}
        >
          Imagen no encontrada
        </div>
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{product.name}</h3> {/* Título más sobrio */}
        <p className="text-sm font-medium text-gray-600 mb-1">Categoría: {product.category}</p> {/* Mostrar categoría */}
        <p className="text-gray-700 text-sm sm:text-base mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-teal-700 text-2xl sm:text-3xl font-extrabold"> {/* Precio más sobrio */}
            ${Number(product.enrollmentPrice).toFixed(2)}
          </span>
          <span className="text-gray-600 text-sm">Stock: {product.stock}</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-16 sm:w-20 p-2 border border-gray-300 rounded-lg text-center focus:ring-gray-500 focus:border-gray-500 text-sm"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-grow py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base ${
              product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800' // Verde azulado para añadir
            }`}
          >
            {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;