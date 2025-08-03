import React, { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
  view: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Navigation view={view} onViewChange={onViewChange} />
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
};