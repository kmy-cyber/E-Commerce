// src/components/Client/CartDisplay.tsx         toast.warning
import React, { useState } from "react";
import { Product, CartItem } from "../../interfaces";
import { toast } from 'react-toastify';

interface CartDisplayProps {
  products: Product[];
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  onClose: () => void;
  updateCartItemQuantity: (productId: number, newQuantity: number) => void;
}

const CartDisplay: React.FC<CartDisplayProps> = ({
  products,
  cart,
  removeFromCart,
  clearCart,
  onClose,
  updateCartItemQuantity,
}) => {
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

  const calculateTotalPrice = (): number => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.enrollmentPrice * item.quantity : 0);
    }, 0);
  };

  const handleBuyNowClick = () => {
    if (cart.length === 0) {
      alert(
        "Tu carrito está vacío. Por favor, añade productos antes de comprar."
      );
      return;
    }
    setShowOrderSummary(true);
  };

  const handleProceedFromSummary = async () => {
    setIsProcessingOrder(true);

    try {
      // 1. Crear la orden en la base de datos
      const { CartService } = await import("../../services");

      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert(
          "Error: No se pudo identificar tu carrito. Por favor, intenta de nuevo."
        );
        setIsProcessingOrder(false);
        return;
      }

      // Crear la orden con información básica (sin formulario)
      const customerData = {
        customerName: "Cliente WhatsApp",
        customerEmail: "pendiente@whatsapp.com",
        customerPhone: "",
        shippingAddress: "",
        notes:
          "Pedido realizado vía WhatsApp - Información pendiente de completar",
      };

      const response = await CartService.createOrder(cartId, customerData);
      const orderNumber = response.data.order.orderNumber;

      // 2. Generar mensaje para WhatsApp con número de orden
      const orderDetails = cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return "";
          return `• ${product.name} - Cantidad: ${item.quantity} - $${Number(
            product.enrollmentPrice * item.quantity
          ).toFixed(2)}`;
        })
        .join("\n");

      const totalPrice = calculateTotalPrice();
      const whatsappMessage = `¡Hola! Me interesa hacer el siguiente pedido:\n\n*Orden #${orderNumber}*\n\n${orderDetails}\n\n*Total: $${totalPrice.toFixed(
        2
      )}*\n\n¿Podrías confirmar la disponibilidad y el proceso de compra?`;

      // IMPORTANTE: Cambia este número por tu número de WhatsApp (incluye código de país sin +)
      // Ejemplo: Para México +52 1234567890 sería '5211234567890'
      // Ejemplo: Para España +34 123456789 sería '34123456789'
      const phoneNumber = "5355159149"; // ⚠️ CAMBIAR POR TU NÚMERO REAL

      // 3. Crear URL de WhatsApp y abrirla
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappUrl, "_blank");

      // 4. Mostrar mensaje de éxito
      toast.success(
        `¡Pedido creado exitosamente! (Orden #${orderNumber}) Se ha abierto WhatsApp para que puedas contactarnos.`
      );

      // 5. Limpiar carrito y cerrar modal
      clearCart();
      setShowOrderSummary(false);
      onClose();
    } catch (error: any) {
      console.error("Error al crear orden:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform scale-95 opacity-0 animate-scale-up-fade-in">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-4xl font-extrabold text-gray-900">
            Tu Carrito de Compras
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-4xl font-light leading-none transition-transform duration-200 hover:rotate-90"
          >
            &times;
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-700 text-2xl mt-4 font-semibold">
              Tu carrito está vacío.
            </p>
            <p className="text-gray-500 mt-2">
              ¡Explora nuestros productos y añade algunos!
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.productId}
                    className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="relative w-24 h-24 mr-5 flex-shrink-0">
                      <img
                        src={
                          product.imageUrl ||
                          `https://placehold.co/96x96/E0F2F7/333333?text=Producto`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const errorDiv =
                            target.nextElementSibling as HTMLDivElement;
                          if (errorDiv) {
                            errorDiv.style.display = "flex";
                          }
                        }}
                      />
                      <div
                        className="hidden absolute inset-0 bg-gray-300 rounded-lg border border-gray-400 items-center justify-center text-gray-700 font-medium text-xs text-center p-1"
                        style={{ display: "none" }}
                      >
                        Imagen no disponible
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.category}
                        </p>
                        <p className="text-xl font-bold text-teal-700 mb-2">
                          $
                          {Number(product.enrollmentPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= product.minOrderQuantity}
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="text-md font-medium text-gray-800 flex items-center gap-1">
                          {item.quantity}
                          {item.quantity === product.minOrderQuantity && (
                            <span className="text-xs text-gray-500">(Min.)</span>
                          )}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              product.id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            product.stock !== undefined &&
                            item.quantity >= product.stock
                          }
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-all duration-300 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t-2 border-gray-100">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
                Total: ${Number(calculateTotalPrice()).toFixed(2)}
              </h3>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Estás seguro de que deseas vaciar todo el carrito?"
                      )
                    ) {
                      clearCart();
                    }
                  }}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Vaciar Carrito
                </button>

                <button
                  onClick={handleBuyNowClick}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Comprar Ahora</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Diálogo de Resumen del Pedido */}
        {showOrderSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h4 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
                Resumen de tu Pedido
              </h4>

              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            product.imageUrl ||
                            `https://placehold.co/50x50/ADD8E6/000000?text=P`
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700">
                        ${Number(product.enrollmentPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-extrabold text-gray-900">Total:</span>
                  <span className="font-extrabold text-teal-700">
                    ${Number(calculateTotalPrice()).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={handleProceedFromSummary}
                  disabled={isProcessingOrder}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>
                    {isProcessingOrder
                      ? "Procesando..."
                      : "Confirmar por WhatsApp"}
                  </span>
                </button>
                <button
                  onClick={() => setShowOrderSummary(false)}
                  disabled={isProcessingOrder}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDisplay;
