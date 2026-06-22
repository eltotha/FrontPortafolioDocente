import React, { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient'; // Verifica que la ruta relativa apunte a tu apiClient
import './TipoUsuario.css';

const TipoUsuario = () => {
  // Estados de datos
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // null = Crear, número = Editar

  // Estado del Formulario
  const [formData, setFormData] = useState({
    tpNombre: "",
    tpDescripcion: ""
  });

  // 1. Obtener los tipos de usuario desde el Backend
  const cargarTipos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/roles'); 
      setTableData(response.data);
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al cargar los roles desde el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  // 2. Manejar cambios en las cajas de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Abrir modal para registrar uno nuevo
  const abrirModalCrear = (e) => {
    e.preventDefault();
    setEditandoId(null);
    setFormData({ tpNombre: "", tpDescripcion: "" });
    setModalAbierto(true);
  };

  // 4. Abrir modal para editar (Cargar datos actuales)
  const abrirModalEditar = (e, item) => {
    e.preventDefault();
    setEditandoId(item.id);
    setFormData({
      tpNombre: item.tpNombre,
      tpDescripcion: item.tpDescripcion || ""
    });
    setModalAbierto(true);
  };

  // 5. Enviar información al servidor (POST / PUT)
  const handleGuardar = async (e) => {
    e.preventDefault();
    
    const userJson = localStorage.getItem('user');
    const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';

    const config = {
      headers: {
        'X-User-Role': userRole
      }
    };

    try {
      if (editandoId) {
        await apiClient.put(`/roles/${editandoId}`, formData, config);
      } else {
        await apiClient.post('/roles', formData, config);
      }
      setModalAbierto(false);
      cargarTipos(); 
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al procesar la solicitud en el servidor.");
    }
  };

  // 6. Eliminar rol
  const handleEliminar = async (e, id, nombre) => {
    e.preventDefault();
    if (window.confirm(`¿Estás seguro de que deseas eliminar el tipo de usuario "${nombre}"?`)) {
      const userJson = localStorage.getItem('user');
      const userRole = userJson ? JSON.parse(userJson).tipo : 'Docente';

      try {
        await apiClient.delete(`/roles/${id}`, {
          headers: { 'X-User-Role': userRole }
        });
        setTableData((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert(err.response?.data?.mensaje || "No se pudo eliminar el rol seleccionado.");
      }
    }
  };

  return (
    <div className="tipo-usuario-container">
      <header className="tipo-usuario-header">
        <h1 className="tipo-usuario-title">Index</h1>
        <a href="#create" className="create-new-link" onClick={abrirModalCrear}>
          Create New
        </a>
      </header>

      {errorMsg && <div style={{ color: "red", padding: "10px 0" }}>{errorMsg}</div>}

      {loading ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Cargando roles desde el servidor...</p>
      ) : (
        <table className="tipo-usuario-table">
          <thead>
            <tr>
              <th>TpNombre</th>
              <th>TpDescripcion</th>
              <th className="actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(item => (
              <tr key={item.id}>
                <td className="tp-nombre">{item.tpNombre}</td>
                <td className="tp-descripcion">{item.tpDescripcion}</td>
                <td className="action-links">
                  <a href="#edit" onClick={(e) => abrirModalEditar(e, item)}>Edit</a> | 
                  <a href="#delete" onClick={(e) => handleEliminar(e, item.id, item.tpNombre)} style={{ color: "#ef4444", marginLeft: "5px" }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL PARA CREAR / EDITAR ROL */}
      {modalAbierto && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <h2>{editandoId ? "Editar Tipo de Usuario" : "Crear Tipo de Usuario"}</h2>
            <form onSubmit={handleGuardar} style={styles.formGrid}>
              
              <label style={styles.label}>Nombre del Rol:</label>
              <input 
                type="text" 
                name="tpNombre" 
                value={formData.tpNombre} 
                onChange={handleInputChange} 
                style={styles.input}
                required 
              />

              <label style={styles.label}>Descripción:</label>
              <textarea 
                name="tpDescripcion" 
                value={formData.tpDescripcion} 
                onChange={handleInputChange} 
                style={styles.textarea}
                rows="4"
              />

              <div style={styles.buttonContainer}>
                <button type="button" onClick={() => setModalAbierto(false)} style={styles.btnCancelar}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnGuardar}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 1000
  },
  modalContent: {
    backgroundColor: "#fff", padding: "24px", borderRadius: "8px",
    width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  formGrid: {
    display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px"
  },
  label: {
    textAlign: "left", fontWeight: "600", fontSize: "14px"
  },
  input: {
    padding: "8px", border: "1px solid #ccc", borderRadius: "4px"
  },
  textarea: {
    padding: "8px", border: "1px solid #ccc", borderRadius: "4px", resize: "none"
  },
  buttonContainer: {
    display: "flex", justifyContent: "space-between", marginTop: "14px"
  },
  btnCancelar: {
    padding: "8px 16px", background: "#718096", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"
  },
  btnGuardar: {
    padding: "8px 16px", background: "#0F71F2", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"
  }
};

// EXPORTACIÓN POR DEFECTO REQUERIDA POR APP.JSX
export default TipoUsuario;