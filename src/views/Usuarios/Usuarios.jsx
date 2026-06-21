import { useNavigate } from "react-router-dom";
import BaseLayout from "./../../globalStyles/BaseLayout";
import "./Usuarios.css";

export default function Usuarios() {
  const navigate = useNavigate();
  const usuarios = [
    {
      nombre: "Eduardo",
      apellido: "Gonzalez",
      fechaNac: "27/02/2000",
      correo: "eduar2.gm2020@gmail.com",
      username: "eduardo",
      password: "eduardo",
      tipo: "Administrador",
      estado: "Activo",
      escuela: "Escuela de Ingeniería en Sistemas",
    },
    {
      nombre: "Sofia",
      apellido: "Gonzalez",
      fechaNac: "23/09/2006",
      correo: "sngm@gmail.com",
      username: "sofia",
      password: "sofia",
      tipo: "Docente",
      estado: "Activo",
      escuela: "Escuela de Medicina",
    },
  ];

  return (
    <BaseLayout>
        <div className="usuarios-page">
        <div className="usuarios-header">
            <h1>Usuarios</h1>

            <div className="header-controls">
              <button className="btn-crear">
                + Crear Nuevo Usuario
              </button>
              <button className="btn-secondary" onClick={() => navigate('/tipousuarios')}>
                Tipos de Usuario
              </button>
            </div>
        </div>

        <div className="tabla-wrapper">
            <table className="usuarios-table">
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha Nac.</th>
                <th>Correo</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Escuela</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {usuarios.map((usuario, index) => (
                <tr key={index}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.fechaNac}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.password}</td>
                    <td>{usuario.tipo}</td>
                    <td>
                    <span className="badge-activo">
                        {usuario.estado}
                    </span>
                    </td>
                    <td>{usuario.escuela}</td>

                    <td>
                    <div className="acciones">
                        <button className="btn-editar">
                        Editar
                        </button>

                        <button className="btn-detalle">
                        Detalles
                        </button>

                        <button className="btn-eliminar">
                        Eliminar
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </BaseLayout>
  );
}