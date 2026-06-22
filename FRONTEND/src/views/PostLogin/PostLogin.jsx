import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PostLogin.css'

export default function PostLogin() {
  const navigate = useNavigate()
  const [nombreUsuario, setNombreUsuario] = useState('ADMIN')
  const [faseAnimacion, setFaseAnimacion] = useState('fase-intro') // intro -> ensamblado -> completo
  const [statusText, setStatusText] = useState('Sincronizando sistemas...')

  useEffect(() => {
    // 1. Obtener y formatear datos
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      if (user.username) {
        setNombreUsuario(user.username.toUpperCase())
      }
    }

    // 2. Secuencia de tiempos de la animación (Estilo Boot Screen Digital)
    const t1 = setTimeout(() => {
      setFaseAnimacion('fase-ensamblado')
      setStatusText('Inicializando interfaz de control...')
    }, 600)

    const t2 = setTimeout(() => {
      setFaseAnimacion('fase-completo')
      setStatusText('Acceso verificado de forma segura.')
    }, 2200)

    const t3 = setTimeout(() => {
      navigate('/home')
    }, 3000) // Duración total de la experiencia cinemática: 3s

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [navigate])

  return (
    <div className={`premium-boot-screen ${faseAnimacion}`}>
      {/* Red de vectores geométricos de fondo (Grid lines) */}
      <div className="boot-grid-overlay"></div>
      
      <div className="boot-cinematic-card">
        {/* LOGO VECTORIAL ICONOGRÁFICO: Emerge del vacío */}
        <div className="boot-logo-wrapper">
          <div className="boot-vector-logo">
            <span className="logo-icon">📘</span>
            <div className="logo-glow-ring"></div>
          </div>
        </div>

        {/* CONTENEDOR DE IDENTIDAD (REVELADO DE TEXTO) */}
        <div className="boot-identity-group">
          <span className="boot-tagline">PORTAFOLIO DOCENTE</span>
          <h1 className="boot-user-welcome" data-text={nombreUsuario}>
            {nombreUsuario}
          </h1>
        </div>

        {/* PANEL INFERIOR: CARGA LINEAL CONTÍNUA */}
        <div className="boot-footer-loader">
          <p className="boot-status-msg">{statusText}</p>
          <div className="modern-progress-rail">
            <div className="modern-progress-bar-fill"></div>
          </div>
        </div>
      </div>
    </div>
  )
}