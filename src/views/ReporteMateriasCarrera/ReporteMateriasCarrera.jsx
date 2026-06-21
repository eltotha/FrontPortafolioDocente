import BaseLayout from "../../globalStyles/BaseLayout";
import "./ReporteMateriasCarreras.css";

export default function ReporteMateriasCarreras() {
  const datos = [
    {
      materia: "Matemáticas Discretas",
      descripcion:
        "Curso introductorio a las matemáticas discretas, incluyendo teoría de grafos, lógica y combinatoria.",
      estadoMateria: "Disponible",
      carrera: "Ingeniería en Sistemas",
      escuela: "Escuela de Ingeniería en Sistemas",
      estadoCarrera: "Operativa",
    },
    {
      materia: "Física General",
      descripcion:
        "Fundamentos de física clásica, incluyendso mecánica, termodinámica y electromagnetismo.",
      estadoMateria: "Disponible",
      carrera: "Ingeniería en Sistemas",
      escuela: "Escuela de Ingeniería en Sistemas",
      estadoCarrera: "Operativa",
    },
  ];

  return (
    <BaseLayout>
        <div className="reporte-container">
        <div className="reporte-header">
            <h1>Informe de Materias y Carreras</h1>

            <button className="btn-exportar">
            📄 Exportar a Excel
            </button>
        </div>

        <div className="tabla-container">
            <table>
            <thead>
                <tr>
                <th>Materia</th>
                <th>Descripción de la Materia</th>
                <th>Estado de la Materia</th>
                <th>Carrera</th>
                <th>Escuela</th>
                <th>Estado de la Carrera</th>
                </tr>
            </thead>

            <tbody>
                {datos.map((item, index) => (
                <tr key={index}>
                    <td>{item.materia}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.estadoMateria}</td>
                    <td>{item.carrera}</td>
                    <td>{item.escuela}</td>
                    <td>{item.estadoCarrera}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    
    </BaseLayout>
  );
}