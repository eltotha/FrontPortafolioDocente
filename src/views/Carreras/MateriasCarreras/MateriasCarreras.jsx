import "./MateriasCarreras.css";
import BaseLayout from "../../../globalStyles/BaseLayout";

export default function MateriasCarreras() {
  const registros = [
    {
      id: 1,
      materia:
        "Curso introductorio a las matemáticas discretas, incluyendo teoría de grafos, lógica y combinatoria.",
      carrera: "Ingeniería en Sistemas",
    },
    {
      id: 2,
      materia:
        "Fundamentos de física clásica, incluyendo mecánica, termodinámica y electromagnetismo.",
      carrera: "Ingeniería en Sistemas",
    },
    {
      id: 3,
      materia:
        "Curso que cubre técnicas avanzadas de programación en varios lenguajes y paradigmas.",
      carrera: "Ingeniería en Sistemas",
    },
    {
      id: 4,
      materia:
        "Exploración de las dinámicas sociales y cómo afectan el comportamiento humano en grupos.",
      carrera: "Ciencias Sociales",
    },
  ];

  return (
    <BaseLayout>
        <div className="materias-carreras-page">
        <div className="page-header">
            <h1>Listado de Materias y Carreras</h1>

            <button className="btn-crear">
            Crear Nuevo
            </button>
        </div>

        <div className="table-container">
            <table>
            <thead>
                <tr>
                <th>Materia</th>
                <th>Carrera</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {registros.map((registro) => (
                <tr key={registro.id}>
                    <td className="descripcion">
                    {registro.materia}
                    </td>

                    <td>{registro.carrera}</td>

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