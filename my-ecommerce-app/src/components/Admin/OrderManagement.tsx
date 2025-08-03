// src/components/Admin/OrderManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import { OrderService } from "../../services";
import { toast } from 'react-toastify'; // Importa la interfaz AppContextType

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  product?: {
    id: number;
    name: string;
    stock: number;
  };
}

const OrderManagement: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(
    null
  );
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const response = await OrderService.getPendingOrders();
        setPendingOrders(response.data.orders);
      } else {
        const response = await OrderService.getAllOrders();
        setAllOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      toast.error("Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleConfirmOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas confirmar esta orden? Esto descontará el stock de los productos."
      )
    ) {
      return;
    }

    setProcessingOrderId(orderId);
    try {
      await OrderService.confirmOrder(orderId);
      toast.success("Orden confirmada exitosamente. El stock ha sido actualizado.");
      loadOrders(); // Recargar órdenes
    } catch (error: any) {
      console.error("Error al confirmar orden:", error);
      const errorMessage =
        error.response?.data?.message || "Error al confirmar la orden";
      alert(errorMessage);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    const reason = window.prompt(
      "¿Por qué deseas rechazar esta orden? (opcional)"
    );
    if (reason === null) return; // Usuario canceló

    setProcessingOrderId(orderId);
    try {
      await OrderService.rejectOrder(orderId, reason);
      alert("Orden rechazada exitosamente. Las reservas han sido liberadas.");
      loadOrders(); // Recargar órdenes
    } catch (error: any) {
      console.error("Error al rechazar orden:", error);
      const errorMessage =
        error.response?.data?.message || "Error al rechazar la orden";
      alert(errorMessage);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      case "processing":
        return "Procesando";
      case "shipped":
        return "Enviada";
      case "delivered":
        return "Entregada";
      default:
        return status;
    }
  };

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const ordersToShow = activeTab === "pending" ? pendingOrders : allOrders;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Gestión de Órdenes
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Órdenes Pendientes ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Todas las Órdenes
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : ordersToShow.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-xl mt-4">
            {activeTab === "pending"
              ? "No hay órdenes pendientes"
              : "No hay órdenes"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordersToShow.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div
                key={order.id}
                className={`bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-md border-l-4 ${
                  order.status === "pending"
                    ? "border-l-yellow-400 hover:shadow-yellow-100"
                    : order.status === "confirmed"
                    ? "border-l-green-400 hover:shadow-green-100"
                    : "border-l-gray-400 hover:shadow-gray-100"
                } hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
              >
                <div className="p-4">
                  {/* Vista compacta - siempre visible */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-400 animate-pulse"
                              : order.status === "confirmed"
                              ? "bg-green-400"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Orden #{order.orderNumber}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-md px-3 py-1 shadow-sm border border-gray-100">
                        <div className="text-base font-bold text-teal-700">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {order.items.length} producto
                          {order.items.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 hover:border-teal-300 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center space-x-1 shadow-sm hover:shadow-md"
                      >
                        <span>{isExpanded ? "Ocultar" : "Detalles"}</span>
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
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
                      </button>
                    </div>
                  </div>

                  {/* Botones de acción - siempre visibles para órdenes pendientes */}
                  {order.status === "pending" && (
                    <div className="flex space-x-2 pb-2 border-b border-gray-100">
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        disabled={processingOrderId === order.id}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center space-x-1 text-sm"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>
                          {processingOrderId === order.id
                            ? "Confirmando..."
                            : "Confirmar"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        disabled={processingOrderId === order.id}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center space-x-1 text-sm"
                      >
                        <svg
                          className="w-3 h-3"
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
                        <span>
                          {processingOrderId === order.id
                            ? "Rechazando..."
                            : "Rechazar"}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Detalles expandibles */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      {order.notes && (
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border-l-4 border-amber-400">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg
                              className="w-4 h-4 text-amber-600"
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
                            <h4 className="font-semibold text-amber-800 text-sm">
                              Notas
                            </h4>
                          </div>
                          <p className="text-xs text-amber-700 font-medium">
                            {order.notes}
                          </p>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <svg
                            className="w-4 h-4 text-teal-600"
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
                          <h4 className="font-semibold text-teal-800 text-sm">
                            Productos
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-3 rounded-md border border-gray-100 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                                  <span className="text-teal-700 font-bold text-xs">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {item.productName}
                                  </span>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      x{item.quantity}
                                    </span>
                                    {item.product && (
                                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                        Stock: {item.product.stock}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-base text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <div className="text-xs text-gray-500">
                                  ${item.price.toFixed(2)} c/u
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
