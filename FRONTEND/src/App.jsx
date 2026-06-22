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
import ProtectedRoute from './components/ProtectedRoute' // <-- Importar el guardia
import './App.css'

function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="welcome" style={{ textAlign: 'center', padding: 48 }}>
      <h1>!Bienvenido¡</h1> <br />
      <p>Por favor, inicia sesión para acceder a tu portafolio.</p>
      <button
        type="button"
        style={{ marginTop: 20, padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
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
    </Routes>
  )
}

export default App