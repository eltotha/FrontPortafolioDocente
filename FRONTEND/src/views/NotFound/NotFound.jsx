import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  
  // Estados del juego absurdo
  const [numeroSecreto, setNumeroSecreto] = useState(1);
  const [intento, setIntento] = useState("");
  const [feedback, setFeedback] = useState("Adivina el número del 1 al 10 o te quedas aquí atrapado.");
  const [seedAvatar, setSeedAvatar] = useState("404");
  const [esError, setEsError] = useState(false);
  const [contadorFallos, setContadorFallos] = useState(0);

  // Inicializar un número aleatorio tonto al cargar
  useEffect(() => {
    generarNuevoJuego();
  }, []);

  const generarNuevoJuego = () => {
    setNumeroSecreto(Math.floor(Math.random() * 10) + 1);
    setContadorFallos(0);
  };

  const manejarIntento = (e) => {
    e.preventDefault();
    const num = parseInt(intento, 10);

    if (isNaN(num)) {
      setFeedback("¡Eso ni siquiera es un número, genio! 🤡");
      setEsError(true);
      return;
    }

    // Cambiar el avatar ridículo de la API usando un seed aleatorio basado en el intento
    setSeedAvatar(Math.random().toString(36).substring(7));

    if (num === numeroSecreto) {
      setFeedback(`¡Milagro! Era el ${numeroSecreto}. Ya puedes huir si quieres. 🎉`);
      setEsError(false);
    } else {
      setContadorFallos(prev => prev + 1);
      setEsError(true);
      
      // Respuestas cada vez más tontas según los fallos
      if (num > numeroSecreto) {
        setFeedback(`Te pasaste. Muy alto. (Llevas ${contadorFallos + 1} osos de la vergüenza)`);
      } else {
        setFeedback(`Muy bajo. Intenta estirarte más. (Llevas ${contadorFallos + 1} osos de la vergüenza)`);
      }
    }
    setIntento("");
  };

  return (
    <div className="tonto-404-screen">
      {/* Fondo con animación de colores psicodélicos sutiles */}
      <div className="tonto-grid-overlay"></div>
      
      <div className={`tonto-card ${esError ? "animacion-shake" : ""}`} onAnimationEnd={() => setEsError(false)}>
        
        {/* AVATAR DINÁMICO DE LA API (DiceBear Bots/Avatars graciosos) */}
        <div className="avatar-wrapper-absurdo">
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seedAvatar}&backgroundColor=b6e3f4`} 
            alt="Monstruo tonto 404" 
            className="avatar-tonto"
          />
          <div className="ojos-giratorios">👀</div>
        </div>

        <span className="tonto-code">¿QUÉ HACES AQUÍ?</span>
        <h1 className="tonto-title">404: Te perdiste feo</h1>
        
        {/* INTERFAZ DEL EASTER EGG */}
        <div className="juego-tonto-box">
          <p className={`juego-feedback ${esError ? "texto-alerta" : "texto-exito"}`}>
            {feedback}
          </p>
          
          <form onSubmit={manejarIntento} className="juego-form">
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={intento}
              onChange={(e) => setIntento(e.target.value)}
              placeholder="¿?" 
              className="juego-input"
            />
            <button type="submit" className="btn-probar">Probar Suerte 🎲</button>
          </form>
        </div>

        {/* ACCIONES DE RETORNO INSTITUCIONALES */}
        <div className="tonto-actions">
          <button className="btn-secondary-action" onClick={() => navigate("/home")}>
            🏃‍♂️ Rendirse y volver al Inicio
          </button>
          {contadorFallos > 2 && (
            <button type="button" className="btn-trampa" onClick={generarNuevoJuego}>
              🔄 Reiniciar porque ya diste pena
            </button>
          )}
        </div>
      </div>
    </div>
  );
}