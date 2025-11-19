
import { DataSource, StructuredCampaignPlatform, TimePeriod, Language, SlideType, KpiItem, PresentationData, SlideContent, KpiHighlightSection, BrandStyle, MotortecReportContent, HelpTopic, UIStringKeys, CampaignMetrics, CampaignGoals } from './types.ts';

// --- Critical App Configuration ---
export const GOOGLE_CLIENT_ID: string = "1076786873783-mj9gt2kkcjudp7i3ldln19el67sf6ulr.apps.googleusercontent.com";
export const META_APP_ID: string = "2019316998286043";

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
  LABEL_CAMPAIGN_GOALS_SECTION: { [Language.EN]: "Campaign Goals (Optional, Planned)", [Language.ES]: "Objetivos de Campaña (Opcional, Planificado)" },
  LABEL_TARGET_CPA: { [Language.EN]: "Target CPA", [Language.ES]: "CPA Objetivo" },
  LABEL_TARGET_CTR: { [Language.EN]: "Target CTR (%)", [Language.ES]: "CTR Objetivo (%)" },
  LABEL_TARGET_CVR: { [Language.EN]: "Target CVR (%)", [Language.ES]: "CVR Objetivo (%)" },
  LABEL_IMPRESSIONS: { [Language.EN]: "Impressions", [Language.ES]: "Impresiones" },
  LABEL_CLICKS: { [Language.EN]: "Clicks", [Language.ES]: "Clics" },
  LABEL_CONVERSIONS: { [Language.EN]: "Conversions", [Language.ES]: "Conversiones" },
  LABEL_PRIMARY_METRIC_NAME: { [Language.EN]: "Primary Metric", [Language.ES]: "Métrica Principal" },
  LABEL_PRIMARY_METRIC_VALUE: { [Language.EN]: "Primary Metric Value", [Language.ES]: "Valor Métrica Principal" },
  LABEL_COST: { [Language.EN]: "Cost (e.g., USD)", [Language.ES]: "Costo (ej., USD)" },
  ALERT_METRICS_NEGATIVE: { [Language.EN]: "Metric values cannot be negative.", [Language.ES]: "Los valores de las métricas no pueden ser negativos." },
  ALERT_CLICKS_GT_IMPRESSIONS: { [Language.EN]: "Clicks cannot be greater than impressions for the specified period.", [Language.ES]: "Los clics no pueden ser mayores que las impresiones para el periodo especificado." },
  ALERT_PREVIOUS_METRICS_INCOMPLETE: { [Language.EN]: "To make a comparison, please fill in all metrics for the previous period.", [Language.ES]: "Para realizar una comparación, por favor completa todas las métricas del periodo anterior." },
  BUTTON_GENERATE_SUMMARY: { [Language.EN]: "Generate Campaign Summary", [Language.ES]: "Generar Resumen de Campaña" },
  BUTTON_GENERATING_SUMMARY: { [Language.EN]: "Generating Summary...", [Language.ES]: "Generando Resumen..." },
  LABEL_GROUNDING_SOURCES: { [Language.EN]: "Data Sources (from Google Search):", [Language.ES]: "Fuentes de Datos (de Google Search):" },
  BUTTON_COPY_INSIGHT: { [Language.EN]: "Copy Insight", [Language.ES]: "Copiar Insight" },
  BUTTON_SHARE_INSIGHT_TOOLTIP: { [Language.EN]: "Share via Email", [Language.ES]: "Compartir por Email" },
  EMAIL_SUBJECT_INSIGHT: { [Language.EN]: "Insight from InsightsBuilder", [Language.ES]: "Insight desde InsightsBuilder" },
  MESSAGE_COPIED_SUCCESS: { [Language.EN]: "Copied!", [Language.ES]: "¡Copiado!" },
  LABEL_LOADING: { [Language.EN]: "Generating insights, please wait...", [Language.ES]: "Generando insights, por favor espera..." },
  LABEL_ERROR_PREFIX: { [Language.EN]: "Error", [Language.ES]: "Error" }, 
  ERROR_API_KEY_MISSING: { 
    [Language.EN]: "Gemini API Call Error: The API Key was not available when attempting to call the Gemini API. Please ensure the API_KEY environment variable is configured.",
    [Language.ES]: "Error en Llamada a API Gemini: La API Key no estaba disponible al intentar llamar a la API de Gemini. Por favor, asegúrate de que la variable de entorno API_KEY esté configurada."
  },
  ERROR_API_INVALID_KEY: {
    [Language.EN]: "Gemini API Key Error. Please check that your API_KEY environment variable is set. This is required even for manual data analysis.",
    [Language.ES]: "Error de API Key de Gemini. Por favor, verifica que tu variable de entorno API_KEY esté configurada. Esto es necesario incluso para el análisis de datos manuales."
  },
  ERROR_GEMINI_GENERIC: {
    [Language.EN]: "Gemini API Error: An unexpected error occurred while communicating with the AI model. Details: %s",
    [Language.ES]: "Error de API Gemini: Ocurrió un error inesperado al comunicarse con el modelo de IA. Detalles: %s"
  },
  ERROR_UNEXPECTED: {
    [Language.EN]: "An unexpected error occurred. Please try again or check the console for details.",
    [Language.ES]: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo o revisa la consola para más detalles."
  },
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
  HELP_TOPIC_EXCEL_GUIDE_QUESTION: {
    [Language.EN]: "What's the best way to format an Excel file?",
    [Language.ES]: "¿Cuál es la mejor manera de formatear un archivo Excel?"
  },
  HELP_TOPIC_EXCEL_GUIDE_ANSWER: {
    [Language.EN]: "To get the best results when uploading an Excel file, follow these key guidelines. The tool is designed to read simple, clean tables.\n\n### 1. Use Only the First Worksheet\nThe application will **only read data from the very first sheet** in your Excel workbook. Any data on other sheets will be ignored.\n\n### 2. Simple Tabular Structure\nOrganize your data in a clear table format. The first row should contain your headers, and subsequent rows should contain the corresponding data.\n\n**✓ Good Example:**\n| Campaign Name       | Spend  | Impressions | Clicks | Conversions |\n|---------------------|--------|-------------|--------|-------------|\n| Brand Awareness Q1  | 5000   | 1500000     | 7500   | 50          |\n| Lead Gen Spring     | 8500   | 450000      | 9800   | 450         |\n\n### 3. Avoid Complex Formatting\n- **No Merged Cells**: Do not merge cells. Each piece of data should reside in its own individual cell.\n- **No Blank Rows**: Avoid blank rows within your data table, as this can stop the parsing process.\n- **Summarized Data**: Provide aggregated or summarized data. The tool is not designed to process thousands of raw, row-level log entries.\n\n### 4. What Gets Ignored\nThe system only extracts the **raw text and numeric values** from the cells. The following will be completely ignored:\n- Charts and graphs\n- Images, shapes, and drawings\n- Formulas (only the calculated result is read)\n- Cell colors, font styles, and other formatting\n- Pivot tables (please convert them to flat tables first)\n- Macros\n\nBy following this structure, you ensure the AI receives clean, well-organized data, which leads to much more accurate and insightful analysis.",
    [Language.ES]: "Para obtener los mejores resultados al subir un archivo Excel, sigue estas pautas clave. La herramienta está diseñada para leer tablas simples y limpias.\n\n### 1. Usa Solo la Primera Hoja\nLa aplicación **solo leerá los datos de la primera hoja** de tu libro de Excel. Cualquier dato en otras hojas será ignorado.\n\n### 2. Estructura Tabular Simple\nOrganiza tus datos en un formato de tabla claro. La primera fila debe contener los encabezados, y las filas siguientes deben contener los datos correspondientes.\n\n**✓ Buen Ejemplo:**\n| Nombre de Campaña   | Inversión | Impresiones | Clics | Conversiones |\n|---------------------|-----------|-------------|-------|--------------|\n| Notoriedad Q1       | 5000      | 1500000     | 7500  | 50           |\n| Leads Primavera     | 8500      | 450000      | 9800  | 450          |\n\n### 3. Evita Formatos Complejos\n- **Sin Celdas Combinadas**: No combines celdas. Cada dato debe estar en su propia celda individual.\n- **Sin Filas en Blanco**: Evita filas en blanco dentro de tu tabla de datos, ya que esto puede detener el proceso de lectura.\n- **Datos Resumidos**: Proporciona datos agregados o resumidos. La herramienta no está diseñada para procesar miles de registros brutos a nivel de fila.\n\n### 4. Qué se Ignora\nEl sistema solo extrae los **valores de texto y numéricos brutos** de las celdas. Lo siguiente será completamente ignorado:\n- Gráficos y diagramas\n- Imágenes, formas y dibujos\n- Fórmulas (solo se lee el resultado calculado)\n- Colores de celda, estilos de fuente y otros formatos\n- Tablas dinámicas (por favor, conviértelas primero en tablas planas)\n- Macros\n\nAl seguir esta estructura, te aseguras de que la IA reciba datos limpios y bien organizados, lo que conduce a un análisis mucho más preciso y revelador."
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
    [Language.ES]: "Después de generar insights para el **Análisis de Datos Agregados**, puedes hacer clic en el botón \"Generar Presentación\".\n\nLa IA tomará el insight textual y tus datos de entrada originales para estructurar una presentación de PowerPoint.\n\n1.  **Estilo de Marca**: Selecciona un estilo de marca (LLYC Default, IFEMA MADRID, Plantilla Informe Motortec) antes de generar los insights. Este estilo se aplicará a la presentación.\n2.  **Contenido**: La IA intenta mapear el insight textual (incluido el análisis visual de cualquier creatividad subida) en una estructura de diapositivas relevante para el estilo de marca elegido.\n3.  **Descarga**: El archivo PPTX será descargado automáticamente por tu navegador.\n\n**Notas Importantes:**\n- Asegúrate de que los insights se hayan generado primero.\n- La calidad de la presentación depende de la claridad y exhaustividad del insight textual generado por la IA.\n- Para la 'Plantilla Informe Motortec', la IA intentará rellenar una estructura de diapositivas predefinida. Para otros estilos, genera una estructura de informe de consultoría más general.\n- Si encuentras errores, intenta regenerar los insights con datos y contexto claros. Asegúrate de que los nombres de archivo de las creatividades sean simples si persisten los problemas con la inclusión de imágenes en las plantillas Motortec."
  },
};

export const getText = (lang: Language, key: UIStringKeys, ...args: string[]): string => {
  const translations = UI_STRINGS[key] as Record<Language, string> | undefined; 
  let str = translations?.[lang] || translations?.[Language.EN] || `Missing translation for ${String(key)}`;
  if (args.length > 0 && str.includes('%s')) {
    args.forEach(arg => {
      str = str.replace('%s', arg);
    });
  }
  return str;
};

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

export const BRAND_STYLE_OPTIONS: { value: BrandStyle; label: string }[] = [
    { value: BrandStyle.LLYC_DEFAULT, label: "LLYC Default" },
    { value: BrandStyle.IFEMA_MADRID, label: "IFEMA MADRID (General Style)" },
    { value: BrandStyle.MOTORTEC_REPORT_TEMPLATE, label: "Motortec Report Template (IFEMA)" },
];

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
  - ${previousMetrics.primaryMetricName || 'Métrica Principal'}: ${previousMetrics.primaryMetricValue}
  - Costo: ${previousMetrics.cost}`;
};

const generateGoalsPromptPart = (campaignGoals: CampaignGoals | undefined, language: Language): string => {
    if (!campaignGoals) return '';

    const goals: string[] = [];
    if (campaignGoals.targetCPA) {
        goals.push(`  - CPA Objetivo: ${campaignGoals.targetCPA}`);
    }
    if (campaignGoals.targetCTR) {
        goals.push(`  - CTR Objetivo: ${(campaignGoals.targetCTR * 100).toFixed(2)}%`);
    }
    if (campaignGoals.targetCVR) {
        goals.push(`  - CVR Objetivo: ${(campaignGoals.targetCVR * 100).toFixed(2)}%`);
    }

    if (goals.length === 0) return '';

    const title = language === Language.ES ? "Objetivos de la Campaña (Planificado):" : "Campaign Goals (Planned):";
    return `
- **${title}**
${goals.join('\n')}`;
};

const getMetricNames = (language: Language, primaryMetricName: string) => {
    const isEs = language === Language.ES;
    return {
        impressions: isEs ? "Impresiones" : "Impressions",
        clicks: isEs ? "Clics" : "Clicks",
        cost: isEs ? "Costo" : "Cost",
        primaryMetric: primaryMetricName || (isEs ? "Métrica Principal" : "Primary Metric"),
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

const generateBasePrompt = (platformName: string, timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language, campaignGoals: CampaignGoals | undefined) => {
    const comparisonPrompt = generateComparisonPromptPart(previousMetrics);
    const goalsPrompt = generateGoalsPromptPart(campaignGoals, language);
    const metricNames = getMetricNames(language, currentMetrics.primaryMetricName);
    const columnNames = getColumnNames(language);
    const languageText = language === Language.ES ? 'Español' : 'English';
    const languageInstruction = `La respuesta final debe estar íntegramente en ${languageText}.`;
    
    const isConversionMetric = /conversiones|conversions|leads/i.test(currentMetrics.primaryMetricName);
    const baseRows = [
        metricNames.impressions,
        metricNames.clicks,
        metricNames.cost,
        `"${metricNames.primaryMetric}"`, 
        metricNames.ctr,
        metricNames.cpc
    ];
    if (isConversionMetric) {
        baseRows.push(metricNames.cpa, metricNames.cvr);
    }
    const requiredRows = baseRows.join(', ');

    let requiredColumns = `"${columnNames.metric}", "${columnNames.current}"`;
    if (previousMetrics) {
        requiredColumns += `, "${columnNames.previous}", "${columnNames.change}"`;
    }
    
    return `
**TU ROL:** Eres un Director de Marketing experto con más de 20 años de experiencia. Tu visión es profundamente estratégica y estás enfocado en los resultados de negocio y el ROI. Analiza los siguientes datos de campaña y proporciona un resumen ejecutivo para un cliente. Tu tono debe ser el de un experto consumado, claro, conciso y directo al grano.

**INSTRUCCIÓN CRÍTICA DE ANÁLISIS:**
**DEBES usar los 'Objetivos de la Campaña (Planificado)' proporcionados como el principal punto de referencia para tu evaluación.** Tu análisis sobre si los resultados son "buenos" o "malos" **DEBE basarse en si se cumplieron, superaron o no se alcanzaron estos objetivos.** Compara explícitamente los resultados actuales con estos objetivos en tus conclusiones.

**DATOS A ANALIZAR:**
- **Plataforma:** ${platformName}
- **Periodo:** ${timePeriodLabel}
${goalsPrompt}
- **Métricas del Periodo Actual:**
  - Impresiones: ${currentMetrics.impressions}
  - Clics: ${currentMetrics.clicks}
  - ${currentMetrics.primaryMetricName || 'Métrica Principal'}: ${currentMetrics.primaryMetricValue}
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
- Rellena los datos para las métricas proporcionadas (Impresiones, Clics, Costo, y "${metricNames.primaryMetric}").
- **Calcula y rellena** los datos para las métricas derivadas (CTR, CPC).
- **Si la métrica principal es de conversión (ej. "Conversiones", "Leads"), calcula y añade también el CPA y el CVR.** Si es otra métrica (ej. "ROAS", "Visualizaciones"), omite el CPA y el CVR.
- Si hay datos de comparación, calcula el "Cambio %" para TODAS las filas.

**PARTE 2: Conclusiones Estratégicas**
Después de la tabla, **DEJA UNA LÍNEA EN BLANCO** y luego, en la siguiente línea, añade el encabezado \`## ${metricNames.strategicConclusions}\`. Este espaciado es crucial para el formato correcto.
Bajo este encabezado, proporciona tu análisis experto en 3 a 5 viñetas (bullet points).
- **Interpreta los datos, no los repitas. Compara explícitamente los resultados con los objetivos de la campaña.** Explica qué significa para el negocio si los objetivos se cumplieron o no.
- Enfócate en la eficiencia de la inversión (CPC, y CPA si aplica) en relación con los objetivos. Analiza la calidad del tráfico (CTR) y el impacto en el negocio (métrica principal) frente a lo planificado.
- **Usa negrita (**) para resaltar métricas y conclusiones estratégicas clave, especialmente al comparar con los objetivos.**
`;
};


export const PROMPT_TEMPLATES = {
  [StructuredCampaignPlatform.GOOGLE_ADS]: (timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language, campaignGoals: CampaignGoals | undefined) => 
    generateBasePrompt("Google Ads", timePeriodLabel, currentMetrics, previousMetrics, language, campaignGoals),

  [StructuredCampaignPlatform.META_ADS]: (timePeriodLabel: string, currentMetrics: CampaignMetrics, previousMetrics: CampaignMetrics | undefined, language: Language, campaignGoals: CampaignGoals | undefined) =>
    generateBasePrompt("Meta Ads", timePeriodLabel, currentMetrics, previousMetrics, language, campaignGoals)
};

const getMotortecTemplateExampleJson = (language: Language, clientName: string, brandStyle: BrandStyle): MotortecReportContent => {
    const isEs = language === Language.ES;
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
            creativeImageIdentifier: "example_meta_ad.png", 
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
        slide10_CreativeAnalysisMeta: { 
            pageTitle: isEs ? "Análisis Visual y Creativo: Meta" : "Visual & Creative Analysis: Meta",
            creatives: [{imageIdentifier: "creative1.jpg", registros: "1.504", ctr: "0,57%", inversionPercent: "54%"}], 
            analysisPoints: [isEs ? "Las creatividades estáticas con mensajes claros y directos (extraído del textInsight)..." : "Static creatives with clear, direct messaging (extracted from textInsight)..."]
        },
        slide11_Organico: {
            pageNumber: "10", pageTitle: isEs ? "Orgánico: Donde el contenido cobra fuerza." : "Organic: Where Content Gains Strength.",
            reelsImageIdentifier: "reels_example.png", 
            objectives: [{title: isEs ? "Objetivo: Aumentar seguidores IG" : "Objective: Increase IG Followers", kpiPoints: ["21.599 visitas..."]}],
            globalSummaryPoints: [isEs ? "+3M usuarios únicos..." : "+3M unique users..."]
        }
    };
};


export const PROMPT_TEMPLATE_FOR_PPT_JSON = (
  originalData: string,
  textInsight: string, 
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
    // ... (Motortec logic remains same as it's a fixed template) ...
    const motortecExampleJson = getMotortecTemplateExampleJson(language, exampleClientName, brandStyle);
    return `
You are an expert AI assistant tasked with transforming a textual data analysis report into a structured JSON for the Motortec fixed template.
**Output JSON Structure Requirements:**
\`\`\`json
${JSON.stringify({presentationTitle: `MOTORTEC_Report`, clientName: exampleClientName, period: "Analizado", language: language, brandStyle: BrandStyle.MOTORTEC_REPORT_TEMPLATE, motortecReportContent: motortecExampleJson}, null, 2)}
\`\`\`
(Fill this structure based on the textInsight and Original Data. Ensure 'motortecReportContent' is fully populated.)
${langInstruction}
Context: Client: ${clientName}, Sector: ${sector}, Market: ${campaignMarket}.
Original Data: ${originalData}
Text Insight: ${textInsight}
`;
  } else { // For LLYC_DEFAULT and IFEMA_MADRID
    const exampleKpiItem: KpiItem = { name: "KPI Ejemplo", value: "120", change: "+15%", changeType: "positive", notes: "Crecimiento" };
    const exampleSlides: SlideContent[] = [
      { type: SlideType.TITLE_SLIDE, title: `Informe: ${exampleClientName}`, subtitle: `Análisis de Campaña - ${new Date().toLocaleDateString()}`},
      { type: SlideType.AGENDA_SLIDE, title: language === Language.ES ? "Índice" : "Agenda", agendaPoints: [ "Executive Summary", "KPI Overview", "Detailed Analysis" ] },
      { type: SlideType.EXECUTIVE_SUMMARY, title: language === Language.ES ? "Resumen Ejecutivo" : "Executive Summary", executiveSummaryPoints: ["Key point 1", "Key point 2"] },
      { 
        type: SlideType.KPI_GRID, // NEW SLIDE TYPE
        title: "Performance Overview", 
        kpis: [
          { name: "Total Spend", value: "$12.5k", change: "+5%", changeType: "positive" },
          { name: "Conversions", value: "450", change: "+12%", changeType: "positive" },
          { name: "CPA", value: "$27.8", change: "-3%", changeType: "positive" }
        ]
      },
      {
        type: SlideType.TWO_COLUMN, // NEW SLIDE TYPE
        title: "Comparative Analysis: Google vs Meta",
        leftColumnTitle: "Google Ads",
        leftColumnPoints: ["High conversion rate", "Lower CPA"],
        rightColumnTitle: "Meta Ads",
        rightColumnPoints: ["Broad reach", "Good for awareness"]
      },
      { type: SlideType.SECTION_DIVIDER_SLIDE, title: "Analysis Deep Dive", subtitle: "Detailed Breakdown" },
      { type: SlideType.DETAILED_ANALYSIS, title: "Deep Dive", analysisPoints: ["Point A", "Point B"] },
      { type: SlideType.CONCLUSIONS_RECOMMENDATIONS, title: "Conclusions", conclusions: ["C1"], recommendations: ["R1"] }
    ];

    const examplePresentationData: PresentationData = {
      presentationTitle: `Informe_${exampleClientName.replace(/\s+/g, '_')}`,
      clientName: exampleClientName,
      period: language === Language.ES ? "Periodo Analizado" : "Analyzed Period",
      language: language,
      brandStyle: brandStyle,
      slides: exampleSlides
    };
    return `
You are an expert presentation designer and data analyst.
Your goal is to create a **visually structured, professional presentation** JSON based on the provided Text Insight and Original Data.
The output must be a valid JSON object matching the 'PresentationData' interface.

**DESIGN INSTRUCTIONS (CRITICAL):**
- **Avoid walls of text.** 
- **MANDATORY:** Use 'KPI_GRID' type for any section presenting 3 or more numeric metrics (e.g. Impressions, CTR, CPC, Conversions). These render as visual cards.
- **MANDATORY:** Use 'TWO_COLUMN' type when comparing two distinct things (e.g., Platform A vs Platform B, Current Period vs Previous Period, Pros vs Cons).
- **Use 'SECTION_DIVIDER_SLIDE'** to break up major sections of the report.
- **Use 'EXECUTIVE_SUMMARY'** at the start for high-level takeaways.
- **Use 'DETAILED_ANALYSIS'** only for simple lists of observations that don't fit the Grid or Column formats.
- **Use 'CONCLUSIONS_RECOMMENDATIONS'** at the end.

**Context Provided by User:**
- Client Name: ${clientName}
- Sector/Industry: ${sector}
- Campaign Market(s): ${campaignMarket}
- Original Data Provided by User: \`\`\`${originalData}\`\`\`
- Uploaded Creative Filenames: ${uploadedCreativeFilenames.join(', ') || "None"}
- Additional Context: ${additionalContext}
- Specific Questions: ${specificQuestions}

**AI-Generated Textual Insight (Source Content):**
\`\`\`${textInsight}\`\`\`

**Output JSON Structure:**
\`\`\`json
${JSON.stringify(examplePresentationData, null, 2)}
\`\`\`

**Instructions for Populating Slides:**
1.  **Title Slide:** Standard title.
2.  **Agenda:** List the sections you are creating.
3.  **Executive Summary:** Extract the most important business takeaways.
4.  **Data Visualization (KPIs):** Look for the main metrics in the insight. Create a **KPI_GRID** slide. Populate 'kpis' array with name, value, change (if available), and changeType.
5.  **Comparative Analysis:** If the data compares two platforms (e.g. Google vs Meta) or two periods, create a **TWO_COLUMN** slide. Put one entity in the left column and the other in the right.
6.  **Visual Analysis:** If there are uploaded creatives and the insight analyzes them, create **CREATIVE_ANALYSIS** slides for each image.
7.  **Conclusions:** Distinct actionable advice.

${langInstruction}
Begin JSON output now:
`;
  }
};

export const HELP_TOPICS_LIST: HelpTopic[] = [
  { id: 'what-is-this-app', questionKey: 'HELP_TOPIC_WHAT_IS_THIS_APP_QUESTION', answerKey: 'HELP_TOPIC_WHAT_IS_THIS_APP_ANSWER' },
  { id: 'data-input-tips', questionKey: 'HELP_TOPIC_DATA_INPUT_TIPS_QUESTION', answerKey: 'HELP_TOPIC_DATA_INPUT_TIPS_ANSWER' },
  { id: 'excel-guide', questionKey: 'HELP_TOPIC_EXCEL_GUIDE_QUESTION', answerKey: 'HELP_TOPIC_EXCEL_GUIDE_ANSWER' },
  { id: 'understanding-insights', questionKey: 'HELP_TOPIC_UNDERSTANDING_INSIGHTS_QUESTION', answerKey: 'HELP_TOPIC_UNDERSTANDING_INSIGHTS_ANSWER' },
  { id: 'ppt-generation', questionKey: 'HELP_TOPIC_PPT_GENERATION_QUESTION', answerKey: 'HELP_TOPIC_PPT_GENERATION_ANSWER' },
];
