import { DataSource, StructuredCampaignPlatform, TimePeriod, Language, SlideType, KpiItem, PresentationData, SlideContent, KpiHighlightSection, BrandStyle, MotortecReportContent, HelpTopic, UIStringKeys, CampaignMetrics } from './types.ts';

// --- Critical App Configuration ---
// This must be replaced with the actual Google Client ID from Google Cloud Console.
export const GOOGLE_CLIENT_ID: string = "1076786873783-mj9gt2kkcjudp7i3ldln19el67sf6ulr.apps.googleusercontent.com";
export const META_APP_ID: string = "2019316998286043";

// Scopes required for Google APIs
export const GOOGLE_ADS_SCOPES = 'https://www.googleapis.com/auth/adwords';
export const GA4_SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';


// --- UI Text Localization ---
const UI_STRINGS: Record<UIStringKeys, Record<Language, string> | Partial<Record<Language, string>>> = {
  APP_TITLE: {
    [Language.EN]: "Automated Data Insights Generator",
    [Language.ES]: "Generador Automatizado de Insights"
  },
  APP_SUBTITLE: {
    [Language.EN]: "Leverage AI for comprehensive data analysis or quick campaign summaries. AI response in selected language.",
    [Language.ES]: "Utiliza IA para análisis de datos detallados o resúmenes rápidos de campañas. Respuesta de la IA en el idioma seleccionado."
  },
  API_KEY_MISSING_BANNER_TITLE: {
    [Language.EN]: "Critical Configuration Needed",
    [Language.ES]: "Configuración Crítica Necesaria"
  },
  API_KEY_MISSING_BANNER_MESSAGE: {
    [Language.EN]: "The Gemini API Key is not configured in the application's environment. This key is essential for the application to function and generate insights. Please ensure the API_KEY environment variable is correctly set.",
    [Language.ES]: "La API Key de Gemini no está configurada en el entorno de la aplicación. Esta clave es esencial para que la aplicación funcione y genere insights. Por favor, asegúrate de que la variable de entorno API_KEY esté configurada correctamente."
  },
  TAB_AGGREGATED: {
    [Language.EN]: "Aggregated Data Analysis",
    [Language.ES]: "Análisis de Datos Agregados"
  },
  TAB_STRUCTURED: {
    [Language.EN]: "Quick Campaign Summary",
    [Language.ES]: "Resumen Rápido de Campaña"
  },
  SECTION_TITLE_GENERATED_INSIGHTS: {
    [Language.EN]: "Generated Insights",
    [Language.ES]: "Insights Generados"
  },
  SECTION_TITLE_CAMPAIGN_SUMMARY: {
    [Language.EN]: "Campaign Summary",
    [Language.ES]: "Resumen de Campaña"
  },
  PLACEHOLDER_AGGREGATED_RESULTS: {
    [Language.EN]: "Your generated insights from aggregated data will appear here. Fill the form and click 'Generate Insights'.",
    [Language.ES]: "Tus insights generados a partir de datos agregados aparecerán aquí. Completa el formulario y haz clic en 'Generar Insights'."
  },
  PLACEHOLDER_STRUCTURED_RESULTS: {
    [Language.EN]: "Your campaign summary will appear here. Fill the form and click 'Generate Campaign Summary'.",
    [Language.ES]: "El resumen de tu campaña aparecerá aquí. Completa el formulario y haz clic en 'Generar Resumen de Campaña'."
  },
  NO_SPECIFIC_INSIGHTS_GENERATED: {
    [Language.EN]: "The AI did not generate any specific insights for the provided data. You might want to refine your input, add more context, or check if the data is sufficient for analysis.",
    [Language.ES]: "La IA no generó insights específicos para los datos proporcionados. Puede que quieras refinar tu entrada, añadir más contexto o verificar si los datos son suficientes para el análisis."
  },
  FOOTER_TEXT: {
    [Language.EN]: "AI Powered Insights. LLYC ANTICÍPATE.",
    [Language.ES]: "Insights Potenciados por IA. LLYC ANTICÍPATE."
  },
  // DataInputForm
  TIPS_TITLE: {
    [Language.EN]: "Tips: How to Provide Data for Optimal Insights",
    [Language.ES]: "Consejos: Cómo Proveer Datos para Insights Óptimos"
  },
  TIPS_INTRO: {
    [Language.EN]: "To get the best insights, structure your data clearly and provide relevant context.",
    [Language.ES]: "Para obtener los mejores insights, estructura tus datos claramente y proporciona contexto relevante."
  },
  TIPS_CONTEXT_TITLE: {
    [Language.EN]: "1. Contextual Information:",
    [Language.ES]: "1. Información Contextual:"
  },
  TIPS_CONTEXT_CLIENT: {
    [Language.EN]: "Client Name: Specify the client for whom the analysis is being done.",
    [Language.ES]: "Nombre del Cliente: Especifica el cliente para quien se realiza el análisis."
  },
  TIPS_CONTEXT_SECTOR: {
    [Language.EN]: "Sector/Industry: Define the client's primary industry (e.g., \"Retail E-commerce\", \"B2B SaaS\").",
    [Language.ES]: "Sector/Industria: Define la industria principal del cliente (ej: \"E-commerce Minorista\", \"SaaS B2B\")."
  },
  TIPS_CONTEXT_MARKET: {
    [Language.EN]: "Campaign Market: Indicate the geographical market(s) of the campaigns (e.g., \"USA & Canada\", \"Global\").",
    [Language.ES]: "Mercado de Campaña: Indica el(los) mercado(s) geográfico(s) de las campañas (ej: \"EE.UU. y Canadá\", \"Global\")."
  },
  TIPS_STRUCTURE_TITLE: {
    [Language.EN]: "2. General Data Structure (Pasted or Excel):",
    [Language.ES]: "2. Estructura General de Datos (Pegados o Excel):"
  },
  TIPS_STRUCTURE_HEADINGS: {
    [Language.EN]: "Clear Headings: Use distinct headings for different data sources and time periods. E.g.,",
    [Language.ES]: "Encabezados Claros: Usa encabezados distintos para diferentes fuentes de datos y periodos de tiempo. Ej:"
  },
  TIPS_STRUCTURE_TIME: {
    [Language.EN]: "Time Periods: Always specify the time frame for each dataset. For comparisons, show both periods clearly.",
    [Language.ES]: "Periodos de Tiempo: Siempre especifica el marco temporal para cada conjunto de datos. Para comparaciones, muestra ambos periodos claramente."
  },
  TIPS_STRUCTURE_KPIS: {
    [Language.EN]: "Key Metrics: Include essential KPIs relevant to the platform and goals.",
    [Language.ES]: "Métricas Clave: Incluye KPIs esenciales relevantes para la plataforma y los objetivos."
  },
  TIPS_STRUCTURE_COMPARATIVE: {
    [Language.EN]: "Comparative Data: For trend analysis, provide data for current and previous periods. E.g.,",
    [Language.ES]: "Datos Comparativos: Para análisis de tendencias, proporciona datos para periodos actuales y anteriores. Ej:"
  },
  TIPS_STRUCTURE_CONVERSIONS: {
    [Language.EN]: "Define Conversions: Be specific (e.g., \"Leads from Contact Form,\" \"Product Sales\").",
    [Language.ES]: "Define Conversiones: Sé específico (ej: \"Leads de Formulario de Contacto,\" \"Ventas de Producto\")."
  },
  TIPS_STRUCTURE_SUMMARIZE: {
    [Language.EN]: "Summarize: Provide summarized data. Avoid pasting extremely raw, row-level data.",
    [Language.ES]: "Resume: Proporciona datos resumidos. Evita pegar datos extremadamente brutos a nivel de fila."
  },
  TIPS_EXCEL_TITLE: {
    [Language.EN]: "3. Using Excel Files (.xls, .xlsx):",
    [Language.ES]: "3. Usando Archivos Excel (.xls, .xlsx):"
  },
  TIPS_EXCEL_UPLOAD: {
    [Language.EN]: "Upload: Content from the first sheet will be extracted.",
    [Language.ES]: "Subir Archivo: Se extraerá el contenido de la primera hoja."
  },
  TIPS_EXCEL_STRUCTURE: {
    [Language.EN]: "Structure: Organize data in a simple tabular format on the first sheet with clear headers.",
    [Language.ES]: "Estructura: Organiza los datos en un formato tabular simple en la primera hoja con encabezados claros."
  },
  TIPS_EXCEL_SIZE: {
    [Language.EN]: "File Size: Max ~2MB recommended.",
    [Language.ES]: "Tamaño del Archivo: Máximo ~2MB recomendado."
  },
  TIPS_EXCEL_LIMITS: {
    [Language.EN]: "Limitations: Only cell values are extracted. Charts, images, etc., are ignored.",
    [Language.ES]: "Limitaciones: Solo se extraen los valores de las celdas. Gráficos, imágenes, etc., se ignoran."
  },
  TIPS_PDF_TITLE: {
    [Language.EN]: "4. Handling PDF Documents:",
    [Language.ES]: "4. Manejo de Documentos PDF:"
  },
  TIPS_PDF_NO_UPLOAD: {
    [Language.EN]: "Direct PDF upload is not currently supported.",
    [Language.ES]: "La subida directa de PDF no está soportada actualmente."
  },
  TIPS_PDF_RECOMMENDATION: {
    [Language.EN]: "Recommendation: Manually copy relevant text/tables from PDFs and paste into the data area.",
    [Language.ES]: "Recomendación: Copia manualmente texto/tablas relevantes de PDFs y pégalos en el área de datos."
  },
  TIPS_ADDITIONAL_CONTEXT_TITLE: {
    [Language.EN]: "5. Additional Context & Questions:",
    [Language.ES]: "5. Contexto Adicional y Preguntas:"
  },
  TIPS_ADDITIONAL_CONTEXT_USE: {
    [Language.EN]: "Additional Context/Trends: Use this field for dynamic info like competitor actions, market trends, or specific events.",
    [Language.ES]: "Contexto Adicional/Tendencias: Usa este campo para información dinámica como acciones de competidores, tendencias de mercado o eventos específicos."
  },
  TIPS_ADDITIONAL_QUESTIONS_USE: {
    [Language.EN]: "Specific Questions: Guide the AI towards particular areas of interest.",
    [Language.ES]: "Preguntas Específicas: Guía a la IA hacia áreas particulares de interés."
  },
  LABEL_CLIENT_NAME: { [Language.EN]: "Client Name (Optional)", [Language.ES]: "Nombre del Cliente (Opcional)" },
  LABEL_SECTOR: { [Language.EN]: "Sector/Industry (Optional)", [Language.ES]: "Sector/Industria (Opcional)" },
  LABEL_MARKET: { [Language.EN]: "Campaign Market (Optional)", [Language.ES]: "Mercado de Campaña (Opcional)" },
  LABEL_DATA_SOURCES: { [Language.EN]: "Indicate Data Sources (select all relevant)", [Language.ES]: "Indica Fuentes de Datos (selecciona todas las relevantes)" },
  LABEL_UPLOAD_EXCEL: { [Language.EN]: "Upload Excel File (Optional, .xls, .xlsx)", [Language.ES]: "Subir Archivo Excel (Opcional, .xls, .xlsx)" },
  LABEL_UPLOAD_CREATIVES_TITLE: { [Language.EN]: "Upload Creatives (Optional, for Visual Analysis - Max 5)", [Language.ES]: "Subir Creatividades (Opcional, para Análisis Visual - Máx 5)" },
  LABEL_UPLOAD_CREATIVES_BUTTON: { [Language.EN]: "Select Images...", [Language.ES]: "Seleccionar Imágenes..." },
  NOTE_AI_CREATIVE_ANALYSIS_LIMITATION: {
    [Language.EN]: "Note: AI creative analysis is based on the visual content of the uploaded images, provided context, and general best practices. The AI will process the image data.",
    [Language.ES]: "Nota: El análisis de creatividades por IA se basa en el contenido visual de las imágenes subidas, el contexto proporcionado y las mejores prácticas generales. La IA procesará los datos de la imagen."
  },
  LABEL_UPLOADED_CREATIVES: { [Language.EN]: "Uploaded Creatives:", [Language.ES]: "Creatividades Subidas:" },
  LABEL_NO_CREATIVES_UPLOADED: { [Language.EN]: "No creatives uploaded yet.", [Language.ES]: "Aún no se han subido creatividades." },
  BUTTON_REMOVE_CREATIVE: { [Language.EN]: "Remove", [Language.ES]: "Quitar" },
  FILE_TYPE_INVALID: { [Language.EN]: "Invalid file type. Please upload images (PNG, JPG, GIF).", [Language.ES]: "Tipo de archivo no válido. Sube imágenes (PNG, JPG, GIF)." },
  MAX_CREATIVES_REACHED: { [Language.EN]: "Maximum number of creatives (%s) reached.", [Language.ES]: "Se alcanzó el número máximo de creatividades (%s)." },
  LABEL_PASTE_DATA: { [Language.EN]: "Paste Aggregated Data (or add from Excel)", [Language.ES]: "Pegar Datos Agregados (o añadir desde Excel)" },
  LABEL_ADDITIONAL_CONTEXT: { [Language.EN]: "Additional Context/Trends (Optional)", [Language.ES]: "Contexto Adicional/Tendencias (Opcional)" },
  LABEL_SPECIFIC_QUESTIONS: { [Language.EN]: "Specific Questions or Focus Areas (Optional)", [Language.ES]: "Preguntas Específicas o Áreas de Enfoque (Opcional)" },
  LABEL_BRAND_STYLE: { [Language.EN]: "Presentation Brand Style", [Language.ES]: "Estilo de Marca para Presentación" },
  BUTTON_GENERATE_INSIGHTS: { [Language.EN]: "Generate Insights", [Language.ES]: "Generar Insights" },
  BUTTON_GENERATING: { [Language.EN]: "Generating...", [Language.ES]: "Generando..." },
  FILE_PROCESSING_MESSAGE: { [Language.EN]: "Processing", [Language.ES]: "Procesando" },
  FILE_SIZE_WARNING_MESSAGE: { [Language.EN]: "Warning: File", [Language.ES]: "Advertencia: Archivo" },
  FILE_SIZE_WARNING_DETAIL: { [Language.EN]: "is larger than 2MB. Processing might be slow.", [Language.ES]: "es mayor de 2MB. El procesamiento podría ser lento." },
  FILE_SUCCESS_MESSAGE: { [Language.EN]: "Success: Content from", [Language.ES]: "Éxito: Contenido de" },
  FILE_SUCCESS_DETAIL: { [Language.EN]: "(first sheet) has been added as a new data block below.", [Language.ES]: "(primera hoja) ha sido añadido como un nuevo bloque de datos abajo." },
  FILE_ERROR_PROCESS_MESSAGE: { [Language.EN]: "Error processing file '%s'.", [Language.ES]: "Error al procesar el archivo '%s'." }, 
  FILE_ERROR_PROCESS_DETAIL: { [Language.EN]: "Ensure it's a valid Excel file.", [Language.ES]: "Asegúrate de que es un archivo Excel válido." },
  FILE_ERROR_READ_MESSAGE: { [Language.EN]: "Error: Could not read file", [Language.ES]: "Error: No se pudo leer el archivo" },
  ALERT_NO_DATA_SOURCES: { [Language.EN]: "Please select at least one data source.", [Language.ES]: "Por favor, selecciona al menos una fuente de datos." },
  ALERT_NO_DATA: { [Language.EN]: "Please add at least one data block with KPIs or connect to an API data source.", [Language.ES]: "Por favor, añade al menos un bloque de datos con KPIs o conecta una fuente de datos API." },
  DATA_INPUT_FOOTER: { [Language.EN]: "If providing data from multiple sources, please clearly label or delineate each section. Content from uploaded Excel files will be appended here.", [Language.ES]: "Si proporcionas datos de múltiples fuentes, por favor etiqueta o delimita claramente cada sección. El contenido de los archivos Excel subidos se añadirá aquí." },
  SECTION_TITLE_DATA_INPUT: { [Language.EN]: "Manual Data Input", [Language.ES]: "Entrada de Datos Manual" },
  BUTTON_ADD_DATA_BLOCK: { [Language.EN]: "Add Data Block", [Language.ES]: "Añadir Bloque de Datos" },
  BUTTON_REMOVE_DATA_BLOCK: { [Language.EN]: "Remove Block", [Language.ES]: "Eliminar Bloque" },
  LABEL_DATA_BLOCK_SOURCE: { [Language.EN]: "Data Source", [Language.ES]: "Fuente de Datos" },
  LABEL_DATA_BLOCK_TIME_PERIOD: { [Language.EN]: "Time Period", [Language.ES]: "Periodo de Tiempo" },
  LABEL_DATA_BLOCK_KPIS: { [Language.EN]: "Key Metrics & KPIs", [Language.ES]: "Métricas Clave y KPIs" },
  SECTION_TITLE_API_CONNECTORS: { [Language.EN]: "Direct Connections (API)", [Language.ES]: "Conexiones Directas (API)" },
  API_CONNECTORS_SUBTITLE: {
    [Language.EN]: "Connect directly to platforms for automated data retrieval.",
    [Language.ES]: "Conecta directamente a las plataformas para obtener datos de forma automática."
  },
  BUTTON_CONNECT: { [Language.EN]: "Connect", [Language.ES]: "Conectar" },
  BUTTON_DISCONNECT: { [Language.EN]: "Disconnect", [Language.ES]: "Desconectar" },
  PROMPT_API_DATA_PLACEHOLDER: {
    [Language.EN]: "PROTOTYPE: In a real scenario, you would be redirected to %s to authenticate. For now, please paste the JSON response from the API here.",
    [Language.ES]: "PROTOTIPO: En un escenario real, serías redirigido a %s para autenticarte. Por ahora, por favor, pega la respuesta JSON de la API aquí."
  },
  ERROR_INVALID_JSON: {
    [Language.EN]: "The provided text is not valid JSON. Please check the format and try again.",
    [Language.ES]: "El texto proporcionado no es un JSON válido. Por favor, revisa el formato e inténtalo de nuevo."
  },
  STATUS_CONNECTED: { [Language.EN]: "Connected", [Language.ES]: "Conectado" },
  STATUS_CONNECTING: { [Language.EN]: "Connecting...", [Language.ES]: "Conectando..." },
  STATUS_DISCONNECTED: { [Language.EN]: "Disconnected", [Language.ES]: "Desconectar" },
  API_DATA_SUMMARY_HEADER: { [Language.EN]: "Connected Data Summary", [Language.ES]: "Resumen de Datos Conectados" },
  LABEL_GOOGLE_CLIENT_ID_CONFIG_WARNING: {
    [Language.EN]: "Google connections are disabled. The Google Client ID has not been configured by the application developer.",
    [Language.ES]: "Las conexiones de Google están deshabilitadas. El Google Client ID no ha sido configurado por el desarrollador de la aplicación."
  },
  LABEL_META_APP_ID_CONFIG_WARNING: {
    [Language.EN]: "Meta connection is disabled. The Meta App ID has not been configured by the application developer.",
    [Language.ES]: "La conexión de Meta está deshabilitada. El App ID de Meta no ha sido configurado por el desarrollador de la aplicación."
  },
  PROMPT_GOOGLE_ADS_CUSTOMER_ID: {
    [Language.EN]: "Authentication successful! Please enter your Google Ads Customer ID (e.g., 123-456-7890) to fetch data.",
    [Language.ES]: "¡Autenticación exitosa! Por favor, introduce tu ID de Cliente de Google Ads (ej., 123-456-7890) para obtener los datos."
  },
  PROMPT_GA4_PROPERTY_ID: {
    [Language.EN]: "Authentication successful! Please enter your Google Analytics 4 Property ID (e.g., 123456789) to fetch data.",
    [Language.ES]: "¡Autenticación exitosa! Por favor, introduce tu ID de Propiedad de Google Analytics 4 (ej., 123456789) para obtener los datos."
  },
  ERROR_GOOGLE_AUTH: {
    [Language.EN]: "Google Authentication Error: %s",
    [Language.ES]: "Error de Autenticación de Google: %s"
  },
  ERROR_GOOGLE_AUTH_PERMISSION_DENIED: {
    [Language.EN]: "Permission was denied. Access is required to connect to this service.",
    [Language.ES]: "Se denegó el permiso. Se requiere acceso para conectarse a este servicio."
  },
  ERROR_GOOGLE_API: {
    [Language.EN]: "Google API Error: Failed to fetch data from %s. Details: %s",
    [Language.ES]: "Error de API de Google: Fallo al obtener datos de %s. Detalles: %s"
  },
  ERROR_META_AUTH: {
    [Language.EN]: "Meta Authentication Error: %s",
    [Language.ES]: "Error de Autenticación de Meta: %s"
  },
  ERROR_META_API: {
    [Language.EN]: "Meta API Error: Failed to fetch data from %s. Details: %s",
    [Language.ES]: "Error de API de Meta: Fallo al obtener datos de %s. Detalles: %s"
  },
  ERROR_META_HTTPS_REQUIRED: {
    [Language.EN]: "Meta connection requires a secure (HTTPS) connection. This page is currently served over HTTP.",
    [Language.ES]: "La conexión con Meta requiere una conexión segura (HTTPS). Esta página se está sirviendo actualmente sobre HTTP."
  },

  // StructuredDataInputForm
  LABEL_PLATFORM: { [Language.EN]: "Platform", [Language.ES]: "Plataforma" },
  LABEL_TIME_PERIOD: { [Language.EN]: "Time Period", [Language.ES]: "Periodo de Tiempo" },
  TIME_PERIOD_7_DAYS: { [Language.EN]: "Last 7 Days", [Language.ES]: "Últimos 7 días" },
  TIME_PERIOD_14_DAYS: { [Language.EN]: "Last 14 Days", [Language.ES]: "Últimos 14 días" },
  TIME_PERIOD_30_DAYS: { [Language.EN]: "Last 30 Days", [Language.ES]: "Últimos 30 días" },
  TIME_PERIOD_90_DAYS: { [Language.EN]: "Last 90 Days", [Language.ES]: "Últimos 90 días" },
  TIME_PERIOD_CUSTOM: { [Language.EN]: "Custom Range...", [Language.ES]: "Rango Personalizado..." },
  SECTION_TITLE_CURRENT_PERIOD: { [Language.EN]: "Current Period Metrics", [Language.ES]: "Métricas del Periodo Actual" },
  LABEL_COMPARE_PERIOD: { [Language.EN]: "Compare to previous period", [Language.ES]: "Comparar con periodo anterior" },
  SECTION_TITLE_PREVIOUS_PERIOD: { [Language.EN]: "Previous Period Metrics", [Language.ES]: "Métricas del Periodo Anterior" },
  LABEL_IMPRESSIONS: { [Language.EN]: "Impressions", [Language.ES]: "Impresiones" },
  LABEL_CLICKS: { [Language.EN]: "Clicks", [Language.ES]: "Clics" },
  LABEL_CONVERSIONS: { [Language.EN]: "Conversions", [Language.ES]: "Conversiones" },
  LABEL_COST: { [Language.EN]: "Cost (e.g., USD)", [Language.ES]: "Costo (ej., USD)" },
  ALERT_METRICS_NEGATIVE: { [Language.EN]: "Metric values cannot be negative.", [Language.ES]: "Los valores de las métricas no pueden ser negativos." },
  ALERT_CLICKS_GT_IMPRESSIONS: { [Language.EN]: "Clicks cannot be greater than impressions for the specified period.", [Language.ES]: "Los clics no pueden ser mayores que las impresiones para el periodo especificado." },
  ALERT_PREVIOUS_METRICS_INCOMPLETE: { [Language.EN]: "To make a comparison, please fill in all metrics for the previous period.", [Language.ES]: "Para realizar una comparación, por favor completa todas las métricas del periodo anterior." },
  BUTTON_GENERATE_SUMMARY: { [Language.EN]: "Generate Campaign Summary", [Language.ES]: "Generar Resumen de Campaña" },
  BUTTON_GENERATING_SUMMARY: { [Language.EN]: "Generating Summary...", [Language.ES]: "Generando Resumen..." },
   // InsightDisplay
  LABEL_GROUNDING_SOURCES: { [Language.EN]: "Data Sources (from Google Search):", [Language.ES]: "Fuentes de Datos (de Google Search):" },
  BUTTON_COPY_INSIGHT: { [Language.EN]: "Copy Insight", [Language.ES]: "Copiar Insight" },
  BUTTON_SHARE_INSIGHT_TOOLTIP: { [Language.EN]: "Share via Email", [Language.ES]: "Compartir por Email" },
  EMAIL_SUBJECT_INSIGHT: { [Language.EN]: "Insight from InsightsBuilder", [Language.ES]: "Insight desde InsightsBuilder" },
  MESSAGE_COPIED_SUCCESS: { [Language.EN]: "Copied!", [Language.ES]: "¡Copiado!" },
  // LoadingSpinner
  LABEL_LOADING: { [Language.EN]: "Generating insights, please wait...", [Language.ES]: "Generando insights, por favor espera..." },
  // ErrorMessage
  LABEL_ERROR_PREFIX: { [Language.EN]: "Error", [Language.ES]: "Error" }, 
  ERROR_API_KEY_MISSING: { 
    [Language.EN]: "Gemini API Call Error: The API Key was not available when attempting to call the Gemini API. Please ensure the API_KEY environment variable is configured.",
    [Language.ES]: "Error en Llamada a API Gemini: La API Key no estaba disponible al intentar llamar a la API de Gemini. Por favor, asegúrate de que la variable de entorno API_KEY esté configurada."
  },
  ERROR_API_INVALID_KEY: {
    [Language.EN]: "Gemini API Error: API key not valid. Please check your API Key configuration.",
    [Language.ES]: "Error de API Gemini: API key no válida. Por favor, revisa la configuración de tu API Key."
  },
  ERROR_GEMINI_GENERIC: {
    [Language.EN]: "Gemini API Error: An unexpected error occurred while communicating with the AI model. Details: %s",
    [Language.ES]: "Error de API Gemini: Ocurrió un error inesperado al comunicarse con el modelo de IA. Detalles: %s"
  },
  ERROR_UNEXPECTED: {
    [Language.EN]: "An unexpected error occurred. Please try again or check the console for details.",
    [Language.ES]: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo o revisa la consola para más detalles."
  },
  // Feedback Button
  BUTTON_FEEDBACK_TOOLTIP: {
    [Language.EN]: "Send Feedback",
    [Language.ES]: "Enviar Feedback"
  },
  FEEDBACK_EMAIL_SUBJECT: {
    [Language.EN]: "Feedback about InsightsBuilder App",
    [Language.ES]: "Feedback sobre la aplicación InsightsBuilder"
  },
  FEEDBACK_EMAIL_BODY_PLACEHOLDER: {
    [Language.EN]: "Hello,\n\nI'd like to provide the following feedback regarding the InsightsBuilder application:\n\n[Please describe your feedback here. Include details about the feature, issue, or suggestion, and steps to reproduce if applicable.]\n\nThank you.",
    [Language.ES]: "Hola,\n\nMe gustaría proporcionar el siguiente feedback sobre la aplicación InsightsBuilder:\n\n[Por favor, describe tu feedback aquí. Incluye detalles sobre la funcionalidad, problema o sugerencia, y los pasos para reproducirlo si aplica.]\n\nGracias."
  },
  // Presentation Generation
  BUTTON_GENERATE_PPT: {
    [Language.EN]: "Generate Presentation",
    [Language.ES]: "Generar Presentación"
  },
  LABEL_GENERATING_PPT: {
    [Language.EN]: "Generating presentation...",
    [Language.ES]: "Generando presentación..."
  },
  ERROR_PPT_GENERATION: {
    [Language.EN]: "Failed to generate presentation. Details: %s",
    [Language.ES]: "Error al generar la presentación. Detalles: %s"
  },
  ERROR_PPT_JSON_PARSE: {
    [Language.EN]: "Failed to process AI response for presentation. The AI did not return valid structured data. You can try generating insights again, or check the console for technical details.",
    [Language.ES]: "Error al procesar la respuesta de la IA para la presentación. La IA no devolvió datos estructurados válidos. Puedes intentar generar los insights de nuevo o revisar la consola para detalles técnicos."
  },
  // Help Button & Modal
  BUTTON_HELP_TOOLTIP: {
    [Language.EN]: "Help & User Guide",
    [Language.ES]: "Ayuda y Guía de Usuario"
  },
  HELP_MODAL_TITLE: {
    [Language.EN]: "User Guide",
    [Language.ES]: "Guía de Usuario"
  },
  HELP_MODAL_INTRO_TITLE: {
    [Language.EN]: "Welcome to the InsightsBuilder!",
    [Language.ES]: "¡Bienvenido/a al InsightsBuilder!"
  },
  HELP_MODAL_INTRO_TEXT: {
    [Language.EN]: "This guide helps you understand how to use the application effectively. Select a topic from the left to learn more.",
    [Language.ES]: "Esta guía te ayuda a comprender cómo utilizar la aplicación de forma eficaz. Selecciona un tema de la izquierda para obtener más información."
  },
  HELP_MODAL_CLOSE_BUTTON_ARIA_LABEL: {
    [Language.EN]: "Close help modal",
    [Language.ES]: "Cerrar modal de ayuda"
  },
  HELP_TOPIC_WHAT_IS_THIS_APP_QUESTION: {
    [Language.EN]: "What is this application for?",
    [Language.ES]: "¿Para qué sirve esta aplicación?"
  },
  HELP_TOPIC_WHAT_IS_THIS_APP_ANSWER: {
    [Language.EN]: "The **Automated Data Insights Generator** helps you analyze data and generate textual insights or summaries.\n\n- **Aggregated Data Analysis**: Input various types of data (e.g., from Google Ads, Meta Ads, GA4, CRM, or manual summaries) along with contextual information. The AI will provide a comprehensive analysis, identify trends, and offer recommendations. You can also upload images for visual analysis.\n- **Quick Campaign Summary**: Provide basic metrics (impressions, clicks, conversions, cost) for a specific platform (Google Ads or Meta Ads) and time period. The AI will generate a concise performance summary.",
    [Language.ES]: "El **Generador Automatizado de Insights** te ayuda a analizar datos y generar insights textuales o resúmenes.\n\n- **Análisis de Datos Agregados**: Introduce varios tipos de datos (ej., de Google Ads, Meta Ads, GA4, CRM o resúmenes manuales) junto con información contextual. La IA proporcionará un análisis completo, identificará tendencias y ofrecerá recomendaciones. También puedes subir imágenes para análisis visual.\n- **Resumen Rápido de Campaña**: Proporciona métricas básicas (impresiones, clics, conversiones, costo) para una plataforma específica (Google Ads o Meta Ads) y un periodo de tiempo. La IA generará un resumen conciso del rendimiento."
  },
  HELP_TOPIC_DATA_INPUT_TIPS_QUESTION: {
    [Language.EN]: "How should I format my data for Aggregated Analysis?",
    [Language.ES]: "¿Cómo debo formatear mis datos para el Análisis Agregado?"
  },
  HELP_TOPIC_DATA_INPUT_TIPS_ANSWER: {
    [Language.EN]: "For the best results in **Aggregated Data Analysis**:\n\n1.  **Be Clear**: If pasting data from multiple sources (e.g., Google Ads and Meta Ads), label each section clearly. Example:\n    `=== Google Ads - Last 30 Days ===\n    Spend: $1000, Clicks: 2000, Conversions: 50\n\n    === Meta Ads - Last 30 Days ===\n    Spend: $800, Impressions: 100000, Leads: 30`\n2.  **Context is Key**: Use the optional fields (Client Name, Sector, Market, Additional Context) to give the AI more background. This helps generate more relevant insights.\n3.  **Summarized Data**: Provide summarized data (e.g., total spend, average CPC) rather than raw, row-level data dumps.\n4.  **Excel Files**: If using Excel, ensure data is on the first sheet in a clear tabular format. The content will be appended to the text area.\n5.  **Specific Questions**: Use the 'Specific Questions' field to guide the AI if you have particular areas of interest (e.g., \"Why did our CPA increase this month?\").\n6.  **Creatives**: Upload up to 5 images for visual analysis. The AI will comment on their visual elements and potential effectiveness.",
    [Language.ES]: "Para obtener los mejores resultados en el **Análisis de Datos Agregados**:\n\n1.  **Sé Claro/a**: Si pegas datos de múltiples fuentes (ej., de Google Ads y Meta Ads), etiqueta cada sección claramente. Ejemplo:\n    `=== Google Ads - Últimos 30 Días ===\n    Gasto: $1000, Clics: 2000, Conversiones: 50\n\n    === Meta Ads - Últimos 30 Días ===\n    Gasto: $800, Impresiones: 100000, Leads: 30`\n2.  **El Contexto es Clave**: Utiliza los campos opcionales (Nombre del Cliente, Sector, Mercado, Contexto Adicional) para dar más trasfondo a la IA. Esto ayuda a generar insights más relevantes.\n3.  **Datos Resumidos**: Proporciona datos resumidos (ej., gasto total, CPC promedio) en lugar de volcados de datos brutos a nivel de fila.\n4.  **Archivos Excel**: Si usas Excel, asegúrate de que los datos estén en la primera hoja en un formato tabular claro. El contenido se añadirá al área de texto.\n5.  **Preguntas Específicas**: Usa el campo 'Preguntas Específicas' para guiar a la IA si tienes áreas particulares de interés (ej., \"¿Por qué aumentó nuestro CPA este mes?\").\n6.  **Creatividades**: Sube hasta 5 imágenes para análisis visual. La IA comentará sobre sus elementos visuais y su posible efectividad."
  },
  HELP_TOPIC_UNDERSTANDING_INSIGHTS_QUESTION: {
    [Language.EN]: "How do I interpret the generated insights?",
    [Language.ES]: "¿Cómo interpreto los insights generados?"
  },
  HELP_TOPIC_UNDERSTANDING_INSIGHTS_ANSWER: {
    [Language.EN]: "The AI aims to provide:\n\n- **Executive Summary**: A quick overview of key findings.\n- **Performance Analysis**: What happened based on the data provided.\n- **Potential Reasons**: Why these results might have occurred, considering context.\n- **Visual Analysis**: If images were uploaded, comments on their visual aspects.\n- **Actionable Recommendations**: Specific suggestions for improvement.\n- **Sentiment Analysis**: At the end of the report, a quick summary of the overall sentiment (Positive, Negative, or Neutral) detected in your data, with a brief explanation.\n\n**Look for**: \n- Bolded text, which highlights key conclusions.\n- Calculations like CTR, CPC, CPA if derivable from your data.\n- Connections between different data points and the context you provided.\n\nIf the insight isn't clear or seems off, try rephrasing your input data, adding more context, or asking more specific questions.",
    [Language.ES]: "La IA tiene como objetivo proporcionar:\n\n- **Resumen Ejecutivo**: Una visión general rápida de los hallazgos clave.\n- **Análisis de Rendimiento**: Qué sucedió según los datos proporcionados.\n- **Posibles Razones**: Por qué podrían haber ocurrido estos resultados, considerando el contexto.\n- **Análisis Visual**: Si se subieron imágenes, comentarios sobre sus aspectos visuales.\n- **Recomendaciones Accionables**: Sugerencias específicas para mejorar.\n- **Análisis de Sentimiento**: Al final del informe, un resumen rápido del sentimiento general (Positivo, Negativo o Neutro) detectado en tus datos, con una breve explicación.\n\n**Busca**: \n- Texto en negrita, que resalta conclusiones clave.\n- Cálculos como CTR, CPC, CPA si se pueden derivar de tus datos.\n- Conexiones entre diferentes puntos de datos y el contexto que proporcionaste.\n\nSi el insight no es claro o parece incorrecto, intenta reformular tus datos de entrada, añadir más contexto o hacer preguntas más específicas."
  },
  HELP_TOPIC_PPT_GENERATION_QUESTION: {
    [Language.EN]: "How does PowerPoint generation work?",
    [Language.ES]: "¿Cómo funciona la generación de PowerPoint?"
  },
  HELP_TOPIC_PPT_GENERATION_ANSWER: {
    [Language.EN]: "After generating insights for **Aggregated Data Analysis**, you can click the \"Generate Presentation\" button.\n\nThe AI will take the textual insight and your original input data to structure a PowerPoint presentation. \n\n1.  **Brand Style**: Select a brand style (LLYC Default, IFEMA MADRID, Motortec Report Template) before generating insights. This style will be applied to the presentation.\n2.  **Content**: The AI attempts to map the textual insight (including visual analysis of any uploaded creatives) into a slide structure relevant to the chosen brand style.\n3.  **Download**: The PPTX file will be automatically downloaded by your browser.\n\n**Important Notes:**\n- Ensure you have generated insights first.\n- The quality of the presentation depends on the clarity and comprehensiveness of the textual insight generated by the AI.\n- For the 'Motortec Report Template', the AI will try to fill a predefined slide structure. For other styles, it generates a more general consultancy report structure.\n- If you encounter errors, try re-generating the insights with clear data and context. Ensure creative filenames are simple if issues persist with image inclusion in Motortec templates.",
    [Language.ES]: "Después de generar insights para el **Análisis de Datos Agregados**, puedes hacer clic en el botón \"Generar Presentación\".\n\nLa IA tomará el insight textual y tus datos de entrada originales para estructurar una presentación de PowerPoint.\n\n1.  **Estilo de Marca**: Selecciona un estilo de marca (LLYC Default, IFEMA MADRID, Plantilla Informe Motortec) antes de generar los insights. Este estilo se aplicará a la presentación.\n2.  **Contenido**: La IA intenta mapear el insight textual (incluido el análisis visual de cualquier creatividad subida) en una estructura de diapositivas relevante para el estilo de marca elegido.\n3.  **Descarga**: El archivo PPTX será descargado automáticamente por tu navegador.\n\n**Notas Importantes:**\n- Asegúrate de haber generado los insights primero.\n- La calidad de la presentación depende de la claridad y exhaustividad del insight textual generado por la IA.\n- Para la 'Plantilla Informe Motortec', la IA intentará rellenar una estructura de diapositivas predefinida. Para otros estilos, genera una estructura de informe de consultoría más general.\n- Si encuentras errores, intenta regenerar los insights con datos y contexto claros. Asegúrate de que los nombres de archivo de las creatividades sean simples si persisten los problemas con la inclusión de imágenes en las plantillas Motortec."
  },
};

// Removed: export type UIStringKeys = keyof typeof UI_STRINGS; (will be imported from types.ts)

export const getText = (lang: Language, key: UIStringKeys, ...args: string[]): string => {
  const translations = UI_STRINGS[key] as Record<Language, string> | undefined; // Cast for stricter checking
  let str = translations?.[lang] || translations?.[Language.EN] || `Missing translation for ${String(key)}`;
  if (args.length > 0 && str.includes('%s')) {
    args.forEach(arg => {
      str = str.replace('%s', arg);
    });
  }
  return str;
};


export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

// Brand Style Options
export const BRAND_STYLE_OPTIONS: { value: BrandStyle; label: string }[] = [
    { value: BrandStyle.LLYC_DEFAULT, label: "LLYC Default" },
    { value: BrandStyle.IFEMA_MADRID, label: "IFEMA MADRID (General Style)" },
    { value: BrandStyle.MOTORTEC_REPORT_TEMPLATE, label: "Motortec Report Template (IFEMA)" },
];


// For Aggregated Data Analysis
export const DATA_SOURCE_OPTIONS: { value: DataSource; label: string }[] = [
  { value: DataSource.GOOGLE_ADS, label: "Google Ads" },
  { value: DataSource.META_ADS, label: "Meta Ads" },
  { value: DataSource.GA4, label: "Google Analytics 4 (GA4)" },
  { value: DataSource.SALESFORCE, label: "Salesforce CRM" },
  { value: DataSource.CRM_GENERIC, label: "Generic CRM Data" },
  { value: DataSource.OPERATIONS, label: "Operational KPI Insights" },
  { value: DataSource.PASTED_MANUAL, label: "Pasted/Manual Data Summary" },
];

export const API_CONNECTOR_LIST: { id: DataSource, name: string, isGoogle: boolean }[] = [
    { id: DataSource.GOOGLE_ADS, name: "Google Ads", isGoogle: true },
    { id: DataSource.GA4, name: "Google Analytics 4", isGoogle: true },
    { id: DataSource.META_ADS, name: "Meta Ads", isGoogle: false },
];


export const MAX_CREATIVES = 5;

export const DATA_INPUT_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: `Paste your aggregated data from the selected sources. For example:
- Google Ads - Campaign X: Spend $1000, Clicks 2000, Conversions 100, ROAS 3.5
- Meta Ads - Campaign Y: Spend $800, Impressions 50000, Link Clicks 1500, Leads 50
- GA4 Data: Overall Users: 10000 (vs 8000 prev period), Traffic from Google Ads: 30%, Traffic from Meta Ads: 25%
Ensure data is clearly delineated if from multiple sources.`,
    [Language.ES]: `Pega tus datos agregados de las fuentes seleccionadas. Por ejemplo:
- Google Ads - Campaña X: Gasto $1000, Clics 2000, Conversiones 100, ROAS 3.5
- Meta Ads - Campaña Y: Gasto $800, Impresiones 50000, Clics en Enlace 1500, Leads 50
- Datos GA4: Usuarios Totales: 10000 (vs 8000 periodo ant.), Tráfico de Google Ads: 30%, Tráfico de Meta Ads: 25%
Asegúrate de que los datos estén claramente delimitados si provienen de múltiples fuentes.`
}[lang]);

export const CLIENT_NAME_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: "Optional: e.g., Acme Corp, Your Client Ltd.",
    [Language.ES]: "Opcional: ej., Acme Corp, Tu Cliente SL"
}[lang]);
export const SECTOR_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: "Optional: e.g., Retail E-commerce, B2B SaaS, Healthcare Services",
    [Language.ES]: "Opcional: ej., E-commerce Minorista, SaaS B2B, Servicios de Salud"
}[lang]);
export const CAMPAIGN_MARKET_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: "Optional: e.g., USA & Canada, Western Europe, Global",
    [Language.ES]: "Opcional: ej., EE.UU. y Canadá, Europa Occidental, Global"
}[lang]);
export const ADDITIONAL_CONTEXT_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: `Optional: e.g., Competitor A launched a major campaign last month. Recent holiday season impact. New privacy regulations affecting ad tracking.`,
    [Language.ES]: `Opcional: ej., Competidor A lanzó gran campaña el mes pasado. Impacto reciente de festividades. Nuevas regulaciones de privacidad afectando tracking.`
}[lang]);
export const SPECIFIC_QUESTIONS_PLACEHOLDER_FN = (lang: Language): string => ({
    [Language.EN]: `Optional: e.g., Which platform drove the most qualified leads? What's the overall marketing ROI? Why did GA4 users increase?`,
    [Language.ES]: `Opcional: ej., ¿Qué plataforma generó más leads cualificados? ¿Cuál es el ROI de marketing general? ¿Por qué aumentaron los usuarios de GA4?`
}[lang]);
export const PLACEHOLDER_DATA_BLOCK_TIME_PERIOD = (lang: Language): string => ({
    [Language.EN]: "e.g., Last 30 Days, Q1 2024",
    [Language.ES]: "ej., Últimos 30 Días, Q1 2024"
}[lang]);
export const PLACEHOLDER_DATA_BLOCK_KPIS = (lang: Language): string => ({
    [Language.EN]: "Paste KPIs for this source...\ne.g., Spend: $1000, Clicks: 2000",
    [Language.ES]: "Pega los KPIs para esta fuente...\nej., Gasto: $1000, Clics: 2000"
}[lang]);


// For Structured Campaign Data Analysis
export const STRUCTURED_PLATFORM_OPTIONS: { value: StructuredCampaignPlatform; label: string }[] = [
  { value: StructuredCampaignPlatform.GOOGLE_ADS, label: "Google Ads" },
  { value: StructuredCampaignPlatform.META_ADS, label: "Meta Ads" },
];

export const getTimePeriodOptions = (lang: Language): { value: TimePeriod; label: string }[] => [
    { value: TimePeriod.DAYS_7, label: getText(lang, 'TIME_PERIOD_7_DAYS') },
    { value: TimePeriod.DAYS_14, label: getText(lang, 'TIME_PERIOD_14_DAYS') },
    { value: TimePeriod.DAYS_30, label: getText(lang, 'TIME_PERIOD_30_DAYS') },
    { value: TimePeriod.DAYS_90, label: getText(lang, 'TIME_PERIOD_90_DAYS') },
    { value: TimePeriod.CUSTOM, label: getText(lang, 'TIME_PERIOD_CUSTOM') },
];

export const getTimePeriodLabel = (lang: Language, period: TimePeriod, startDate?: string, endDate?: string): string => {
    if (period === TimePeriod.CUSTOM && startDate && endDate) {
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
            const locale = lang === Language.ES ? 'es-ES' : 'en-US';
            const formattedStart = new Date(startDate + 'T00:00:00Z').toLocaleDateString(locale, options);
            const formattedEnd = new Date(endDate + 'T00:00:00Z').toLocaleDateString(locale, options);
            
            return lang === Language.ES 
              ? `del ${formattedStart} al ${formattedEnd}`
              : `${formattedStart} - ${formattedEnd}`;
        } catch (e) {
            console.error("Error formatting custom date range:", e);
            return `${startDate} to ${endDate}`; // Fallback
        }
    }

    const labels = {
        [TimePeriod.DAYS_7]: { [Language.EN]: "the last 7 days", [Language.ES]: "los últimos 7 días" },
        [TimePeriod.DAYS_14]: { [Language.EN]: "the last 14 days", [Language.ES]: "los últimos 14 días" },
        [TimePeriod.DAYS_30]: { [Language.EN]: "the last 30 days", [Language.ES]: "los últimos 30 días" },
        [TimePeriod.DAYS_90]: { [Language.EN]: "the last 90 days", [Language.ES]: "los últimos 90 días" },
        [TimePeriod.CUSTOM]: { [Language.EN]: "the custom period", [Language.ES]: "el periodo personalizado" }
    };
    return labels[period]?.[lang] || labels[period]?.[Language.EN] || String(period);
};

const generateComparisonPromptPart = (previousMetrics?: CampaignMetrics): string => {
    if (!previousMetrics) return '';
    return `
- **Métricas del Periodo Anterior:**
  - Impresiones: ${previousMetrics.impressions}
  - Clics: ${previousMetrics.clicks}
  - Conversiones: ${previousMetrics.conversions}
  - Costo: ${previousMetrics.cost}`;
};

const getMetricNames = (language: Language) => {
    const isEs = language === Language.ES;
    return {
        impressions: isEs ? "Impresiones" : "Impressions",
        clicks: isEs ? "Clics" : "Clicks",
        conversions: isEs ? "Conversiones" : "Conversions",
        cost: isEs ? "Costo" : "Cost",
        ctr: isEs ? "CTR (Tasa de Clics)" : "CTR (Click-Through Rate)",
        cpc: isEs ? "CPC (Costo por Clic)" : "CPC (Cost Per Click)",
        cpa: isEs ? "CPA (Costo por Adquisición)" : "CPA (Cost Per Acquisition)",
        cvr: isEs ? "CVR (Tasa de Conversión)" : "CVR (Conversion Rate)",
        strategicConclusions: isEs ? "Conclusiones Estratégicas" : "Strategic Conclusions",
    };
};

const getColumnNames = (language: Language) => {
    const isEs = language === Language.ES;
    return {
        metric: isEs ? "Métrica" : "Metric",
        current: isEs ? "Periodo Actual" : "Current Period",
        previous: isEs ? "Periodo Anterior" : "Previous Period",
        change: isEs ? "Cambio %" : "Change %"
    };
};

const generateBasePrompt = (platformName: string, timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language) => {
    const comparisonPrompt = generateComparisonPromptPart(previousMetrics);
    const metricNames = getMetricNames(language);
    const columnNames = getColumnNames(language);
    const languageText = language === Language.ES ? 'Español' : 'English';
    const languageInstruction = `La respuesta final debe estar íntegramente en ${languageText}.`;

    const requiredRows = [
        metricNames.impressions,
        metricNames.clicks,
        metricNames.conversions,
        metricNames.cost,
        metricNames.ctr,
        metricNames.cpc,
        metricNames.cpa,
        metricNames.cvr
    ].join(', ');

    let requiredColumns = `"${columnNames.metric}", "${columnNames.current}"`;
    if (previousMetrics) {
        requiredColumns += `, "${columnNames.previous}", "${columnNames.change}"`;
    }
    
    return `
**TU ROL:** Eres un Director Senior de Marketing Digital y Paid Media con más de 10 años de experiencia. Tu visión es estratégica y estás enfocado en resultados de negocio. Analiza los siguientes datos de campaña y proporciona un resumen ejecutivo para un cliente. Tu tono debe ser experto, claro y directo.

**DATOS A ANALIZAR:**
- **Plataforma:** ${platformName}
- **Periodo:** ${timePeriodLabel}
- **Métricas del Periodo Actual:**
  - Impresiones: ${currentMetrics.impressions}
  - Clics: ${currentMetrics.clicks}
  - Conversiones: ${currentMetrics.conversions}
  - Costo: ${currentMetrics.cost}
${comparisonPrompt}

---

**INSTRUCCIONES DE SALIDA (OBLIGATORIO):**
Tu respuesta DEBE seguir este formato de dos partes, en este orden exacto y sin ningún otro texto introductorio o de cierre.
**REQUISITO DE IDIOMA:** ${languageInstruction}

**PARTE 1: Tabla de KPIs de Rendimiento**
Genera una tabla en formato Markdown. **No añadas ningún texto antes de la tabla.**
- **Columnas Requeridas:** ${requiredColumns}.
- **Filas Requeridas:** La primera columna ('${columnNames.metric}') debe contener, en orden, los siguientes nombres de métricas: ${requiredRows}.
- Rellena los datos para las métricas proporcionadas (Impresiones, Clics, Conversiones, Costo).
- **Calcula y rellena** los datos para las métricas derivadas (CTR, CPC, CPA, CVR).
- Si hay datos de comparación, calcula el "Cambio %" para TODAS las filas.

**PARTE 2: Conclusiones Estratégicas**
Después de la tabla, **DEJA UNA LÍNEA EN BLANCO** y luego, en la siguiente línea, añade el encabezado \`## ${metricNames.strategicConclusions}\`. Este espaciado es crucial para el formato correcto.
Bajo este encabezado, proporciona tu análisis experto en 3 a 5 viñetas (bullet points).
- **Interpreta los datos, no los repitas.** Explica qué significan para el negocio.
- Enfócate en la eficiencia de la inversión (CPC, CPA), la calidad del tráfico (CTR), el impacto en el negocio (Conversiones, CVR) y las tendencias.
- **Usa negrita (**) para resaltar métricas y conclusiones clave.**
`;
};


export const PROMPT_TEMPLATES = {
  [StructuredCampaignPlatform.GOOGLE_ADS]: (timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language) => 
    generateBasePrompt("Google Ads", timePeriodLabel, currentMetrics, previousMetrics, language),

  [StructuredCampaignPlatform.META_ADS]: (timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language) =>
    generateBasePrompt("Meta Ads", timePeriodLabel, currentMetrics, previousMetrics, language)
};

const getMotortecTemplateExampleJson = (language: Language, clientName: string, brandStyle: BrandStyle): MotortecReportContent => {
    const isEs = language === Language.ES;
    // Fallback values for the example structure
    return {
        slide1_Title: { pageNumber: "01", reportName: clientName || (isEs ? "MOTORTEC" : "MOTORTEC"), eventDate: isEs ? "Abril 2025" : "April 2025", fixedHeaderText: isEs ? "Cierre MOTORTEC|" : "MOTORTEC Close|" },
        slide2_Agenda: { pageNumber: "02", pageTitle: isEs ? "Radiografía de campaña" : "Campaign Overview", agendaItems: [isEs ? "Objetivos" : "Objectives", isEs ? "Resultados" : "Results", isEs ? "Análisis de Canales" : "Channel Analysis", isEs ? "Análisis Visual y Creativo" : "Visual & Creative Analysis"] },
        slide3_ObjectivesResults: { 
            pageNumber: "03", fixedHeaderText: isEs ? "Cierre Motrotec |" : "Motrotec Close |",
            mainTitlePart1: isEs ? "Punto de partida," : "Starting Point,", mainTitlePart2: isEs ? "Visión de llegada" : "Arrival Vision",
            objectives: [{ title: isEs ? "OBJETIVO 1" : "OBJECTIVE 1", description: isEs ? "Impulsar la venta..." : "Boost sales..." }, { title: isEs ? "OBJETIVO 2" : "OBJECTIVE 2", description: isEs ? "Promocionar contenido..." : "Promote content..." }],
            resultsTitle: isEs ? "RESULTADOS" : "RESULTS", resultsPoints: [isEs ? "7.433 conversiones..." : "7,433 conversions...", isEs ? "Campañas de contenido..." : "Content campaigns..."]
        },
        slide4_KPICharts: {
            pageNumber: "04", pageTitle: isEs ? "La venta es trabajo en equipo" : "Sales is Teamwork",
            headerKpis: [{label: isEs? "Inversión": "Investment", value: "25,4K"}, {label: isEs? "Total conv": "Total Conv.", value:"8.857"}],
            mvpCampaignTitle: isEs ? "Los MVPs de la campaña" : "Campaign MVPs", mvpCampaignQuestion: isEs ? "¿Qué canales tienen mayor peso?" : "Which channels have more weight?",
            mvpCampaignCharts: [{name: "GADS", value: "64%"}, {name: "DV360", value: "35%"}],
            invisibleNetworkTitle: isEs ? "La red invisible de la conversión" : "The Invisible Conversion Network", invisibleNetworkQuestion: isEs ? "¿Qué canales contribuyeron?" : "Which channels contributed?",
            invisibleNetworkCharts: [{name: "GADS", value: "59%"}, {name: "DV360", value: "37%"}],
            cmSobreCampañaText: isEs ? "Comentario sobre campaña..." : "Campaign commentary..."
        },
        slide5_ComparativeCharts: {
            pageNumber: "05", pageTitle: isEs ? "El momento que dijeron SÍ" : "The Moment They Said YES",
            totalConversionsText: isEs ? "8.857 CONVERSIONES EN MOTORTEC" : "8,857 CONVERSIONES IN MOTORTEC",
            loNuestroTitle: isEs ? "Lo Nuestro." : "Ours.", loNuestroCampaignName: isEs ? "Campaña de Motortec" : "Motortec Campaign", loNuestroQuestion: isEs ? "¿Dónde convierten?" : "Where do they convert?",
            loNuestroCharts: [{name: "motortec", value: "98%"}],
            loDeTodosTitle: isEs ? "Lo de todos." : "Everyone's.", loDeTodosCampaignName: isEs ? "Usuarios registrados" : "Registered Users", loDeTodosQuestion: isEs ? "¿De qué campañas vienen?" : "From which campaigns?",
            loDeTodosCharts: [{name: "motortec", value: "88,5%"}]
        },
        slide6_PlatformDivider: {
            pageNumber: "06", fixedHeaderText: isEs ? "Cierre Motortec | Abril 2025" : "Motortec Close | April 2025",
            pageTitle: isEs ? "Plataforma" : "Platform", analysisPoints: [isEs ? "1. Análisis del target" : "1. Target Analysis"]
        },
        slide7_DemographicsCreative: {
            pageNumber: "07", mainTitle: isEs ? "A quién le hablamos" : "Who We Talk To", subTitle: isEs ? "Por qué nos escuchó" : "Why They Listened",
            creativeImageIdentifier: "example_meta_ad.png", // This will be the key for the PPT to find the image
            charts: [
                {chartTitle: "SEXO", items: [{label: isEs ? "Hombres" : "Men", value: 60}, {label: isEs ? "Mujeres" : "Women", value: 40}]},
                {chartTitle: "EDAD", items: [{label: "25-34", value: 30}, {label: "35-44", value: 25}]}
            ]
        },
        slide8_Consideracion: {
            pageNumber: "08", pageTitle: isEs ? "Consideración: Del recuerdo al interés" : "Consideration: From Recall to Interest",
            globalResults: { mainKpis: [{kpiName: "Impresiones", value: "1M", change:"+10%"}, {kpiName: "Clics", value: "10K", change: "+5%"}], regionalTables: [{regionName: "Nacional", kpis: [{name:"Imp", value:"-5%"}]}]},
            channelsTable: { headers: ["Canal", isEs ? "Inversión" : "Investment", "Imp", "CTR"], items: [{channelName: "Meta", kpis:[{name:isEs ? "Inversión" : "Investment", value:"3.151€"}, {name:"Imp", value: "2,05M"}]}]},
            insightsPoints: [isEs ? "Dgen consigue el 69%..." : "Dgen achieves 69%..."]
        },
        slide9_Conversion: {
            pageNumber: "09", pageTitle: isEs ? "Conversión: Donde el click se convierte en acción" : "Conversion: Where Click Becomes Action",
            globalResults: { mainKpis: [{kpiName: "Conversiones", value: "500", change:"+20%"}], regionalTables: [{regionName: "Nacional", kpis: [{name:"Conv", value:"479%"}]}]},
            channelsTable: { headers: ["Canal", "Conv", "CPA", "CR"], items: [{channelName: "PMAX", kpis:[{name:"Conv", value:"392"}, {name:"CPA", value:"3,23€"}]}]},
            insightsPoints: [isEs ? "Search 51% de conversiones..." : "Search 51% of conversions..."]
        },
        slide10_CreativeAnalysisMeta: { // This slide will use the visual analysis from textInsight
            pageTitle: isEs ? "Análisis Visual y Creativo: Meta" : "Visual & Creative Analysis: Meta",
            creatives: [{imageIdentifier: "creative1.jpg", registros: "1.504", ctr: "0,57%", inversionPercent: "54%"}], // imageIdentifier is key
            analysisPoints: [isEs ? "Las creatividades estáticas con mensajes claros y directos (extraído del textInsight)..." : "Static creatives with clear, direct messaging (extracted from textInsight)..."]
        },
        slide11_Organico: {
            pageNumber: "10", pageTitle: isEs ? "Orgánico: Donde el contenido cobra fuerza." : "Organic: Where Content Gains Strength.",
            reelsImageIdentifier: "reels_example.png", // Placeholder
            objectives: [{title: isEs ? "Objetivo: Aumentar seguidores IG" : "Objective: Increase IG Followers", kpiPoints: ["21.599 visitas..."]}],
            globalSummaryPoints: [isEs ? "+3M usuarios únicos..." : "+3M unique users..."]
        }
    };
};


export const PROMPT_TEMPLATE_FOR_PPT_JSON = (
  originalData: string,
  textInsight: string, // IMPORTANT: This textInsight now CONTAINS the detailed visual analysis of uploaded images.
  language: Language,
  brandStyle: BrandStyle, 
  uploadedCreativeFilenames: string[] = [],
  clientName: string = "Cliente",
  sector: string = "N/A",
  campaignMarket: string = "N/A",
  additionalContext: string = "N/A",
  specificQuestions: string = "N/A"
): string => {
  const langInstruction = language === Language.ES ? "El contenido de texto en el JSON debe estar en Español." : "The text content in the JSON must be in English.";
  
  const exampleClientName = clientName === "Cliente" || clientName === "Client" ? (language === Language.ES ? "Cliente Ejemplo" : "Example Client") : clientName;

  if (brandStyle === BrandStyle.MOTORTEC_REPORT_TEMPLATE) {
    const motortecExampleJson = getMotortecTemplateExampleJson(language, exampleClientName, brandStyle);
    const examplePresentationDataForMotortec: PresentationData = {
        presentationTitle: `MOTORTEC_Report_${exampleClientName.replace(/\s+/g, '_')}`,
        clientName: exampleClientName,
        period: language === Language.ES ? "Periodo Analizado (Motortec)" : "Analyzed Period (Motortec)",
        language: language,
        brandStyle: BrandStyle.MOTORTEC_REPORT_TEMPLATE,
        motortecReportContent: motortecExampleJson
    };

    return `
You are an expert AI assistant tasked with transforming a textual data analysis report (which includes visual analysis of images) into a structured JSON format.
This JSON will be used to populate a **fixed PowerPoint template based on the "Motortec" report structure**.
Your goal is to parse the 'AI-Generated Textual Insight' and 'Original Data Provided by User' to populate the JSON structure for the Motortec template.
The 'AI-Generated Textual Insight' has been crafted by a previous AI step to be clear, business-oriented, use simplified tables/bullets, and adopt an emphatic consultant tone, highlighting achievements and concrete recommendations. Your task is to accurately map this high-quality insight into the JSON.

**Context Provided by User:**
- Client Name: ${clientName}
- Sector/Industry: ${sector}
- Campaign Market(s): ${campaignMarket}
- Original Data Provided by User:
  \`\`\`
  ${originalData}
  \`\`\`
- Uploaded Creative Filenames (these were visually analyzed by a previous AI step): ${uploadedCreativeFilenames.join(', ') || "None"}
- Additional Context/Trends from User: ${additionalContext}
- Specific Questions from User: ${specificQuestions}

**AI-Generated Textual Insight (This is the primary source for slide content and *includes detailed visual analysis* of any uploaded images. This insight already reflects the desired clarity, business-focus, and consultant tone):**
\`\`\`
${textInsight}
\`\`\`

**Output JSON Structure Requirements for Motortec Template:**
Your output MUST be a single, valid JSON object matching the 'PresentationData' TypeScript interface, specifically using the 'motortecReportContent' field.
${langInstruction}
Do NOT include any explanatory text before or after the JSON object.
The JSON should follow this structure:

\`\`\`json
${JSON.stringify(examplePresentationDataForMotortec, null, 2)}
\`\`\`

**Detailed Instructions for Populating the 'motortecReportContent' JSON:**
- For each field in the example 'motortecReportContent' structure, extract the corresponding information from the 'AI-Generated Textual Insight' and 'Original Data Provided by User'.
- **Prioritize the 'AI-Generated Textual Insight'**: This insight has already been refined for quality. Extract executive summaries, KPIs, analysis points, conclusions, and recommendations directly from it.
- **Slide Page Numbers and Fixed Text:** Use values from the example if static, or derive if dynamic.
- **Titles and Textual Content:** Extract relevant titles, descriptions, bullet points, etc., from the insight. Ensure bullet points are short and clear as per the insight's style.
- **KPIs and Tables:** Extract specific metric names, values, and comparative data. Tables in the insight should already be simplified; reflect this.
- **Chart Data:** Provide 'name' (label) and 'value' (percentage string).
- **Creative Analysis (e.g., slide10_CreativeAnalysisMeta):**
    - 'creatives' array: For each creative filename listed in 'Uploaded Creative Filenames':
        - 'imageIdentifier': Use the exact filename. This is crucial for the PPT to display the correct image.
        - 'analysisPoints': **Crucially, extract the detailed visual analysis points for THIS specific creative *from the 'AI-Generated Textual Insight' section that discusses image analysis*.** The insight already contains what the AI "saw" and analyzed with the desired consultant tone.
        - Attempt to extract 'registros', 'ctr', 'inversionPercent' if present in the insight or original data for that creative.
- **Image Identifiers (General):** For other slides requiring images (e.g., slide7, slide11), use exact filenames if specified or placeholders if generic.
- **If data for a specific field or an entire slide structure within 'motortecReportContent' is not clearly extractable from the 'AI-Generated Textual Insight', you MAY omit that field or the entire slide object. However, prioritize populating from the insight.**
- Maintain language consistency as per '${language}'.

Begin JSON output now:
`;
  } else { // For LLYC_DEFAULT and IFEMA_MADRID (general style)
    const localSlideTypeKpiHighlights = SlideType.KPI_HIGHLIGHTS;
    const exampleKpiItem: KpiItem = { name: "KPI Ejemplo", value: "120 unidades", change: "+15% vs AA", changeType: "positive", notes: "Crecimiento destacado" };
    const exampleKpiHighlightSection: KpiHighlightSection = { 
      id: "1", 
      title: language === Language.ES ? "Resultados Clave Sección 1" : "Key Results Section 1",
      points: ["Punto de resultado A...", "Punto de resultado B..."]
    };
    const exampleTitleSlide: SlideContent = { type: SlideType.TITLE_SLIDE, title: `Informe: ${exampleClientName}`, subtitle: `Análisis de Campaña - ${new Date().toLocaleDateString(language === Language.ES ? 'es-ES' : 'en-US')}`};
    const exampleAgendaSlide: SlideContent = { type: SlideType.AGENDA_SLIDE, title: language === Language.ES ? "Índice" : "Agenda", agendaPoints: [ "Introducción", "Resultados Globales", "Análisis por Canal", "Análisis Visual y Creativo", "Conclusiones y Recomendaciones" ] };
    const exampleSectionDividerSlide: SlideContent = { type: SlideType.SECTION_DIVIDER_SLIDE, title: language === Language.ES ? "Profundizando en los Resultados" : "Deep Dive into Results", subtitle: language === Language.ES ? "Análisis detallado de las métricas principales." : "Detailed analysis of key metrics." };
    const exampleKpiHighlightsSlide: SlideContent = { 
      type: localSlideTypeKpiHighlights, 
      title: language === Language.ES ? "KPIs Destacados" : "KPI Highlights", 
      kpiHighlightSections: [exampleKpiHighlightSection, {...exampleKpiHighlightSection, id: "2", title: language === Language.ES ? "Observaciones Adicionales" : "Additional Observations"}]
    };
    const exampleCreativeAnalysisSlide: SlideContent = {
      type: SlideType.CREATIVE_ANALYSIS,
      title: language === Language.ES ? "Análisis Visual de Creatividad: ejemplo_creatividad.png" : "Visual Creative Analysis: example_creative.png",
      imageIdentifier: "ejemplo_creatividad.png", // This is the filename for PPT to find the image
      analysisPoints: [ language === Language.ES ? "Observación visual sobre la creatividad 1 (extraído del textInsight)..." : "Visual observation about creative 1 (extracted from textInsight)..." ],
      creativeName: "ejemplo_creatividad.png"
    };
    const exampleAnnexSlide: SlideContent = { type: SlideType.ANNEX_SLIDE, title: language === Language.ES ? "Anexo" : "Annex", annexContent: language === Language.ES ? "Datos detallados y tablas adicionales..." : "Detailed data and additional tables..." };

    const exampleSlides: SlideContent[] = [
      exampleTitleSlide,
      exampleAgendaSlide,
      exampleSectionDividerSlide,
      { type: SlideType.EXECUTIVE_SUMMARY, title: language === Language.ES ? "Resumen Ejecutivo" : "Executive Summary", executiveSummaryPoints: ["Conclusión principal 1...", "Conclusión principal 2..."] },
      exampleKpiHighlightsSlide, 
      { type: SlideType.DETAILED_ANALYSIS, title: language === Language.ES ? "Análisis Detallado" : "Detailed Analysis", analysisTitle: language === Language.ES ? "Observaciones Clave" : "Key Observations", analysisPoints: ["Punto de análisis 1...", "Punto de análisis 2..."] },
      ...(uploadedCreativeFilenames.length > 0 ? [exampleCreativeAnalysisSlide] : []),
      { type: SlideType.CONCLUSIONS_RECOMMENDATIONS, title: language === Language.ES ? "Conclusiones y Recomendaciones" : "Conclusions & Recommendations", conclusions: ["Conclusión final A..."], recommendations: ["Recomendación estratégica 1..."] },
      exampleAnnexSlide,
      { type: SlideType.THANK_YOU_SLIDE, title: language === Language.ES ? "GRACIAS" : "THANK YOU" }
    ];

    const examplePresentationData: PresentationData = {
      presentationTitle: `Informe_${exampleClientName.replace(/\s+/g, '_')}`,
      clientName: exampleClientName,
      period: language === Language.ES ? "Periodo Analizado (inferido)" : "Analyzed Period (inferred)",
      language: language,
      brandStyle: brandStyle,
      slides: exampleSlides
    };
    return `
You are an expert AI assistant tasked with transforming a textual data analysis report (which includes visual analysis of images) into a structured JSON format suitable for generating a PowerPoint presentation.
The presentation style will be determined by the 'brandStyle' parameter: "${brandStyle}".
The 'AI-Generated Textual Insight' you receive has already been crafted by a previous AI step to be clear, business-oriented, use simplified tables/bullets, and adopt an emphatic consultant tone, highlighting achievements and concrete recommendations. Your task is to accurately map this high-quality insight into the JSON.

User will provide: original input data, AI-generated textual insight (which includes detailed visual analysis), contextual information, and uploaded creative filenames.
Your goal is to parse the 'AI-Generated Textual Insight' and 'Original Data Provided by User' to populate the JSON structure.

**Context Provided by User:**
- Client Name: ${clientName}
- Sector/Industry: ${sector}
- Campaign Market(s): ${campaignMarket}
- Original Data Provided by User:
  \`\`\`
  ${originalData}
  \`\`\`
- Uploaded Creative Filenames (these were visually analyzed by a previous AI step): ${uploadedCreativeFilenames.join(', ') || "None"}
- Additional Context/Trends from User: ${additionalContext}
- Specific Questions from User: ${specificQuestions}

**AI-Generated Textual Insight (This is the primary source for slide content and *includes detailed visual analysis* of any uploaded images. This insight already reflects the desired clarity, business-focus, and consultant tone):**
\`\`\`
${textInsight}
\`\`\`

**Output JSON Structure Requirements:**
Your output MUST be a single, valid JSON object matching the 'PresentationData' TypeScript interface.
${langInstruction}
Do NOT include any explanatory text before or after the JSON object.
**CRITICAL CONSTRAINT:** The generated 'slides' array in the JSON **must contain at least 5 slides**, including an Executive Summary, a detailed analysis or KPI slide, and a Conclusions/Recommendations slide, all populated with content extracted from the 'AI-Generated Textual Insight'. A presentation with only a title and agenda is an invalid and incomplete response.
The JSON should follow this structure (note 'brandStyle' field):

\`\`\`json
${JSON.stringify(examplePresentationData, null, 2)}
\`\`\`

**Detailed Instructions for Populating the JSON (Emulate general consultancy report structure):**

1.  **presentationTitle**: Create a concise title like "Informe_${exampleClientName}".
2.  **clientName**: Use "${clientName}".
3.  **period**: Infer from 'originalData' or 'textInsight'.
4.  **language**: Set to "${language}".
5.  **brandStyle**: Set to "${brandStyle}".
6.  **slides**: Array of 'SlideContent'. Populate as follows, **primarily extracting content from the already refined 'textInsight'**:
    *   **SlideType.TITLE_SLIDE**: Main title for the report.
    *   **SlideType.AGENDA_SLIDE**: Based on the main sections you identify in the textInsight. Consider including a point like "Visual & Creative Analysis" if images were analyzed.
    *   **SlideType.SECTION_DIVIDER_SLIDE**: Use these to introduce major sections.
    *   **SlideType.EXECUTIVE_SUMMARY**: Extract the **direct, business-oriented executive summary** from the beginning of the 'textInsight'.
    *   **SlideType.KPI_HIGHLIGHTS**: Populate with key metrics and observations, reflecting the emphatic tone on achievements present in 'textInsight'. Use short, clear bullet points.
    *   **SlideType.DETAILED_ANALYSIS, MULTI_COLUMN_ANALYSIS, IMAGE_WITH_CAPTION**: Populate as appropriate from the textInsight. Ensure tables are simplified and bullets are concise.
    *   **SlideType.CREATIVE_ANALYSIS**:
        *   Generate one 'CREATIVE_ANALYSIS' slide for each uploaded creative filename if visual analysis for it is present in the 'textInsight'.
        *   'title': "${language === Language.ES ? "Análisis Visual de Creatividad:" : "Visual Creative Analysis:"} [Filename]".
        *   'imageIdentifier': The exact filename of the creative (from 'Uploaded Creative Filenames').
        *   'analysisPoints': **Extract the detailed visual analysis points (what the AI "saw", its observations, suggestions with a consultant tone) for THIS specific creative *from the 'AI-Generated Textual Insight'*.**
        *   'creativeName': The filename.
    *   **SlideType.CONCLUSIONS_RECOMMENDATIONS**: Extract the **concrete, actionable recommendations** and conclusions from 'textInsight'.
    *   **SlideType.ANNEX_SLIDE**: For detailed data or methodology notes.
    *   **SlideType.THANK_YOU_SLIDE**: Standard thank you.

**General Guidelines for AI:**
-   **Structure First**: Prioritize a logical flow based on the 'textInsight'.
-   **Content from 'textInsight'**: All slide content, especially textual points, executive summaries, and creative analysis, must be derived/extracted from the provided 'textInsight'.
-   **Conciseness**: Keep slide text brief and to the point, reflecting the style of 'textInsight'.
-   **Titles**: Ensure clear, descriptive titles for slides and sections.
-   **Creative Analysis Extraction**: The 'textInsight' you are given already contains the detailed visual interpretation with the desired consultant tone. Your job is to find that analysis for each creative and structure it into 'analysisPoints' for the JSON.
-   Maintain a professional, clear, and insightful tone, consistent with the 'textInsight'.

Begin JSON output now:
`;
  }
};

// Help Topics
export const HELP_TOPICS_LIST: HelpTopic[] = [
  { id: 'what-is-this-app', questionKey: 'HELP_TOPIC_WHAT_IS_THIS_APP_QUESTION', answerKey: 'HELP_TOPIC_WHAT_IS_THIS_APP_ANSWER' },
  { id: 'data-input-tips', questionKey: 'HELP_TOPIC_DATA_INPUT_TIPS_QUESTION', answerKey: 'HELP_TOPIC_DATA_INPUT_TIPS_ANSWER' },
  { id: 'understanding-insights', questionKey: 'HELP_TOPIC_UNDERSTANDING_INSIGHTS_QUESTION', answerKey: 'HELP_TOPIC_UNDERSTANDING_INSIGHTS_ANSWER' },
  { id: 'ppt-generation', questionKey: 'HELP_TOPIC_PPT_GENERATION_QUESTION', answerKey: 'HELP_TOPIC_PPT_GENERATION_ANSWER' },
];