import React from 'react'
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
import './App.css'

function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="welcome" style={{ textAlign: 'center', padding: 48 }}>
      <h1>!Bienvenido¡</h1> <br></br>
      <p>Porfavor, inicia sesión para acceder a tu portafolio.</p>
      <button
        type="button"
        style={{ marginTop: 20, padding: '10px 16px', borderRadius: 8 }}
        onClick={() => navigate('/login')}
      >
        Iniciar sesión
      </button>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<PostLogin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reportemateriascarrera" element={<ReporteMateriasCarrera />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/tipousuarios" element={<TipoUsuarios />} />
      <Route path="/escuelas" element={<Escuelas />} />
      <Route path="/carreras" element={<Carreras />} />
      <Route path="/materiascarreras" element={<MateriasCarreras />} />
      <Route path="/materias" element={<Materias />} />
      <Route path="/grupos" element={<Grupos />} />
    </Routes>
  )
}

export default App
