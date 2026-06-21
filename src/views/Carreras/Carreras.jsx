import { useNavigate } from "react-router-dom";
import "./Carreras.css";
import BaseLayout from "../../globalStyles/BaseLayout";

export default function Carreras() {
  const navigate = useNavigate();
  const carreras = [
    {
      id: 1,
      nombre: "Ingeniería en Sistemas",
      escuela: "Escuela de Ingeniería en Sistemas",
      estado: "Operativa",
    },
    {
      id: 2,
      nombre: "Ciencias Sociales",
      escuela: "Escuela de Ciencias Sociales",
      estado: "Operativa",
    },
    {
      id: 3,
      nombre: "Medicina",
      escuela: "Escuela de Medicina",
      estado: "Operativa",
    },
  ];

  return (
    <BaseLayout>
        <div className="carreras-page">
        <div className="carreras-header">
            <h1>Lista de Carreras</h1>

            <div className="header-controls">
              <button className="btn-crear">Crear Nueva Carrera</button>
              <button className="btn-secondary" onClick={() => navigate('/materiascarreras')}>
                Materias y Carreras
              </button>
            </div>
        </div>

        <div className="tabla-container">
            <table>
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Escuela</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {carreras.map((carrera) => (
                <tr key={carrera.id}>
                    <td>{carrera.nombre}</td>

                    <td>{carrera.escuela}</td>

                    <td>
                    <span className="estado-operativo">
                        {carrera.estado}
                    </span>
                    </td>

                    <td>
                    <div className="acciones">
                        <button className="btn-editar">
                        Editar
                        </button>

                        <button className="btn-detalles">
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