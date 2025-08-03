// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importa los estilos globales, incluyendo Tailwind
import App from './App'; // Importa el componente principal de tu aplicación
import reportWebVitals from './reportWebVitals'; // Opcional: para medir el rendimiento de la app

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Obtiene el elemento raíz del HTML
);
root.render(
  <React.StrictMode>
    <App /> {/* Renderiza el componente App */}
  </React.StrictMode>
);

// Si quieres empezar a medir el rendimiento en tu aplicación, pasa una función
// para registrar los resultados (por ejemplo, reportWebVitals(console.log))
// o enviarlos a un endpoint de análisis. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals(); // Llama a la función de reporte de rendimiento
