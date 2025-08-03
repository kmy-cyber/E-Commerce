import React from 'react';

interface NavigationProps {
  view: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ view, onViewChange }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Tienda</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => onViewChange('client')}
            className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
              view === 'client'
                ? 'bg-white text-gray-800 shadow-md border-b-4 border-teal-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
            }`}
          >
            Módulo Cliente
          </button>
          <button
            onClick={() => onViewChange('admin')}
            className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
              view === 'admin'
                ? 'bg-white text-gray-800 shadow-md border-b-4 border-teal-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
            }`}
          >
            Módulo Admin
          </button>
        </div>
      </div>
    </nav>
  );
};