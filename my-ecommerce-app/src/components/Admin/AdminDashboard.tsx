// src/components/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../../interfaces'; //
import { DashboardService } from '../../services'; //

interface AdminDashboardProps {
  products: Product[]; //
  setActiveTab: (tabId: string) => void; // Add setActiveTab to props interface
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setActiveTab }) => { // Destructure setActiveTab
  const [dashboardData, setDashboardData] = useState<any>(null); //
  const [loading, setLoading] = useState(true); //
  const [error, setError] = useState<string | null>(null); //

  useEffect(() => {
    const fetchDashboardData = async () => { //
      try {
        setLoading(true); //
        const response = await DashboardService.getDashboardStats(); //
        setDashboardData(response.data); //
        setError(null); //
      } catch (err) {
        console.error('Error fetching dashboard data:', err); //
        setError('Error al cargar las estadísticas del dashboard'); //
        // Fallback a cálculos locales si falla la API
        setDashboardData({ //
          products: {
            total: products.length, //
            lowStock: products.filter(p => p.stock <= 5 && p.stock > 0).length, //
            outOfStock: products.filter(p => p.stock === 0).length, //
            inventoryValue: products.reduce((sum, p) => sum + (p.enrollmentPrice * p.stock), 0), //
            categoryStats: products.reduce((acc, p) => { //
              acc[p.category] = (acc[p.category] || 0) + 1; //
              return acc; //
            }, {} as Record<string, number>), //
            lowStockList: products
              .filter(p => p.stock <= 5 && p.stock > 0) //
              .sort((a, b) => a.stock - b.stock) //
              .slice(0, 5) //
          }
        });
      } finally {
        setLoading(false); //
      }
    };

    fetchDashboardData(); //
  }, [products]); //

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar las estadísticas del dashboard</p>
      </div>
    );
  }

  const { products: productStats } = dashboardData; //

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Advertencia</p>
          <p>{error}. Se están mostrando datos calculados localmente.</p>
        </div>
      )}
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-3xl font-bold text-gray-900">{productStats.total}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Changed text-teal-600 to text-blue-600 */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-3xl font-bold text-gray-900">${productStats.inventoryValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-gray-900">{productStats.lowStock}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-3xl font-bold text-gray-900">{productStats.outOfStock}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos por categoría */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Productos por Categoría
          </h3>
          <div className="space-y-3">
            {Object.entries(productStats.categoryStats || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-teal-200 rounded-full px-3 py-1">
                    <span className="text-teal-800 font-semibold text-sm">{String(count)}</span>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${(Number(count) / productStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos con stock bajo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Alerta: Stock Bajo
          </h3>
          {!productStats.lowStockList || productStats.lowStockList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">¡Excelente! No hay productos con stock bajo.</p>
          ) : (
            <div className="space-y-3">
              {productStats.lowStockList.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {product.stock} restantes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('add-product')} // Navigates to the 'Agregar Producto' tab
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Agregar Producto</span>
          </button>
          <button
            onClick={() => alert('La funcionalidad de generación de reportes está en desarrollo.')} // Placeholder for report generation
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Generar Reporte</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')} // Navigates to the 'Configuración' tab
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;