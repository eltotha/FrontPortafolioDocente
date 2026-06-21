import React from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/Home" end className={({ isActive }) => (isActive ? 'active' : '')}>
        Inicio
      </NavLink>
      
      <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
        Cerrar Sesion
      </NavLink>
    </nav>
  )
}
