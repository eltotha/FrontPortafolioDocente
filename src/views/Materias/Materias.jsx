import { useNavigate } from "react-router-dom";
import "./Materias.css";
import BaseLayout from "../../globalStyles/BaseLayout";

export default function Materias() {
  const navigate = useNavigate();
  const materias = [
    {
      id: 1,
      nombre: "Matemáticas Discretas",
      descripcion:
        "Curso introductorio a las matemáticas discretas, incluyendo teoría de grafos, lógica y combinatoria.",
      estado: "Disponible",
    },
    {
      id: 2,
      nombre: "Física General",
      descripcion:
        "Fundamentos de física clásica, incluyendo mecánica, termodinámica y electromagnetismo.",
      estado: "Disponible",
    },
    {
      id: 3,
      nombre: "Programación Avanzada",
      descripcion:
        "Curso que cubre técnicas avanzadas de programación en varios lenguajes y paradigmas.",
      estado: "Disponible",
    },
    {
      id: 4,
      nombre: "Anatomía Humana",
      descripcion:
        "Estudio de la estructura del cuerpo humano, incluyendo órganos y sistemas.",
      estado: "Disponible",
    },
  ];

  return (
    <BaseLayout>
        <div className="materias-page">
        <div className="materias-header">
            <h1>Índice</h1>

            <div className="header-controls">
              <button className="btn-crear">Crear Nuevo</button>
              <button className="btn-secondary" onClick={() => navigate('/materiascarreras')}>Materias y Carreras</button>
              <button className="btn-crear" onClick={() => navigate('/grupos')}>
                Grupos
              </button>
            </div>
        </div>

        <div className="tabla-container">
            <table>
            <thead>
                <tr>
                <th>MaNombre</th>
                <th>MaDescripcion</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {materias.map((materia) => (
                <tr key={materia.id}>
                    <td>{materia.nombre}</td>

                    <td className="descripcion">
                    {materia.descripcion}
                    </td>

                    <td>
                    <span className="estado-disponible">
                        {materia.estado}
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