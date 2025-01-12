import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import FloatingToolbar from './components/FloatingToolbar';
import TranscriptionWindow from './components/TranscriptionWindow';
import CustomNavbar from './components/CustomNavbar';
import { Container, Row, Col, Card } from 'react-bootstrap';

function App() {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [transcriptionWindowVisible, setTranscriptionWindowVisible] = useState(false);
  const [mediaQueue, setMediaQueue] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const mediaQueueRef = useRef([]);
  const isSpeaking = useRef(false);

  useEffect(() => {
    const populateVoiceList = () => {
      const voices = synthRef.current.getVoices();
      setVoices(voices);
      const languages = [...new Set(voices.map(voice => voice.lang))].sort();
      setLanguages(languages);
      if (languages.length > 0) {
        setSelectedLanguage(languages[0]);
      }
    };
    populateVoiceList();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = populateVoiceList;
    }
  }, []);

  useEffect(() => {
    mediaQueueRef.current = mediaQueue;
  }, [mediaQueue]);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
  };

  const handleColorChange = (color) => {
    setFontColor(color);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    const filteredVoices = voices.filter(voice => voice.lang === language);
    if (filteredVoices.length > 0) {
      setSelectedVoice(filteredVoices[0].name);
    }
  };

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName);
  };

  const handleMedia = async (word) => {
    const lowerCaseWord = word.toLowerCase().trim();
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif'];

    let foundMedia = false;

    const checkImageExists = (src, label, duration) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve({ src, label, duration });
        img.onerror = () => reject(src);
      });
    };

    const searchForMedia = async () => {
      try {
        for (let format of imageFormats) {
          const phraseSrc = `/phrases/${lowerCaseWord}.${format}`;
          const wordSrc = `/words/${lowerCaseWord}.${format}`;

          try {
            const phrase = await checkImageExists(phraseSrc, lowerCaseWord, 2500);
            setMediaQueue(prevQueue => [...prevQueue, { type: 'phrase', src: phrase.src, duration: phrase.duration, label: phrase.label }]);
            foundMedia = true;
            console.log(`Found phrase image: ${phraseSrc}`);
            break;
          } catch (e) {
            console.log(`Phrase image not found: ${phraseSrc}`);
          }

          try {
            const word = await checkImageExists(wordSrc, lowerCaseWord, 2500);
            setMediaQueue(prevQueue => [...prevQueue, { type: 'word', src: word.src, duration: word.duration, label: word.label }]);
            foundMedia = true;
            console.log(`Found word image: ${wordSrc}`);
            break;
          } catch (e) {
            console.log(`Word image not found: ${wordSrc}`);
          }
        }

        if (!foundMedia) {
          const alphabet = 'abcdefghijklmnopqrstuvwxyz';
          const numbers = '0123456789';
          const letters = lowerCaseWord.split('').filter(char => alphabet.includes(char) || numbers.includes(char));

          for (let char of letters) {
            let basePath = alphabet.includes(char) ? '/letters/' : '/numbers/';
            for (let format of imageFormats) {
              const imgSrc = `${basePath}${char}.${format}`;
              try {
                const image = await checkImageExists(imgSrc, char, 1000);
                setMediaQueue(prevQueue => [...prevQueue, { type: 'alphabet', src: image.src, duration: image.duration, label: image.label }]);
                foundMedia = true;
                console.log(`Found image: ${imgSrc}`);
                break;
              } catch (e) {
                console.log(`Image not found: ${imgSrc}`);
              }
            }
          }
        }

        if (!foundMedia) {
          setMediaQueue(prevQueue => [...prevQueue, { type: 'text', src: '', duration: 1000, label: 'Sin imagen para transcripción' }]);
          console.log('No image found for transcription');
        }
      } catch (error) {
        console.error('Error searching for media:', error);
      }
    };

    await searchForMedia();
  };

  const handleSpeakText = () => {
    handleStopText(); // Stop any ongoing speech before starting new one
    isSpeaking.current = true;
    const textContent = document.querySelector('.content').innerText;
    const utterance = new SpeechSynthesisUtterance(textContent);
    const selectedVoiceObj = voices.find(voice => voice.name === selectedVoice);
    utterance.voice = selectedVoiceObj;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const currentWord = textContent.substring(charIndex, textContent.indexOf(' ', charIndex + 1));
        handleMedia(currentWord);
      }
    };

    utterance.onend = () => {
      isSpeaking.current = false;
      setCurrentMedia(null);
    };

    utterance.onerror = (event) => {
      isSpeaking.current = false;
      console.error('SpeechSynthesisUtterance.onerror', event);
    };

    synthRef.current.speak(utterance);
    utteranceRef.current = utterance;
    handleProcessMediaQueue();
  };

  const handlePauseText = () => {
    if (synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
    }
  };

  const handleResumeText = () => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
  };

  const handleStopText = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    isSpeaking.current = false;
    setCurrentMedia(null);
    setMediaQueue([]);
  };

  const handleProcessMediaQueue = () => {
    if (mediaQueueRef.current.length > 0) {
      const media = mediaQueueRef.current.shift();
      setCurrentMedia(media);

      const duration = media.duration || 1000;
      setTimeout(handleProcessMediaQueue, duration);
    } else {
      setCurrentMedia(null);
    }
  };

  const handleOpenTranscriptionWindow = () => {
    setTranscriptionWindowVisible(true);
    if (isSpeaking.current) {
      handleProcessMediaQueue();
    }
  };

  const handleCloseTranscriptionWindow = () => {
    setTranscriptionWindowVisible(false);
  };

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color: fontColor,
  };

  const titleStyle = {
    ...textStyle,
    fontSize: `${fontSize + 4}px`,  // Ajustamos el tamaño del título para que sea un poco más grande que el texto
  };

  const containerStyle = {
    backgroundColor: backgroundColor,
    minHeight: '100vh',
    padding: '20px',
  };

  return (
    <div className="App" style={{ backgroundColor: backgroundColor }}>
      <FloatingToolbar
        onFontSizeChange={handleFontSizeChange}
        onFontChange={handleFontChange}
        onColorChange={handleColorChange}
        onBackgroundColorChange={handleBackgroundColorChange}
        onSpeakText={handleSpeakText}
        onPauseText={handlePauseText}
        onResumeText={handleResumeText}
        onStopText={handleStopText}
        onVoiceChange={handleVoiceChange}
        onLanguageChange={handleLanguageChange}
        onOpenTranscriptionWindow={handleOpenTranscriptionWindow}
        languages={languages}
        voices={voices.filter(voice => voice.lang === selectedLanguage)}
      />
      <CustomNavbar />

      <Container fluid className="content" style={containerStyle}>
        <Container style={{ backgroundColor: backgroundColor, color: fontColor, padding: '2rem', marginBottom: '2rem', borderRadius: '0.3rem' }}>
          <h1 style={titleStyle}>Bienvenido al Portal de Ciencias</h1>
          <p style={textStyle}>Mantente informado con los últimos avances en Ciencias Naturales y Sociales.</p>
        </Container>

        <h2 style={titleStyle}>Ciencias Naturales</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Fotosíntesis</Card.Title>
                <Card.Text style={textStyle}>
                  La fotosíntesis es un proceso mediante el cual las plantas, las algas y algunas bacterias convierten la luz solar en energía química almacenada en moléculas de glucosa. Este proceso es fundamental para la vida en la Tierra, ya que produce oxígeno como subproducto, el cual es esencial para la respiración de la mayoría de los organismos vivos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Evolución</Card.Title>
                <Card.Text style={textStyle}>
                  La teoría de la evolución, propuesta por Charles Darwin, explica cómo las especies cambian con el tiempo a través de la selección natural. Los organismos mejor adaptados a su entorno tienen más probabilidades de sobrevivir y reproducirse, pasando sus características favorables a la siguiente generación.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Ciclo del Agua</Card.Title>
                <Card.Text style={textStyle}>
                  El ciclo del agua describe el movimiento continuo del agua dentro y sobre la superficie de la Tierra. Este ciclo incluye procesos como la evaporación, la condensación, la precipitación y la infiltración. Es esencial para la distribución del agua en el planeta y para mantener la vida.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h2 style={titleStyle}>Ciencias Sociales</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Revolución Industrial</Card.Title>
                <Card.Text style={textStyle}>
                  La Revolución Industrial fue un período de grandes cambios en la producción y la tecnología que comenzó en el siglo XVIII. Marcó la transición de economías agrarias y manuales a economías industriales y mecanizadas, transformando la sociedad y la economía global.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Globalización</Card.Title>
                <Card.Text style={textStyle}>
                  La globalización es el proceso de integración económica, política y cultural a nivel mundial. Ha facilitado el intercambio de bienes, servicios, información y personas, pero también ha planteado desafíos como la desigualdad económica y la pérdida de identidad cultural.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ backgroundColor: backgroundColor }}>
              <Card.Body>
                <Card.Title style={titleStyle}>Democracia</Card.Title>
                <Card.Text style={textStyle}>
                  La democracia es un sistema de gobierno en el que el poder reside en el pueblo, que lo ejerce directamente o a través de representantes electos. Es fundamental para garantizar la participación ciudadana, la igualdad de derechos y la rendición de cuentas de los gobernantes.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <TranscriptionWindow
        visible={transcriptionWindowVisible}
        currentMedia={currentMedia}
        onClose={handleCloseTranscriptionWindow}
      />
    </div>
  );
}

export default App;
