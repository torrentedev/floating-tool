// src/components/HighlightedText.js
import React from 'react';

const HighlightedText = ({ text, highlightIndex, highlightLength }) => {
  if (highlightIndex === -1 || highlightLength === 0) return text;

  const start = text.slice(0, highlightIndex);
  const highlight = text.slice(highlightIndex, highlightIndex + highlightLength);
  const end = text.slice(highlightIndex + highlightLength);

  return (
    <>
      {start}
      {highlight && <span className="highlight">{highlight}</span>}
      {end}
    </>
  );
};

export default HighlightedText;
