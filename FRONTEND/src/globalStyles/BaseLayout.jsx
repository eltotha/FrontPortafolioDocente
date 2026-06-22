import React from 'react';
import Navbar from '../components/Navbar'; // Asegúrate de que la ruta a tu Navbar sea la correcta

export default function BaseLayout({ children }) {
  return (
    <div className="layout-container">
      {/* 1. Único encabezado global controlado por el nuevo componente */}
      <Navbar />
      
      {/* 2. Cuerpo dinámico de las páginas */}
      <div className="layout-body">
        {children}
      </div>
    </div>
  );
}