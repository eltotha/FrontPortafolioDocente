import React, { useEffect, useState } from "react";
import BaseLayout from "../../globalStyles/BaseLayout";
import apiClient from "../../api/apiClient"; 
import "./ReporteMateriasCarreras.css";

export default function ReporteMateriasCarreras() {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';

        const config = {
            headers: {
                'X-User-Role': userRole
            }
        };

        apiClient.get('/reportes/materias-carreras', config)
            .then((response) => {
                setDatos(response.data);
                setErrorMsg("");
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al cargar el informe:", error);
                setErrorMsg("No se pudo cargar la información del reporte. Verifique sus permisos de acceso.");
                setLoading(false);
            });
    }, []);

    // FUNCIÓN NATIVA PARA EXPORTAR A EXCEL (.xls)
    const exportarAExcel = () => {
        if (datos.length === 0) {
            alert("No hay datos disponibles para exportar.");
            return;
        }

        let xmlTemplate = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" 
          xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" 
          xmlns:html="http://www.w3.org/TR/REC-html40">
  <Worksheet ss:Name="Reporte Académico">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">Materia</Data></Cell>
        <Cell><Data ss:Type="String">Descripción de la Materia</Data></Cell>
        <Cell><Data ss:Type="String">Estado de la Materia</Data></Cell>
        <Cell><Data ss:Type="String">Carrera</Data></Cell>
        <Cell><Data ss:Type="String">Escuela</Data></Cell>
        <Cell><Data ss:Type="String">Estado de la Carrera</Data></Cell>
      </Row>`;

        datos.forEach(item => {
            xmlTemplate += `
      <Row>
        <Cell><Data ss:Type="String">${item.materia || ""}</Data></Cell>
        <Cell><Data ss:Type="String">${item.descripcion || "Sin descripción"}</Data></Cell>
        <Cell><Data ss:Type="String">${item.estadoMateria || ""}</Data></Cell>
        <Cell><Data ss:Type="String">${item.carrera || ""}</Data></Cell>
        <Cell><Data ss:Type="String">${item.escuela || ""}</Data></Cell>
        <Cell><Data ss:Type="String">${item.estadoCarrera || ""}</Data></Cell>
      </Row>`;
        });

        xmlTemplate += `
    </Table>
  </Worksheet>
</Workbook>`;

        const blob = new Blob([xmlTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Informe_Materias_Carreras.xls");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <BaseLayout>
            <div className="reportes-container">
                {/* ENCABEZADO DE CONTROL ACCESIBLE */}
                <div className="reportes-view-header">
                  <div className="header-text-group">
                    <h1>Informe de Materias y Carreras</h1>
                    <p className="subtitle-text">Consulta y exporta la relación consolidada de la estructura académica institucional.</p>
                  </div>
                  <button className="btn-primary-action" onClick={exportarAExcel}>
                    📥 Exportar a Excel
                  </button>
                </div>

                {/* ALERTA DE ERROR ESTILIZADA */}
                {errorMsg && (
                    <div className="modern-error-alert">
                        <span className="alert-icon">⚠️</span> {errorMsg}
                    </div>
                )}

                {/* CONTENEDOR DE LA TABLA DE DATOS */}
                <div className="modern-table-card">
                    {loading ? (
                        <div className="loading-state-box">
                          <div className="loading-spinner"></div>
                          <p>Procesando y consolidando datos de la auditoría académica...</p>
                        </div>
                    ) : (
                        <table className="modern-data-table">
                            <thead>
                                <tr>
                                    <th>Materia</th>
                                    <th>Descripción de Asignatura</th>
                                    <th>Estado Asignatura</th>
                                    <th>Carrera Destino</th>
                                    <th>Escuela</th>
                                    <th>Estado Carrera</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                                            No se encontraron registros asociados en la base de datos para este informe.
                                        </td>
                                    </tr>
                                ) : (
                                    datos.map((item, index) => (
                                        <tr key={index}>
                                            <td className="font-semibold-cell">{item.materia}</td>
                                            <td className="descripcion-cell">{item.descripcion || "Sin descripción"}</td>
                                            <td>
                                                <span className={`status-badge ${item.estadoMateria?.toLowerCase() === 'disponible' ? 'status-green' : 'status-gray'}`}>
                                                    {item.estadoMateria}
                                                </span>
                                            </td>
                                            <td>{item.carrera}</td>
                                            <td>{item.escuela}</td>
                                            <td>
                                                <span className={`status-badge ${item.estadoCarrera?.toLowerCase() === 'operativa' ? 'status-green' : 'status-gray'}`}>
                                                    {item.estadoCarrera}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
}