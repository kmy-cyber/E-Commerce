import React, { useState } from 'react';
import FooterConfigManager from './FooterConfigManager';

type ConfigurationSection = 'footer' | 'general' | 'payments' | 'shipping' | 'users';

interface ConfigurationOption {
  id: ConfigurationSection;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

const ConfigurationManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ConfigurationSection | null>(null);

  const configurationOptions: ConfigurationOption[] = [
    {
      id: 'footer',
      title: 'Configuración del Footer',
      description: 'Personaliza la información que aparece en el pie de página',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V4',
      available: true
    },
    {
      id: 'general',
      title: 'Configuración General',
      description: 'Configuraciones básicas de la tienda y la aplicación',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
      available: false
    },
    {
      id: 'payments',
      title: 'Configuración de Pagos',
      description: 'Gestiona métodos de pago y configuraciones financieras',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      available: false
    },
    {
      id: 'shipping',
      title: 'Configuración de Envíos',
      description: 'Define zonas de envío, costos y métodos de entrega',
      icon: 'M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      available: false
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios, roles y permisos del sistema',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      available: false
    }
  ];

  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  const renderConfigurationContent = () => {
    switch (activeSection) {
      case 'footer':
        return <FooterConfigManager onBack={handleBackToMenu} />;
      case 'general':
      case 'payments':
      case 'shipping':
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {configurationOptions.find(option => option.id === activeSection)?.title}
            </h3>
            <p className="text-gray-600 mb-6">
              Esta sección estará disponible próximamente
            </p>
            <button
              onClick={handleBackToMenu}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              Volver al Menú
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div className="space-y-6">
        {renderConfigurationContent()}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Configuraciones del Sistema</h2>
            <p className="text-gray-600">Personaliza y gestiona los aspectos de tu tienda</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {configurationOptions.map((option) => (
            <div
              key={option.id}
              className={`relative bg-gray-50 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                option.available
                  ? 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 hover:shadow-md'
                  : 'border-gray-100 bg-gray-100 cursor-not-allowed opacity-60'
              }`}
              onClick={() => option.available && setActiveSection(option.id)}
            >
              {!option.available && (
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Próximamente
                  </span>
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${option.available ? 'bg-teal-100' : 'bg-gray-200'}`}>
                  <svg 
                    className={`w-6 h-6 ${option.available ? 'text-teal-600' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${option.available ? 'text-gray-800' : 'text-gray-500'}`}>
                    {option.title}
                  </h3>
                  <p className={`text-sm ${option.available ? 'text-gray-600' : 'text-gray-400'}`}>
                    {option.description}
                  </p>
                  
                  {option.available && (
                    <div className="mt-3">
                      <span className="inline-flex items-center text-sm font-medium text-teal-600">
                        Configurar
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationManager;