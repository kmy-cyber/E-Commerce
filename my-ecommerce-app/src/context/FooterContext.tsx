import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FooterConfig } from '../interfaces';
import { FooterConfigService } from '../services';

interface FooterContextType {
  footerConfig: FooterConfig;
  updateFooterConfig: (config: FooterConfig) => Promise<void>;
  isLoading: boolean;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const useFooterConfig = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooterConfig must be used within a FooterProvider');
  }
  return context;
};

interface FooterProviderProps {
  children: ReactNode;
}

const defaultFooterConfig: FooterConfig = {
  companyName: 'Nuestra Tienda',
  companyDescription: 'Tu destino favorito para productos de calidad. Ofrecemos una amplia variedad de productos con la mejor atención al cliente y precios competitivos.',
  address: '123 Calle Principal, Ciudad',
  phone: '+1 (555) 123-4567',
  email: 'info@nuestratienda.com',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
  showSocialMedia: true,
  copyrightText: 'Nuestra Tienda. Todos los derechos reservados.'
};

export const FooterProvider: React.FC<FooterProviderProps> = ({ children }) => {
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(defaultFooterConfig);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar configuración del servicio al inicializar
  useEffect(() => {
    const loadFooterConfig = async () => {
      setIsLoading(true);
      try {
        const response = await FooterConfigService.getFooterConfig();
        setFooterConfig(response.data);
      } catch (error) {
        console.error('Error al cargar la configuración del footer:', error);
        // En caso de error, usar configuración por defecto
        setFooterConfig(defaultFooterConfig);
      } finally {
        setIsLoading(false);
      }
    };

    loadFooterConfig();
  }, []);

  const updateFooterConfig = async (config: FooterConfig): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await FooterConfigService.updateFooterConfig(config);
      setFooterConfig(response.data);
      console.log('Configuración del footer actualizada:', response.data);
    } catch (error) {
      console.error('Error al actualizar la configuración del footer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: FooterContextType = {
    footerConfig,
    updateFooterConfig,
    isLoading
  };

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  );
};