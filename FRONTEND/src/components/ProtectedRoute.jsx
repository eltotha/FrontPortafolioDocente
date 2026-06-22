import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ rolesPermitidos }) => {
  const userJson = localStorage.getItem('user');

  // 1. Si no hay ningún usuario logueado, redirigir al login inmediatamente
  if (!userJson) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);

  // 2. Si la ruta requiere roles específicos (como Admin) y el usuario no lo tiene, mandarlo al Home
  if (rolesPermitidos && !rolesPermitidos.includes(user.tipo)) {
    return <Navigate to="/home" replace />;
  }

  // 3. Si todo está correcto, permitir el acceso a la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;