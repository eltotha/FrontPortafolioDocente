import React from 'react'
import './login.css'

export default function LoginLayout({ children, title = 'Login' }) {
  return (
    <div className="login-layout">
      <label className="login-label">{title}</label>
      <div className="login-card">{children}</div>
    </div>
  )
}
