import React from 'react';
import { Container } from 'react-bootstrap';

function ContentSection({ title, text, textStyle, titleStyle }) {
  return (
    <Container style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '0.3rem' }}>
      <h1 style={titleStyle}>{title}</h1>
      <p style={textStyle}>{text}</p>
    </Container>
  );
}

export default ContentSection;
