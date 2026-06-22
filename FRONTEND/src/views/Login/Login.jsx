import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/apiClient'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError(null)

        try {
            const response = await apiClient.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/welcome')
        } catch (err) {
            if (err.response) {
                setError(err.response.data.mensaje || 'Usuario o contraseña incorrectos.');
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        }
    }

    return (
        <div className="modern-login-screen">
            <div className="modern-login-container">
                <div className="login-brand-header">
                    <h2 className="login-main-title">Iniciar Sesión</h2>
                    <p className="login-subtitle">Introduce tu cuenta para acceder al portafolio docente</p>
                </div>

                <form className="modern-login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="modern-error-alert">
                            <span className="alert-icon">⚠️</span> {error}
                        </div>
                    )}

                    <div className="modern-input-group">
                        <label className="modern-field-label">Usuario</label>
                        <input
                            type="text"
                            className="modern-text-input"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-field-label">Contraseña</label>
                        <input
                            type="password"
                            className="modern-text-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="modern-btn-primary">
                        Entrar al Sistema
                    </button>
                </form>
            </div>
        </div>
    )
}