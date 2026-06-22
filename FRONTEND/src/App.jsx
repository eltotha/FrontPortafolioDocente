import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './views/Login/Login'
import PostLogin from './views/PostLogin/PostLogin'
import Home from './views/Home/Home'
import ReporteMateriasCarrera from './views/ReporteMateriasCarrera/ReporteMateriasCarrera'
import Usuarios from './views/Usuarios/Usuarios'
import TipoUsuarios from './views/Usuarios/TipoUsuarios/TipoUsuario'
import Escuelas from './views/Escuelas/Escuelas'
import Carreras from './views/Carreras/Carreras'
import Materias from './views/Materias/Materias'
import MateriasCarreras from './views/Carreras/MateriasCarreras/MateriasCarreras'
import Grupos from './views/Materias/Grupos/Grupos'
import ProtectedRoute from './components/ProtectedRoute' // <-- Importar el guardia
import './App.css'
import NotFound from "./views/NotFound/NotFound";

function Welcome() {
  const navigate = useNavigate();
  const [faseSalida, setFaseSalida] = useState(false);

  const manejarSalida = () => {
    setFaseSalida(true);
    // Espera 500ms a que terminen las animaciones de salida de CSS antes de cambiar de ruta
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  return (
    <div className={`modern-welcome-screen ${faseSalida ? 'welcome-leaving' : 'welcome-entering'}`}>
      {/* PANEL IZQUIERDO: TEXTURA E IDENTIDAD COGNITIVA */}
      <div className="welcome-left-panel">
        <div className="welcome-left-content">
          <span className="welcome-system-tag">SISTEMA CONSOLIDADO</span>
          <h1 className="welcome-left-title">PORTAFOLIO DOCENTE</h1>
          <p className="welcome-left-subtitle">
            Plataforma centralizada de gestión académica, control de mallas curriculares y auditoría de asignaturas.
          </p>
        </div>
        <div className="welcome-left-footer">
          UNAN - León • Ingeniería en Sistemas de la Información
        </div>
      </div>

      {/* PANEL DERECHO: DONDE FLOTA LA TARJETA */}
      <div className="modern-welcome-container">
        <div className="welcome-card-wrapper">
          
          <div className="welcome-brand-header">
            <h2 className="welcome-main-title">¡Bienvenido al Sistema!</h2>
            <p className="welcome-subtitle">Para iniciar tus operaciones, por favor autentica tu identidad.</p>
          </div>

          <div className="welcome-info-card">
            <div className="welcome-status-badge">
              <span className="pulse-indicator"></span>
              Servidores Activos
            </div>
            
            <p className="welcome-description">
              Esta sesión requiere autenticación explícita. Al ingresar podrás gestionar:
            </p>

            <ul className="welcome-features-list">
              <li>Control de Escuelas y Carreras</li>
              <li>Mapeo Curricular de Materias</li>
              <li>Asignación y Control de Grupos</li>
              <li>Reportes y Auditorías Académicas</li>
            </ul>

            <button 
              type="button" 
              className="modern-btn-primary" 
              onClick={manejarSalida}
            >
              Iniciar Sesión Institucional
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS: Cualquiera puede entrar */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      {/* RUTAS PROTEGIDAS MIXTAS: Requieren inicio de sesión (Docente o Administrador) */}
      <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'Docente']} />}>
        <Route path="/welcome" element={<PostLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reportemateriascarrera" element={<ReporteMateriasCarrera />} />
        <Route path="/carreras" element={<Carreras />} />
        <Route path="/materiascarreras" element={<MateriasCarreras />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/grupos" element={<Grupos />} />
      </Route>

      {/* RUTAS PROTEGIDAS ESTRICTAS: Exclusivas para el Administrador */}
      <Route element={<ProtectedRoute rolesPermitidos={['Administrador']} />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/tipousuarios" element={<TipoUsuarios />} />
        <Route path="/escuelas" element={<Escuelas />} />
      </Route>

      {/* CAPTURA CRÍTICA 404: Debe ir estrictamente al final de la lista */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

