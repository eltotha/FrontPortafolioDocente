import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../globalStyles/BaseLayout";
import apiClient from "../../api/apiClient";
import "./Materias.css";

export default function Materias() {
  const navigate = useNavigate();
  
  // Estados de datos del catálogo
  const [materias, setMaterias] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 

  // Estado del Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "Disponible",
    schoolId: "" // Sincronizado con tu nomenclatura interna
  });

  // 1. Cargar las materias y escuelas desde el API
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resMaterias, resEscuelas] = await Promise.all([
        apiClient.get("/academico/materias"),
        apiClient.get("/academico/escuelas")
      ]);
      setMaterias(resMaterias.data);
      setEscuelas(resEscuelas.data);
    } catch (err) {
      console.error("Error al obtener materias o escuelas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. Manejar cambios en las entradas del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Abrir modal para inserción
  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({
      nombre: "",
      descripcion: "",
      estado: "Disponible",
      escuelaId: escuelas[0]?.id || ""
    });
    setModalAbierto(true);
  };

  // 4. Abrir modal para actualización
  const abrirModalEditar = (materia) => {
    setEditandoId(materia.id);
    setFormData({
      nombre: materia.nombre,
      descripcion: materia.descripcion || "",
      estado: materia.estado,
      escuelaId: materia.escuelaId
    });
    setModalAbierto(true);
  };

  // 5. Procesar envío de datos (POST / PUT)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await apiClient.put(`/academico/materias/${editandoId}`, formData);
      } else {
        await apiClient.post("/academico/materias", formData);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al procesar la solicitud.");
    }
  };

  // 6. Eliminar registro físico de la asignatura
  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar la materia "${nombre}"?`)) {
      try {
        await apiClient.delete(`/academico/materias/${id}`);
        setMaterias((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        alert(err.response?.data?.mensaje || "No se pudo eliminar el registro.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="materias-container">
        {/* ENCABEZADO DE CONTROL ACCESIBLE */}
        <div className="materias-view-header">
          <div className="header-text-group">
            <h1>Catálogo de Materias</h1>
            <p className="subtitle-text">Gestiona las asignaturas universitarias, descripciones de sílabo y sus dependencias.</p>
          </div>
          <div className="header-actions-group">
            <button className="btn-secondary-action" onClick={() => navigate('/materiascarreras')}>
              🔗 Materias y Carreras
            </button>
            <button className="btn-secondary-action" onClick={() => navigate('/grupos')}>
              👥 Configurar Grupos
            </button>
            <button className="btn-primary-action" onClick={abrirModalCrear}>
              ➕ Nueva Materia
            </button>
          </div>
        </div>

        {/* CONTENEDOR DE LA TABLA DE DATOS */}
        <div className="modern-table-card">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Cargando asignaturas académicas...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Nombre de Asignatura</th>
                  <th>Descripción / Sílabo</th>
                  <th>Escuela</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Operaciones</th>
                </tr>
              </thead>

              <tbody>
                {materias.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                      No se encontraron materias registradas en este catálogo.
                    </td>
                  </tr>
                ) : (
                  materias.map((materia) => (
                    <tr key={materia.id}>
                      <td className="font-semibold-cell">{materia.nombre}</td>
                      <td className="descripcion-cell">{materia.descripcion || "Sin descripción asignada."}</td>
                      <td>{materia.escuela}</td>
                      <td>
                        <span className={`status-badge ${materia.estado === 'Disponible' ? 'status-green' : 'status-gray'}`}>
                          {materia.estado}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(materia)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(materia.id, materia.nombre)}>
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

      {/* MODAL INTERACTIVO PARA MATERIAS */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Asignatura" : "Nueva Asignatura"}</h2>
              <span className="modal-subtitle-text">Completa la ficha técnica académica para actualizar la grilla operativa.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form">
              <div className="modal-input-group">
                <label>Nombre de la Materia</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ej. Estructuras de Datos"
                  required 
                />
              </div>

              <div className="modal-input-group">
                <label>Descripción / Sílabo</label>
                <textarea 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange} 
                  placeholder="Escribe un breve resumen de los objetivos de la materia..."
                  rows="3" 
                />
              </div>

              <div className="modal-input-group">
                <label>Escuela Propietaria</label>
                <select name="escuelaId" value={formData.escuelaId} onChange={handleInputChange} required>
                  {escuelas.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>

              <div className="modal-input-group">
                <label>Estado de Disponibilidad</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No Disponible</option>
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