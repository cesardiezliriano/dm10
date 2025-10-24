# InsightsBuilder V2

Genera insights y presentaciones basadas en datos con IA. Esta potente herramienta utiliza la API de Google Gemini para transformar datos complejos de marketing, ventas u operaciones en análisis textuales claros y accionables, y en presentaciones de PowerPoint profesionales.

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20API-blue.svg)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## Introducción

InsightsBuilder V2 está diseñado para analistas, marketers y consultores que necesitan entender rápidamente datos de rendimiento y comunicar sus hallazgos de manera efectiva. Elimina horas de trabajo manual en la creación de informes al automatizar todo el proceso, desde la ingesta de datos hasta la presentación final.

La aplicación opera en dos modos principales:
1.  **Análisis de Datos Agregados**: Para un análisis profundo de datos complejos y de múltiples fuentes. Los usuarios pueden pegar datos, subir archivos de Excel, conectarse a APIs (prototipo) y subir creatividades de anuncios para un análisis visual. El resultado es un informe completo y una presentación de PowerPoint personalizable.
2.  **Resumen Rápido de Campaña**: Para una visión general rápida y de alto nivel del rendimiento de una única campaña. Los usuarios introducen métricas básicas (impresiones, clics, conversiones, coste) para recibir un resumen conciso y bien estructurado.

## Características Principales

-   **Análisis Potenciado por IA**: Utiliza el modelo `gemini-2.5-flash` de Google para interpretar datos, identificar tendencias, proporcionar explicaciones causales y ofrecer recomendaciones accionables.
-   **Generación Automatizada de Presentaciones**: Transforma los insights generados en un archivo `.pptx` descargable con un solo clic, utilizando la potente librería `pptxgenjs`.
-   **Estilos de Marca para Presentaciones**: Soporta múltiples plantillas de presentación, permitiendo una identidad de marca consistente:
    -   LLYC Default
    -   IFEMA MADRID (Estilo General)
    -   Plantilla Informe Motortec (Un informe específico de IFEMA con múltiples diapositivas)
-   **Análisis Visual de Creatividades**: Sube creatividades de anuncios (imágenes) para recibir feedback visual de la IA sobre su composición, mensaje y eficacia potencial.
-   **Entrada de Datos Flexible**:
    -   Pega datos manualmente desde cualquier fuente.
    -   Sube archivos `.xls` o `.xlsx`.
    -   Conéctate directamente a APIs como Google Ads, GA4 y Meta Ads (flujo OAuth2 implementado).
-   **Insights Contextuales**: Mejora el análisis proporcionando contexto opcional como el nombre del cliente, sector industrial, condiciones del mercado y preguntas específicas para guiar a la IA.
-   **Soporte Multilingüe**: La interfaz de usuario y las respuestas generadas por la IA están disponibles en **Inglés** y **Español**.

## Cómo Funciona

La aplicación sigue un sofisticado proceso de múltiples pasos para ofrecer resultados de alta calidad:

1.  **Entrada de Datos y Contexto**: El usuario proporciona los datos, selecciona un idioma y elige un estilo de marca para la presentación. Para el Análisis Agregado, también puede subir imágenes de creatividades y añadir detalles contextuales.
2.  **Primera Llamada a la API de Gemini (Generación del Insight)**:
    -   La aplicación construye un prompt detallado para la API de Gemini. Este prompt incluye:
        -   Una **Instrucción de Sistema** que define la personalidad de la IA (por ejemplo, un consultor de negocio experto).
        -   Los datos, el contexto y cualquier imagen subida por el usuario (como datos en base64).
        -   Instrucciones específicas para el análisis visual de las creatividades.
    -   Gemini procesa esta petición multimodal y devuelve un insight textual completo en formato Markdown.
3.  **Visualización del Insight**: La aplicación renderiza la respuesta en Markdown en un formato limpio y legible para que el usuario la revise.
4.  **Segunda Llamada a la API de Gemini (Estructuración para la Presentación)**:
    -   Cuando el usuario hace clic en "Generar Presentación", se envía un segundo prompt a Gemini.
    -   Este prompt incluye los datos originales y el *primer insight generado por la IA*, instruyendo al modelo para que reestructure toda esta información en un **formato JSON estricto** que se corresponda con el estilo de marca de la presentación seleccionada (por ejemplo, LLYC, Motortec).
    -   Se utiliza el parámetro `responseMimeType: "application/json"` para asegurar una salida JSON válida.
5.  **Generación de la Presentación**:
    -   El frontend procesa la respuesta JSON estructurada.
    -   Usando `pptxgenjs`, la aplicación construye la presentación de PowerPoint diapositiva por diapositiva, poblando títulos, textos, KPIs, imágenes y gráficos según los datos del JSON y el estilo de marca.
6.  **Descarga**: El archivo `.pptx` final se descarga automáticamente en el navegador del usuario.

## Stack Tecnológico

-   **Frontend**: React 18, TypeScript, Tailwind CSS
-   **Modelo de IA**: Google Gemini (librería `@google/genai`)
-   **Generación de Presentaciones**: `pptxgenjs`
-   **Manejo de Datos**: `xlsx` (para archivos Excel), `marked` (para renderizar Markdown)
-   **Autenticación**: Google Identity Services para OAuth2 con las APIs de Google.
-   **Proceso de Build**: Este proyecto está configurado para un despliegue **sin paso de compilación (zero build-step)**. Utiliza `ES Module Shims` y `@babel/standalone` para transpilar JSX/TS directamente en el navegador, lo que facilita enormemente su despliegue en cualquier servicio de hosting estático.

## Configuración y Ejecución

### Prerrequisitos

-   Un navegador web moderno (Chrome, Firefox, Edge).
-   Una clave de API de Google Gemini. Puedes obtener una en [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Configuración de la Clave de API (Requerido)

Esta aplicación requiere una clave de API de Google Gemini para funcionar. La clave **debe** proporcionarse como una variable de entorno.

-   **Para Hosting (Vercel, Netlify, etc.)**:
    En la configuración de tu proyecto en tu proveedor de hosting, ve a la sección "Environment Variables" y añade una nueva variable:
    -   **Nombre**: `API_KEY`
    -   **Valor**: `Tu-Clave-De-API-De-Gemini-Aquí`

-   **Para Desarrollo Local**:
    El código lee la variable de `process.env.API_KEY`. Dado que es una aplicación del lado del cliente, necesitas un servidor simple que pueda hacer que esta variable esté disponible. Un enfoque común es usar una herramienta como `vite` que maneja archivos `.env` automáticamente. Como alternativa, para un inicio rápido, puedes añadirla temporalmente en `services/geminiService.ts` (NO recomendado para producción).

### 2. Configuración de APIs de Google y Meta (Opcional)

Para habilitar los conectores de API directos para Google Ads, GA4 y Meta Ads, debes configurar sus respectivos IDs de cliente/app en `constants.ts`:

-   `GOOGLE_CLIENT_ID`: Obtén esto desde la [Google Cloud Console](https://console.cloud.google.com/).
    -   Crea un nuevo proyecto.
    -   Ve a "APIs y Servicios" > "Credenciales".
    -   Crea un "ID de cliente de OAuth 2.0" de tipo "Aplicación web".
    -   **Crucialmente**, añade la URL de tu aplicación (ej., `http://localhost:3000`, `https://tu-app.vercel.app`) a los "Orígenes de JavaScript autorizados".
-   `META_APP_ID`: Obtén esto desde [Meta for Developers](https://developers.facebook.com/).
    -   Crea una nueva App.
    -   Añade el producto "Inicio de sesión con Facebook".
    -   Ten en cuenta que el SDK de Meta requiere que la aplicación se sirva a través de **HTTPS** para funcionar correctamente.

### 3. Ejecución en Local

Como este proyecto no tiene un paso de compilación, puedes ejecutarlo con cualquier servidor de archivos estáticos simple.

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/your-username/insights-builder.git
    cd insights-builder
    ```
2.  **Sirve los archivos:**
    -   **Usando VS Code**: Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), haz clic derecho en `index.html` y selecciona "Open with Live Server".
    -   **Usando Python**:
        ```bash
        python -m http.server
        ```
    -   **Usando Node.js**:
        ```bash
        npx serve
        ```
3.  Abre tu navegador en la dirección local proporcionada (ej., `http://localhost:8000`).

## Estructura del Proyecto

```
/
├── index.html              # Punto de entrada HTML, carga los scripts
├── index.tsx               # Raíz de la aplicación React
├── App.tsx                 # Componente principal de la app, gestión de estado
├── README.md               # README en inglés
├── README.es.md            # Este archivo
├── metadata.json           # Metadatos de la aplicación
├── constants.ts            # Textos de UI, prompts, scopes de API, opciones
├── types.ts                # Todas las interfaces y definiciones de TypeScript
│
├── components/             # Componentes de React reutilizables
│   ├── ApiConnector.tsx
│   ├── DataInputForm.tsx
│   ├── ErrorMessage.tsx
│   ├── FeedbackButton.tsx
│   ├── HelpBotButton.tsx
│   ├── HelpBotModal.tsx
│   ├── InsightDisplay.tsx
│   ├── LoadingSpinner.tsx
│   └── StructuredDataInputForm.tsx
│
└── services/               # Lógica para servicios externos
    ├── geminiService.ts    # Maneja todas las llamadas a la API de Gemini
    ├── googleApiService.ts # Obtiene datos de las APIs de Google Ads y GA4
    ├── googleAuthService.ts# Gestiona el flujo OAuth2 de Google
    ├── metaApiService.ts   # Gestiona el login y las llamadas a la API de Meta
    └── presentationService.ts # Construye el archivo PPTX usando pptxgenjs
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Agradecimientos

-   Esta herramienta fue desarrollada como parte de una iniciativa de innovación en [LLYC](https://www.llyc.global/).
-   Potenciada por las increíbles capacidades de la API de Google Gemini.
