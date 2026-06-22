import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../globalStyles/BaseLayout";
import apiClient from "../../api/apiClient";
import "./Carreras.css";

export default function Carreras() {
  const navigate = useNavigate();
  const [carreras, setCarreras] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    escuelaId: "",
    estado: "Operativa"
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resCarreras, resEscuelas] = await Promise.all([
        apiClient.get("/academico/carreras"),
        apiClient.get("/academico/escuelas")
      ]);
      setCarreras(resCarreras.data);
      setEscuelas(resEscuelas.data);
    } catch (err) {
      console.error("Error al cargar datos de carreras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({ nombre: "", escuelaId: escuelas[0]?.id || "", estado: "Operativa" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (carrera) => {
    setEditandoId(carrera.id);
    setFormData({ nombre: carrera.nombre, escuelaId: carrera.escuelaId, estado: carrera.estado });
    setModalAbierto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem('user');
    const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';
    const config = { headers: { 'X-User-Role': userRole } };

    try {
      if (editandoId) {
        await apiClient.put(`/academico/carreras/${editandoId}`, formData, config);
      } else {
        await apiClient.post("/academico/carreras", formData, config);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al procesar solicitud.");
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar la carrera "${nombre}"?`)) {
      const userJson = localStorage.getItem('user');
      const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';

      try {
        await apiClient.delete(`/academico/carreras/${id}`, {
          headers: { 'X-User-Role': userRole }
        });
        setCarreras((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        alert(err.response?.data?.mensaje || "Error al eliminar registro.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="carreras-container">
        {/* ENCABEZADO DE CONTROL ACCESIBLE */}
        <div className="carreras-view-header">
          <div className="header-text-group">
            <h1>Lista de Carreras</h1>
            <p className="subtitle-text">Gestiona los programas de estudio activos y sus escuelas correspondientes.</p>
          </div>
          <div className="header-actions-group">
            <button className="btn-secondary-action" onClick={() => navigate('/materiascarreras')}>
              📂 Vincular Materias
            </button>
            <button className="btn-primary-action" onClick={abrirModalCrear}>
              ➕ Crear Nueva Carrera
            </button>
          </div>
        </div>

        {/* CONTENEDOR DE LA TABLA DE DATOS */}
        <div className="modern-table-card">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Cargando registros del catálogo...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Nombre de la Carrera</th>
                  <th>Escuela Asignada</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {carreras.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                      No se encontraron carreras registradas en el sistema.
                    </td>
                  </tr>
                ) : (
                  carreras.map((carrera) => (
                    <tr key={carrera.id}>
                      <td className="font-semibold-cell">{carrera.nombre}</td>
                      <td>{carrera.escuela}</td>
                      <td>
                        <span className={`status-badge ${carrera.estado === 'Operativa' ? 'status-green' : 'status-gray'}`}>
                          {carrera.estado}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(carrera)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(carrera.id, carrera.nombre)}>
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

      {/* MODAL RESPONSIVO INCORPORADO */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Registro" : "Nuevo Registro"}</h2>
              <span className="modal-subtitle-text">Completa los campos para actualizar la base de datos de carreras.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form">
              <div className="modal-input-group">
                <label>Nombre de la Carrera</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ej. Ingeniería en Sistemas"
                  required 
                />
              </div>

              <div className="modal-input-group">
                <label>Escuela Perteneciente</label>
                <select name="escuelaId" value={formData.escuelaId} onChange={handleInputChange} required>
                  {escuelas.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
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