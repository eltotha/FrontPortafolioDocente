import React, { useEffect, useState } from "react";
import BaseLayout from "../../../globalStyles/BaseLayout";
import apiClient from "../../../api/apiClient";
import "./Grupos.css";

export default function GruposMateria() {
  // Estados de datos
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 

  // Estado del Formulario
  const [formData, setFormData] = useState({
    codigo: "",
    materiaId: ""
  });

  // 1. Obtener grupos y materias desde la API
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resGrupos, resMaterias] = await Promise.all([
        apiClient.get("/grupos"),
        apiClient.get("/academico/materias")
      ]);
      setGrupos(resGrupos.data);
      setMaterias(resMaterias.data);
    } catch (err) {
      console.error("Error al conectar con los servicios de grupos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. Controlar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Preparar inserción
  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({
      codigo: "",
      materiaId: materias[0]?.id || ""
    });
    setModalAbierto(true);
  };

  // 4. Preparar edición
  const abrirModalEditar = (grupo) => {
    setEditandoId(grupo.id);
    setFormData({
      codigo: grupo.nombre,
      materiaId: grupo.materiaId
    });
    setModalAbierto(true);
  };

  // 5. Enviar persistencia (POST / PUT)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await apiClient.put(`/grupos/${editandoId}`, formData);
      } else {
        await apiClient.post("/grupos", formData);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      alert("No se pudieron guardar los cambios del grupo.");
    }
  };

  // 6. Eliminar registro físico
  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el grupo "${nombre}"?`)) {
      try {
        await apiClient.delete(`/grupos/${id}`);
        setGrupos((prev) => prev.filter((g) => g.id !== id));
      } catch (err) {
        alert("Ocurrió un problema al intentar remover el grupo.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="grupos-container">
        {/* ENCABEZADO DE CONTROL ACCESIBLE */}
        <div className="grupos-view-header">
          <div className="header-text-group">
            <h1>Control de Grupos</h1>
            <p className="subtitle-text">Administra las secciones académicas habilitadas y sus asignaciones correspondientes.</p>
          </div>
          <button className="btn-primary-action" onClick={abrirModalCrear}>
            ➕ Crear Nuevo Grupo
          </button>
        </div>

        {/* CONTENEDOR DE LA TABLA DE DATOS */}
        <div className="modern-table-card">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Sincronizando secciones y grupos académicos...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Nombre / Código</th>
                  <th>Materia Asignada</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Operaciones</th>
                </tr>
              </thead>

              <tbody>
                {grupos.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                      No se encontraron grupos configurados para las materias actuales.
                    </td>
                  </tr>
                ) : (
                  grupos.map((grupo) => (
                    <tr key={grupo.id}>
                      <td className="font-semibold-cell">{grupo.nombre}</td>
                      <td>{grupo.materia}</td>
                      <td>
                        <span className={`status-badge ${grupo.estado === 'Inactivo' ? 'status-gray' : 'status-green'}`}>
                          {grupo.estado || "Disponible"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(grupo)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(grupo.id, grupo.nombre)}>
                            Eliminar
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

      {/* MODAL PARA CREACIÓN Y EDICIÓN DE GRUPOS */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Grupo" : "Nuevo Grupo Académico"}</h2>
              <span className="modal-subtitle-text">Asigna un identificador único a la sección y vincula su materia.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form">
              <div className="modal-input-group">
                <label>Código / Nombre del Grupo</label>
                <input 
                  type="text" 
                  name="codigo" 
                  placeholder="Ej: Grupo 1T1-IS" 
                  value={formData.codigo} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="modal-input-group">
                <label>Asignar Materia</label>
                <select name="materiaId" value={formData.materiaId} onChange={handleInputChange} required>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>

              <div className="modal-buttons-group">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  {editandoId ? "Actualizar" : "Guardar Grupo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}