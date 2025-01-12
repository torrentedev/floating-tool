# Propósito del Desarrollo

Este proyecto es un Portal de Ciencias diseñado para proporcionar información sobre diversos temas de ciencias naturales y sociales. Además, incorpora una funcionalidad de transcripción visual que ayuda a las personas con discapacidades auditivas a acceder a la información de manera más fácil y práctica. La transcripción visual utiliza imágenes y GIFs para representar palabras y frases, mejorando la accesibilidad de los contenidos.
 
## Instalación y Puesta en Marcha
 
Siga estos pasos para instalar y poner en marcha el proyecto:

### Prerrequisitos
Node.js (v14 o superior)
npm (v6 o superior)

### Pasos de Instalación
Clonar el Repositorio

```
git clone https://github.com/torrentedev/floating-tool.git
cd floating-tool
```

Instalar Dependencias

```
npm install
```

### Estructura de Carpetas

Asegúrate de tener la siguiente estructura de carpetas en tu proyecto:

public/ phrases/ evolucion.gif ... words/ evolucion.gif ... letters/ a.jpg b.jpg c.jpg ... numbers/ 0.jpg 1.jpg 2.jpg ... src/ components/ FloatingToolbar.js FloatingToolbar.css TranscriptionWindow.js CustomNavbar.js App.js App.css

```
public/
  phrases/
    evolucion.gif
    ...
  words/
    evolucion.gif
    ...
  letters/
    a.jpg
    b.jpg
    c.jpg
    ...
  numbers/
    0.jpg
    1.jpg
    2.jpg
    ...
src/
  components/
    FloatingToolbar.js
    FloatingToolbar.css
    TranscriptionWindow.js
    CustomNavbar.js
  App.js
  App.css
```

### Ejecutar la Aplicación

```
npm start
```

Esto iniciará el servidor de desarrollo y la aplicación estará disponible en http://localhost:3000.

### Funcionalidades Principales

Portal de Ciencias: Proporciona información sobre diversos temas de ciencias naturales y sociales.
Transcripción Visual: Utiliza imágenes y GIFs para representar palabras y frases, mejorando la accesibilidad.
Configuración Personalizable: Permite cambiar el tamaño de fuente, tipo de fuente, color de fuente y color de fondo.
Soporte Multilingüe: Cambia el idioma y la voz utilizada para la síntesis de texto a voz.

