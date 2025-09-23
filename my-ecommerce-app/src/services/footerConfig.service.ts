import { FooterConfig } from '../interfaces';
import { api } from './api.config';

class FooterConfigService {
  private static readonly STORAGE_KEY = 'footerConfig';

  // Obtener configuración del footer
  static async getFooterConfig(): Promise<{ data: FooterConfig }> {
    try {
      // TODO: Implementar llamada real al backend cuando esté disponible
      // const response = await api.get('/api/footer-config');
      // return response;

      // Por ahora, usar localStorage como fallback
      const savedConfig = localStorage.getItem(this.STORAGE_KEY);
      if (savedConfig) {
        return { data: JSON.parse(savedConfig) };
      }

      // Configuración por defecto
      const defaultConfig: FooterConfig = {
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

      return { data: defaultConfig };
    } catch (error) {
      console.error('Error fetching footer config:', error);
      throw error;
    }
  }

  // Actualizar configuración del footer
  static async updateFooterConfig(config: FooterConfig): Promise<{ data: FooterConfig }> {
    try {
      // TODO: Implementar llamada real al backend cuando esté disponible
      // const response = await api.put('/api/footer-config', config);
      // return response;

      // Por ahora, guardar en localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      
      // Simular respuesta del servidor
      return { data: config };
    } catch (error) {
      console.error('Error updating footer config:', error);
      throw error;
    }
  }

  // Restablecer configuración a valores predeterminados
  static async resetFooterConfig(): Promise<{ data: FooterConfig }> {
    try {
      // TODO: Implementar llamada real al backend cuando esté disponible
      // const response = await api.delete('/api/footer-config');
      // return response;

      const defaultConfig: FooterConfig = {
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

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultConfig));
      return { data: defaultConfig };
    } catch (error) {
      console.error('Error resetting footer config:', error);
      throw error;
    }
  }
}

export default FooterConfigService;