import React, { useState, useEffect } from 'react';

const SpeechSynthesis = ({ optimizedRoute }) => {
  const [speechInstance, setSpeechInstance] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true); // Estado para mostrar o no el botón de inicio

  useEffect(() => {
    if ('speechSynthesis' in window && optimizedRoute.instructions.length > 0) {
      const instructions = optimizedRoute.instructions.map(inst => `${inst.text}, en ${inst.distance} metros`).join('. ');
      const newSpeechInstance = new SpeechSynthesisUtterance(instructions);
      newSpeechInstance.lang = 'es-ES';
      setSpeechInstance(newSpeechInstance);
    } else {
      console.error('Speech Synthesis not supported or no instructions to speak');
    }
  }, [optimizedRoute]);

  const startSpeaking = () => {
    if (speechInstance) {
      window.speechSynthesis.cancel(); // Cancelar cualquier síntesis en curso
      window.speechSynthesis.speak(speechInstance);
      setShowStartButton(false); // Ocultar el botón de inicio después de iniciarse la síntesis
    }
  };

  const pauseInstructions = () => {
    if ('speechSynthesis' in window && speechInstance && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeInstructions = () => {
    if ('speechSynthesis' in window && speechInstance && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  return (
    <div className="speech-controls">
      {showStartButton && (
        <button className="btn" onClick={startSpeaking}>
          <i className="fas fa-volume-up"></i> Iniciar Instrucciones
        </button>
      )}
      {!showStartButton && (
        <>
          {!isPaused && (
            <button className="btn" onClick={pauseInstructions}>
              <i className="fas fa-pause"></i> Pausar
            </button>
          )}
          {isPaused && (
            <button className="btn" onClick={resumeInstructions}>
              <i className="fas fa-play-circle"></i> Reanudar
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SpeechSynthesis;
