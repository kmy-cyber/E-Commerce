import React from 'react';
import { useFooterConfig } from '../../context/FooterContext';

interface FooterProps {
  view: 'client' | 'admin';
}

export const Footer: React.FC<FooterProps> = ({ view }) => {
  const { footerConfig } = useFooterConfig();

  if (view === 'admin') {
    return null; // No mostrar footer en vista de administrador
  }

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Información de la empresa */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{footerConfig.companyName}</h3>
            <p className="text-gray-300 mb-4">
              {footerConfig.companyDescription}
            </p>
            {footerConfig.showSocialMedia && (
              <div className="flex justify-center space-x-4">
                {footerConfig.facebookUrl && footerConfig.facebookUrl !== '#' && (
                  <a 
                    href={footerConfig.facebookUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {footerConfig.instagramUrl && footerConfig.instagramUrl !== '#' && (
                  <a 
                    href={footerConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297s-1.297-1.885-1.297-3.091c0-1.297.49-2.448 1.297-3.326s1.885-1.297 3.091-1.297c1.297 0 2.448.49 3.326 1.297s1.297 1.885 1.297 3.091c0 1.297-.49 2.448-1.297 3.326s-1.885 1.297-3.091 1.297zm7.83-9.405c-.49 0-.735-.245-.735-.735s.245-.735.735-.735.735.245.735.735-.245.735-.735.735zm2.042 2.042c0-.98-.368-1.47-1.103-1.47-.735 0-1.103.49-1.103 1.47s.368 1.47 1.103 1.47c.735 0 1.103-.49 1.103-1.47z"/>
                    </svg>
                  </a>
                )}
                {footerConfig.twitterUrl && footerConfig.twitterUrl !== '#' && (
                  <a 
                    href={footerConfig.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Enlaces útiles - COMENTADO TEMPORALMENTE */}
          {/*
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          */}

          {/* Servicio al cliente - COMENTADO TEMPORALMENTE */}
          {/*
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicio al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Ayuda
                </a>
              </li>
            </ul>
          </div>
          */}
        </div>

        {/* Información de contacto */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">{footerConfig.address}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-300">{footerConfig.phone}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-300">{footerConfig.email}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {footerConfig.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};