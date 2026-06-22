import React, { useEffect, useState } from "react";
import BaseLayout from "../../../globalStyles/BaseLayout";
import apiClient from "../../../api/apiClient";
import "./MateriasCarreras.css";

export default function MateriasCarreras() {
  // Estados de datos
  const [registros, setRegistros] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal Interactivo
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 

  // Estado del Formulario
  const [formData, setFormData] = useState({
    materiaId: "",
    carreraId: ""
  });

  // 1. Cargar registros y catálogos desde el Backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resRelaciones, resMaterias, resCarreras] = await Promise.all([
        apiClient.get("/materiascarreras"),
        apiClient.get("/academico/materias"),
        apiClient.get("/academico/carreras")
      ]);
      setRegistros(resRelaciones.data);
      setMaterias(resMaterias.data);
      setCarreras(resCarreras.data);
    } catch (err) {
      console.error("Error al cargar la asignación de materias y carreras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. Manejar cambios en selectores
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Abrir modal para Crear
  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({
      materiaId: materias[0]?.id || "",
      carreraId: carreras[0]?.id || ""
    });
    setModalAbierto(true);
  };

  // 4. Abrir modal para Editar
  const abrirModalEditar = (registro) => {
    setEditandoId(registro.id);
    setFormData({
      materiaId: registro.materiaId,
      carreraId: registro.carreraId
    });
    setModalAbierto(true);
  };

  // 5. Guardar asignación (POST / PUT)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await apiClient.put(`/materiascarreras/${editandoId}`, formData);
      } else {
        await apiClient.post("/materiascarreras", formData);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      alert("Error al intentar procesar la asignación académica.");
    }
  };

  // 6. Eliminar asignación (Desasociar)
  const handleEliminar = async (id, materia, carrera) => {
    if (window.confirm(`¿Deseas remover la materia "${materia}" de la carrera "${carrera}"?`)) {
      try {
        await apiClient.delete(`/materiascarreras/${id}`);
        setRegistros((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert("No se pudo desvincular el registro seleccionado.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="mc-container">
        {/* ENCABEZADO DE LA VISTA */}
        <div className="mc-view-header">
          <div className="header-text-group">
            <h1>Mapeo Académico</h1>
            <p className="subtitle-text">Vincula las asignaturas del catálogo docente con sus respectivas carreras operativas.</p>
          </div>
          <button className="btn-primary-action" onClick={abrirModalCrear}>
            ➕ Nueva Asignación
          </button>
        </div>

        {/* CONTENEDOR DE LA TABLA DE DATOS */}
        <div className="modern-table-card">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Sincronizando mallas curriculares...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Materia / Asignatura</th>
                  <th>Carrera Universitaria</th>
                  <th style={{ textAlign: "right" }}>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                      No se han generado vínculos curriculares en este periodo.
                    </td>
                  </tr>
                ) : (
                  registros.map((registro) => (
                    <tr key={registro.id}>
                      <td className="font-semibold-cell">{registro.materia}</td>
                      <td>{registro.carrera}</td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(registro)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(registro.id, registro.materia, registro.carrera)}>
                            Desvincular
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL INTERACTIVO DE ASIGNACIÓN */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Relación" : "Asignar Asignatura"}</h2>
              <span className="modal-subtitle-text">Selecciona los componentes para estructurar la malla curricular.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form">
              <div className="modal-input-group">
                <label>Seleccione la Materia</label>
                <select name="materiaId" value={formData.materiaId} onChange={handleSelectChange} required>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>

              <div className="modal-input-group">
                <label>Seleccione la Carrera</label>
                <select name="carreraId" value={formData.carreraId} onChange={handleSelectChange} required>
                  {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div className="modal-buttons-group">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  {editandoId ? "Actualizar" : "Vincular Componentes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}