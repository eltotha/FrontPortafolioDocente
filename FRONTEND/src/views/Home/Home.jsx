import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BaseLayout from '../../globalStyles/BaseLayout'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  
  const [rol, setRol] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('Usuario')
  const [faseSalida, setFaseSalida] = useState(false)

  useEffect(() => {
    const userJson = localStorage.getItem('user')
    
    if (userJson) {
      const user = JSON.parse(userJson)
      setRol(user.tipo)
      
      if (user.nombre && user.apellido) {
        setNombreCompleto(`${user.nombre} ${user.apellido}`)
      } else if (user.username) {
        setNombreCompleto(user.username)
      }
    } else {
      navigate('/login')
    }
  }, [navigate])

  // Método centralizado para capturar y reproducir la animación de salida
  const manejarNavegacion = (ruta) => {
    setFaseSalida(true)
    setTimeout(() => {
      navigate(ruta)
    }, 500) // Sincronizado estrictamente con la duración del CSS (0.5s)
  }

  return (
    <BaseLayout>
      <div className={`modern-dashboard ${faseSalida ? 'dashboard-leaving' : 'dashboard-entering'}`}>
        
        {/* PANEL LATERAL DINÁMICO */}
        <aside className="modern-sidebar">
          <div className="sidebar-header">
            <h3>Sesión Activa</h3>
            <span className="online-indicator"></span>
          </div>
          <div className="user-profile-box">
            <div className="user-avatar">
              {nombreCompleto.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{nombreCompleto}</span>
              <span className="user-role-badge">{rol || 'Cargando...'}</span>
            </div>
          </div>
        </aside>

        {/* CONTENEDOR PRINCIPAL */}
        <main className="modern-content">
          <div className="content-welcome-header">
            <div className="header-text-block">
              <h1>Mantenimiento del Sistema</h1>
              <p className="subtitle-text">Selecciona un módulo administrativo para gestionar los registros actuales.</p>
            </div>
            <button className="btn-action-primary" onClick={() => manejarNavegacion('/reportemateriascarrera')}>
              📊 Generar Informe de Datos
            </button>
          </div>

          {/* CUADRÍCULA DE MÓDULOS DE ACCESO */}
          <div className="modules-grid">
            
            {/* Gestión de usuarios */}
            {rol === 'Administrador' && (
              <div className="module-card card-animate-1" onClick={() => manejarNavegacion('/usuarios')}>
                <div className="module-icon icon-users">👥</div>
                <div className="module-details">
                  <h3>Usuarios</h3>
                  <p>Administrar cuentas de acceso, roles y credenciales del sistema.</p>
                </div>
              </div>
            )}

            {/* Gestión de escuelas */}
            {rol === 'Administrador' && (
              <div className="module-card card-animate-2" onClick={() => manejarNavegacion('/escuelas')}>
                <div className="module-icon icon-schools">🏢</div>
                <div className="module-details">
                  <h3>Escuelas</h3>
                  <p>Gestionar las escuelas y facultades vinculadas a la universidad.</p>
                </div>
              </div>
            )}

            {/* Carreras */}
            <div className={`module-card ${rol === 'Administrador' ? 'card-animate-3' : 'card-animate-1'}`} onClick={() => manejarNavegacion('/carreras')}>
              <div className="module-icon icon-careers">🎓</div>
              <div className="module-details">
                <h3>Carreras</h3>
                <p>Configurar programas académicos, planes de estudio y coordinaciones.</p>
              </div>
            </div>

            {/* Materias */}
            <div className={`module-card ${rol === 'Administrador' ? 'card-animate-4' : 'card-animate-2'}`} onClick={() => manejarNavegacion('/materias')}>
              <div className="module-icon icon-subjects">📘</div>
              <div className="module-details">
                <h3>Materias</h3>
                <p>Administrar el catálogo de asignaturas y cargas horarias.</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </BaseLayout>
  )
}