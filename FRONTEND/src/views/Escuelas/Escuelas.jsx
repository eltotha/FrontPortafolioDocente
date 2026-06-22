import React, { useEffect, useState } from "react";
import BaseLayout from "../../globalStyles/BaseLayout";
import apiClient from "../../api/apiClient";
import "./Escuelas.css";

export default function Escuelas() {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    estado: "Operativa"
  });

  const cargarEscuelas = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/academico/escuelas");
      setEscuelas(response.data);
    } catch (err) {
      console.error("Error al cargar escuelas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEscuelas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({ nombre: "", estado: "Operativa" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (escuela) => {
    setEditandoId(escuela.id);
    setFormData({ nombre: escuela.nombre, estado: escuela.estado });
    setModalAbierto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem('user');
    const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';
    const config = { headers: { 'X-User-Role': userRole } };

    try {
      if (editandoId) {
        await apiClient.put(`/academico/escuelas/${editandoId}`, formData, config);
      } else {
        await apiClient.post("/academico/escuelas", formData, config);
      }
      setModalAbierto(false);
      cargarEscuelas();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al guardar el registro.");
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar la escuela "${nombre}"?`)) {
      const userJson = localStorage.getItem('user');
      const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';
      
      try {
        await apiClient.delete(`/academico/escuelas/${id}`, {
          headers: { 'X-User-Role': userRole }
        });
        setEscuelas((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        alert(err.response?.data?.mensaje || "Error al eliminar el registro.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="escuelas-container">
        {/* ENCABEZADO DE CONTROL */}
        <div className="escuelas-view-header">
          <div className="header-text-group">
            <h1>Gestión de Escuelas</h1>
            <p className="subtitle-text">Administra las facultades o escuelas operativas del sistema académico.</p>
          </div>
          <button className="btn-primary-action" onClick={abrirModalCrear}>
            ➕ Crear Nueva Escuela
          </button>
        </div>

        {/* TABLA DE REGISTROS */}
        <div className="modern-table-card">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Sincronizando registros de escuelas...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Nombre de la Escuela</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {escuelas.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                      No se encontraron escuelas registradas.
                    </td>
                  </tr>
                ) : (
                  escuelas.map((escuela) => (
                    <tr key={escuela.id}>
                      <td className="font-semibold-cell">{escuela.nombre}</td>
                      <td>
                        <span className={`status-badge ${escuela.estado === 'Operativa' ? 'status-green' : 'status-gray'}`}>
                          {escuela.estado}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(escuela)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(escuela.id, escuela.nombre)}>
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

      {/* MODAL DE ENTRADA DE DATOS */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Escuela" : "Nueva Escuela"}</h2>
              <span className="modal-subtitle-text">Especifica los parámetros requeridos para la facultad académica.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form">
              <div className="modal-input-group">
                <label>Nombre de la Escuela</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ej. Escuela de Ingeniería"
                  required 
                />
              </div>

              <div className="modal-input-group">
                <label>Estado Operativo</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                  <option value="Operativa">Operativa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>

              <div className="modal-buttons-group">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  {editandoId ? "Actualizar" : "Guardar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}