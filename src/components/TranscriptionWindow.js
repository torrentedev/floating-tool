import React from 'react';

const TranscriptionWindow = ({ visible, currentMedia, onClose }) => {
  const transcriptionWindowStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '600px',
    height: '600px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    padding: '10px',
    display: visible ? 'block' : 'none',
  };

  const getHighlightedWord = (word, index) => {
    return (
      <span>
        {word.split('').map((char, i) => (
          <span key={i} style={{ color: i === index ? 'red' : 'black', fontWeight: i === index ? 'bold' : 'normal' }}>
            {char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div style={transcriptionWindowStyle}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Cerrar</button>
      <div className="image-container">
        {currentMedia && currentMedia.type !== 'text' && (
          <>
            <img
              id="signImage"
              className="image"
              src={currentMedia.src}
              alt="Sign Image"
              style={{ maxWidth: '75%', maxHeight: '75%' }}
            />
            <div id="imageLabel" className="image-label">
              {currentMedia.type === 'alphabet'
                ? getHighlightedWord(currentMedia.label, 0)
                : <strong style={{ color: 'red' }}>{currentMedia.label}</strong>}
            </div>
          </>
        )}
        {currentMedia && currentMedia.type === 'text' && (
          <div id="textFallback" style={{ fontSize: '24px', color: 'black' }}>
            {currentMedia.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionWindow;
