import React from 'react'
import { useNavigate } from 'react-router-dom'
import BaseLayout from '../../globalStyles/BaseLayout'
import './home.css'

export default function Home() {
    const navigate = useNavigate()
    const usuarios = ["Usuario"];
  return (
    <BaseLayout>
      <div className="dashboard">
      <aside className="sidebar">
        <h2>Usuarios en línea</h2>

        {usuarios.map((usuario, index) => (
          <div key={index} className="usuario">
            {usuario}
          </div>
        ))}
      </aside>

      <main className="content">
        <button className="btn-informe" onClick={() => navigate('/reportemateriascarrera')}>
          Informe de Datos
        </button>

        <h1>Mantenimiento</h1>

        <table>
          <thead>
            <tr>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <button className="btn-verde" onClick={() => navigate('/usuarios')}>
                  Ir a Usuarios
                </button>
              </td>
              <td>
                Administrar los usuarios en el sistema.
              </td>
            </tr>

            <tr>
              <td>
                <button className="btn-verde" onClick={() => navigate('/escuelas')}>
                  Ir a Escuelas
                </button>
              </td>
              <td>
                Administrar las escuelas disponibles en el sistema.
              </td>
            </tr>

            <tr>
              <td>
                <button className="btn-verde" onClick={() => navigate('/carreras')}>
                  Ir a Carreras
                </button>
              </td>
              <td>
                Administrar las carreras disponibles en el sistema.
              </td>
            </tr>

            <tr>
              <td>
                <button className="btn-verde" onClick={() => navigate('/materias')}>
                  Ir a Materias
                </button>
              </td>
              <td>
                Administrar las materias disponibles en el sistema.
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
    </BaseLayout>
  )
}
