import React from 'react';
import './FloatingToolbar.css';

function FloatingToolbar({
  onFontSizeChange,
  onFontChange,
  onColorChange,
  onBackgroundColorChange,
  onSpeakText,
  onPauseText,
  onResumeText,
  onStopText,
  onVoiceChange,
  onLanguageChange,
  onOpenTranscriptionWindow,
  languages,
  voices,
}) {
  return (
    <div className="floating-toolbar">
      <div>
        <label>Tamaño de Fuente: </label>
        <input type="number" min="10" max="36" onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))} />
      </div>
      <div>
        <label>Fuente: </label>
        <select onChange={(e) => onFontChange(e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>
      <div>
        <label>Color de Fuente: </label>
        <input type="color" onChange={(e) => onColorChange(e.target.value)} />
      </div>
      <div>
        <label>Color de Fondo: </label>
        <input type="color" onChange={(e) => onBackgroundColorChange(e.target.value)} />
      </div>
      <div>
        <label>Idioma: </label>
        <select onChange={(e) => onLanguageChange(e.target.value)}>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Voz: </label>
        <select onChange={(e) => onVoiceChange(e.target.value)}>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={onSpeakText}>Reproducir</button>
      <button onClick={onPauseText}>Pausar</button>
      <button onClick={onResumeText}>Reanudar</button>
      <button onClick={onStopText}>Detener</button>
      <button onClick={onOpenTranscriptionWindow}>Abrir Transcripción</button>
    </div>
  );
}

export default FloatingToolbar;
