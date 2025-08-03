// src/components/Admin/AdminLogin.tsx
import React, { useState } from 'react';
import { AppContextType } from '../../interfaces';
import { toast } from 'react-toastify'; // Importa la interfaz AppContextType

interface AdminLoginProps {
  handleAdminLogin: AppContextType['handleAdminLogin'];
}

const AdminLogin: React.FC<AdminLoginProps> = ({ handleAdminLogin }) => {
  const [password, setPassword] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleAdminLogin(password);
    if (!success) {
      toast.error('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Panel de Administración</h2>
          <p className="text-teal-100">Ingresa tu contraseña para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLoginSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-3">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-lg"
                required
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Iniciar Sesión</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;