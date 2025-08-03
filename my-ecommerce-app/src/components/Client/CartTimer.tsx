// src/components/Client/CartTimer.tsx
import React from 'react';

interface CartTimerProps {
  timeLeft: number;
  formatTime: string;
  isActive: boolean;
}

const CartTimer: React.FC<CartTimerProps> = ({ timeLeft, formatTime, isActive }) => {
  if (!isActive) return null;

  const isWarning = timeLeft <= 300; // Últimos 5 minutos
  const isCritical = timeLeft <= 60; // Último minuto

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
      isCritical 
        ? 'bg-red-100 border-red-500 text-red-800' 
        : isWarning 
          ? 'bg-orange-100 border-orange-500 text-orange-800'
          : 'bg-blue-100 border-blue-500 text-blue-800'
    } border-2`}>
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium">
            {isCritical ? '¡Tiempo casi agotado!' : isWarning ? 'Tiempo limitado' : 'Carrito reservado'}
          </p>
          <p className="text-xs">
            Tiempo restante: <span className="font-bold">{formatTime}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTimer;