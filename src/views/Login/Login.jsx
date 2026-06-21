import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginLayout from '../../globalStyles/LoginLayout'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/welcome')
  }

  return (
    <LoginLayout>
      <form style={{ marginTop: 16 }} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            <label style={{ textAlign: 'left', marginBottom: 4, display: 'block' }}>
                Nombre Corto
            </label>
          <input
            type="email"
            className="login-input"
          />

           <label style={{ textAlign: 'left', marginBottom: 4, display: 'block' }}>
                Contraseña
            </label>

          <input
            type="password"
            className="login-input"
          />
          <button
            type="submit"
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              marginTop: 8,
              background: '#0F71F2',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </LoginLayout>
  )
}
