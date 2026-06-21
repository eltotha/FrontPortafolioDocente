import BaseLayout from "../../globalStyles/BaseLayout";
import "./Escuelas.css";

export default function Escuelas() {
  const escuelas = [
    {
      id: 1,
      nombre: "Escuela de Ingeniería en Sistemas",
      estado: "Operativa",
    },
    {
      id: 2,
      nombre: "Escuela de Ciencias Sociales",
      estado: "Operativa",
    },
    {
      id: 3,
      nombre: "Escuela de Medicina",
      estado: "Operativa",
    },
  ];

  return (
    <BaseLayout>
        <div className="escuelas-page">
        <div className="escuelas-header">
            <h1>Índice</h1>

            <button className="btn-crear">
            Crear Nueva
            </button>
        </div>

        <div className="tabla-container">
            <table>
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {escuelas.map((escuela) => (
                <tr key={escuela.id}>
                    <td>{escuela.nombre}</td>

                    <td>
                    <span className="estado">
                        {escuela.estado}
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