// src/components/Client/CustomerInfoForm.tsx
import React, { useState } from 'react';

interface CustomerData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes: string;
}

interface CustomerInfoFormProps {
  onSubmit: (customerData: CustomerData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CustomerData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es obligatorio';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof CustomerData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
          Información de Contacto
        </h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tu nombre completo"
              disabled={isLoading}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Tu número de teléfono"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de envío
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Tu dirección completa para el envío"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Cualquier información adicional sobre tu pedido"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerInfoForm;