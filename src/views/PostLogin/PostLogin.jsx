import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginLayout from '../../globalStyles/LoginLayout'

export default function PostLogin() {
  const navigate = useNavigate()

  return (
    <LoginLayout title="!Bienvenido!">
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ color: '#006c09' }}>¡Hola Usuario! Nos alegra tenerte de vuelta.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20}}>
          <button
            type="button"
            onClick={() => navigate('/home')}
            style={{ padding: '10px 14px', borderRadius: 8, background: '#0F71F2', color: '#fff', border: 'none' }}
          >
            Ir a mi página principal
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ padding: '10px 14px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </LoginLayout>
  )
}
