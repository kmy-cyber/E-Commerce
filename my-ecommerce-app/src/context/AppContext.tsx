import React, { createContext, useContext, ReactNode } from 'react';
import { AppContextType } from '../interfaces';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
  value: AppContextType;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, value }) => {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};