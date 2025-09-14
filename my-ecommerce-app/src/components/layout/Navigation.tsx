import React, { useState } from 'react';

interface NavigationProps {
  view: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ view, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Tienda</h1>
          
          {/* Menú hamburguesa para móviles */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
            aria-label="Abrir menú"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}></span>
          </button>

          {/* Menú desktop */}
          <div className="hidden md:flex space-x-4">
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

        {/* Menú móvil desplegable */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                onViewChange('client');
                setIsMenuOpen(false);
              }}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-center ${
                view === 'client'
                  ? 'bg-white text-gray-800 shadow-md border-l-4 border-teal-500'
                  : 'text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white'
              }`}
            >
              Módulo Cliente
            </button>
            <button
              onClick={() => {
                onViewChange('admin');
                setIsMenuOpen(false);
              }}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-center ${
                view === 'admin'
                  ? 'bg-white text-gray-800 shadow-md border-l-4 border-teal-500'
                  : 'text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white'
              }`}
            >
              Módulo Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};