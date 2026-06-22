import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "./../../globalStyles/BaseLayout";
import apiClient from "../../api/apiClient"; 
import "./Usuarios.css";

export default function Usuarios() {
  const navigate = useNavigate();
  
  // Estados de datos
  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuarios, setTiposUsuarios] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Modal de captura
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 

  // Estado del Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNac: "",
    correo: "",
    username: "",
    password: "",
    tipoUsuarioId: "",
    escuelaId: "",
    estado: "Activo"
  });

  // 1. Cargar datos iniciales del Backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const userJson = localStorage.getItem('user');
      const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';
      const config = { headers: { 'X-User-Role': userRole } };

      const [resUsers, resTipos, resEscuelas] = await Promise.all([
        apiClient.get("/usuarios", config),
        apiClient.get("/roles", config),          
        apiClient.get("/academico/escuelas", config)
      ]);

      setUsuarios(resUsers.data);
      setTiposUsuarios(resTipos.data);
      setEscuelas(resEscuelas.data);
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.mensaje || "Error al conectar con el servidor o permisos denegados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Abrir modal para Crear
  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormData({
      nombre: "",
      apellido: "",
      fechaNac: "",
      correo: "",
      username: "",
      password: "",
      tipoUsuarioId: tiposUsuarios[0]?.id || "",
      escuelaId: escuelas[0]?.id || "",
      estado: "Activo"
    });
    setModalAbierto(true);
  };

  // 4. Abrir modal para Editar
  const abrirModalEditar = async (id) => {
    try {
      const response = await apiClient.get(`/usuarios/${id}`);
      const u = response.data;
      
      const fechaFormateada = u.fechaNac ? u.fechaNac.split("T")[0] : "";

      setEditandoId(id);
      setFormData({
        nombre: u.nombre,
        apellido: u.apellido,
        fechaNac: fechaFormateada,
        correo: u.correo,
        username: u.username,
        password: u.password,
        tipoUsuarioId: u.tipoUsuarioId,
        escuelaId: u.escuelaId,
        estado: u.estado
      });
      setModalAbierto(true);
    } catch (err) {
      alert("No se pudieron recuperar los detalles del usuario.");
    }
  };

  // 5. Guardar Cambios (POST o PUT)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await apiClient.put(`/usuarios/${editandoId}`, formData);
      } else {
        await apiClient.post("/usuarios", formData);
      }
      setModalAbierto(false);
      cargarDatos(); 
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al procesar la operación.");
    }
  };

  // 6. Eliminar Registro
  const handleEliminar = async (id, nombreCompleto) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombreCompleto}"?`)) {
      try {
        await apiClient.delete(`/usuarios/${id}`);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        alert("No tienes permisos o el usuario no puede ser eliminado.");
      }
    }
  };

  return (
    <BaseLayout>
      <div className="usuarios-container">
        {/* ENCABEZADO DE CONTROL ACCESIBLE */}
        <div className="usuarios-view-header">
          <div className="header-text-group">
            <h1>Control de Usuarios</h1>
            <p className="subtitle-text">Administra las credenciales, roles y escuelas asignadas a los docentes y administradores.</p>
          </div>
          <div className="header-actions-group">
            <button className="btn-secondary-action" onClick={() => navigate("/tipousuarios")}>
              ⚙️ Tipos de Usuario
            </button>
            <button className="btn-primary-action" onClick={abrirModalCrear}>
              ➕ Crear Nuevo Usuario
            </button>
          </div>
        </div>

        {/* NOTIFICACIÓN DE ERROR */}
        {errorMsg && (
          <div className="modern-error-alert">
            <span className="alert-icon">⚠️</span> {errorMsg}
          </div>
        )}

        {/* CONTENEDOR DE LA TABLA DE DATOS */}
        <div className="modern-table-card table-responsive-wrapper">
          {loading ? (
            <div className="loading-state-box">
              <div className="loading-spinner"></div>
              <p>Cargando usuarios desde la base de datos...</p>
            </div>
          ) : (
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha Nac.</th>
                  <th>Correo</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Rol / Tipo</th>
                  <th>Estado</th>
                  <th>Escuela</th>
                  <th style={{ textAlign: 'right' }}>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                      No se encontraron usuarios registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="font-semibold-cell">{usuario.nombre}</td>
                      <td className="font-semibold-cell">{usuario.apellido}</td>
                      <td>{usuario.fechaNac}</td>
                      <td>{usuario.correo}</td>
                      <td><code>{usuario.username}</code></td>
                      <td><span className="password-mask">{usuario.password}</span></td>
                      <td>{usuario.tipo}</td>
                      <td>
                        <span className={`status-badge ${usuario.estado === 'Activo' ? 'status-green' : 'status-gray'}`}>
                          {usuario.estado}
                        </span>
                      </td>
                      <td>{usuario.escuela}</td>
                      <td>
                        <div className="table-actions-row">
                          <button className="btn-table-edit" onClick={() => abrirModalEditar(usuario.id)}>
                            Editar
                          </button>
                          <button className="btn-table-delete" onClick={() => handleEliminar(usuario.id, `${usuario.nombre} ${usuario.apellido}`)}>
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

      {/* MODAL OPTIMIZADO EN DOS COLUMNAS */}
      {modalAbierto && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-box modal-large">
            <div className="modal-box-header">
              <h2>{editandoId ? "Modificar Usuario" : "Registrar Nuevo Usuario"}</h2>
              <span className="modal-subtitle-text">Asigna datos personales y configuraciones de seguridad para el perfil corporativo.</span>
            </div>
            
            <form onSubmit={handleGuardar} className="modern-modal-form split-form-grid">
              <div className="modal-input-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej. Diego" required />
              </div>

              <div className="modal-input-group">
                <label>Apellido</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Ej. Mairena" required />
              </div>

              <div className="modal-input-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" name="fechaNac" value={formData.fechaNac} onChange={handleInputChange} required />
              </div>

              <div className="modal-input-group">
                <label>Correo Electrónico</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="ejemplo@universidad.edu" required />
              </div>

              <div className="modal-input-group">
                <label>Nombre de Usuario</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Ej. dmairena" required />
              </div>

              <div className="modal-input-group">
                <label>Contraseña de Acceso</label>
                <input type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required />
              </div>

              <div className="modal-input-group">
                <label>Tipo de Usuario / Rol</label>
                <select name="tipoUsuarioId" value={formData.tipoUsuarioId} onChange={handleInputChange} required>
                  {tiposUsuarios.map(t => <option key={t.id} value={t.id}>{t.tpNombre}</option>)}
                </select>
              </div>

              <div className="modal-input-group">
                <label>Escuela Asignada</label>
                <select name="escuelaId" value={formData.escuelaId} onChange={handleInputChange} required>
                  {escuelas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>

              <div className="modal-input-group full-width-field">
                <label>Estado del Perfil</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="modal-buttons-group full-width-field">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  {editandoId ? "Actualizar" : "Guardar Perfil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}