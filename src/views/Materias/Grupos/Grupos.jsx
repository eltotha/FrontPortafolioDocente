import "./Grupos.css";
import BaseLayout from "../../../globalStyles/BaseLayout";

export default function GruposMateria() {
  const grupos = [
    {
      id: 1,
      nombre: "Grupo A - Matemáticas Discretas",
      tipoMateria:
        "Materia donde se imparte teoría, generalmente con clases magistrales.",
      usuario: "Gonzalez",
      materia:
        "Curso introductorio a las matemáticas discretas, incluyendo teoría de grafos, lógica y combinatoria.",
      portafolio: "Portafolio de Ingeniería en Sistemas",
      estado: "Abierto",
    },
    {
      id: 2,
      nombre: "Grupo B - Física General",
      tipoMateria:
        "Materia donde se imparte teoría, generalmente con clases magistrales.",
      usuario: "Gonzalez",
      materia:
        "Fundamentos de física clásica, incluyendo mecánica, termodinámica y electromagnetismo.",
      portafolio: "Portafolio de Ciencias Sociales",
      estado: "Abierto",
    },
  ];

  return (
    <baseLayout>
        <div className="grupos-page">
        <div className="grupos-header">
            <h1>Índice de Grupos de Materia</h1>

            <button className="btn-crear">
            Crear Nuevo
            </button>
        </div>

        <div className="tabla-container">
            <table>
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Tipo de Materia</th>
                <th>Usuario</th>
                <th>Materia</th>
                <th>Portafolio</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {grupos.map((grupo) => (
                <tr key={grupo.id}>
                    <td>{grupo.nombre}</td>

                    <td>{grupo.tipoMateria}</td>

                    <td>{grupo.usuario}</td>

                    <td>{grupo.materia}</td>

                    <td>{grupo.portafolio}</td>

                    <td>
                    <span className="estado-abierto">
                        {grupo.estado}
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
    </baseLayout>
  );
}