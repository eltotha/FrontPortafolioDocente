import React from 'react'
import Navbar from '../components/Navbar'
import './base.css'

export default function BaseLayout({ children }) {
  return (
    <div className="base-layout">
      <header className="base-header">
        <div className="header-inner">
          <h1 className="site-title">Portafolio Docente</h1>
          <label style={{ color: '#000000' }}>¡Hola, Usuario!</label>
          <Navbar />
        </div>
      </header>
      <main className="base-main"><div className="base-main-inner">{children}</div></main>
      <footer className="base-footer">© {new Date().getFullYear()} Portafolio Docente</footer>
    </div>
  )
}
