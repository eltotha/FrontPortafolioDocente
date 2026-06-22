import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Identidad del Sistema a la izquierda */}
        <div className="header-brand" onClick={() => navigate('/home')}>
          <span className="brand-icon">📘</span>
          <span className="brand-text">Portafolio Docente</span>
        </div>
        
        {/* Navegación y Acciones a la derecha */}
        <nav className="modern-navbar">
          <NavLink 
            to="/home" 
            end 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Inicio
          </NavLink>
          
          <a 
            href="#logout" 
            onClick={handleLogout} 
            className="nav-item logout-button"
          >
            Cerrar Sesión
          </a>
        </nav>
      </div>
    </header>
  )
}