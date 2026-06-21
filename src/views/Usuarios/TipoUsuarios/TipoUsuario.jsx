import React from 'react';
import './TipoUsuario.css';

const IndexTable = () => {

  const tableData = [
    {
      id: 1,
      tpNombre: "Administrador",
      tpDescripcion: "Usuario con privilegios completos para gestionar el sistema y sus datos"
    },
    {
      id: 2,
      tpNombre: "Docente",
      tpDescripcion: "Usuario con permisos para gestionar materias, grupos y calificaciones en el sistema"
    }
  ];

  return (
    <div className="tipo-usuario-container">
      <header className="tipo-usuario-header">
        <h1 className="tipo-usuario-title">Index</h1>
        <a href="#create" className="create-new-link">Create New</a>
      </header>

      <table className="tipo-usuario-table">
        <thead>
          <tr>
            <th>TpNombre</th>
            <th>TpDescripcion</th>
            <th className="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(item => (
            <tr key={item.id}>
              <td className="tp-nombre">{item.tpNombre}</td>
              <td className="tp-descripcion">{item.tpDescripcion}</td>
              <td className="action-links">
                <a href="#edit">Edit</a> | 
                <a href="#details">Details</a> | 
                <a href="#delete">Delete</a>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndexTable;