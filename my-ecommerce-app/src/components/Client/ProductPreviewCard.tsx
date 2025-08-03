// src/components/Client/ProductPreviewCard.tsx
import React from 'react';
import { Product } from '../../interfaces'; //

interface ProductPreviewCardProps {
  product: Product; //
  onClick: () => void; //
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({ product, onClick }) => {
  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => { //
    if (text.length <= maxLength) return text; //
    return text.substring(0, maxLength) + '...'; //
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative w-full h-40">
        <img
          src={product.imageUrl || `https://placehold.co/400x300/ADD8E6/000000?text=${product.name}`}
          alt={product.name}
          className="w-full h-40 object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement; //
            target.style.display = 'none'; //
            const errorDiv = target.nextElementSibling as HTMLDivElement; //
            if (errorDiv) { //
              errorDiv.style.display = 'flex'; //
            }
          }}
        />
        <div
          className="hidden absolute inset-0 bg-gray-300 items-center justify-center text-gray-700 font-medium text-sm" // Changed bg-gray-200 to bg-gray-300 and text-gray-600 to text-gray-700
          style={{ display: 'none' }}
        >
          Imagen no encontrada
        </div>
        {/* Badge de stock bajo */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            ¡Últimas {product.stock}!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Agotado
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
          {truncateText(product.name, 25)}
        </h3>

        <p className="text-xs text-gray-500 mb-2">
          {product.category}
        </p>

        <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden line-clamp-2"> {/* Added line-clamp-2 for better text control */}
          {product.description ? truncateText(product.description, 60) : 'Sin descripción disponible'}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-teal-700 text-xl font-bold">
            ${product.enrollmentPrice.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-xs font-semibold">
              Ver detalles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;