
export enum DataSource {
  GOOGLE_ADS = "Google Ads",
  META_ADS = "Meta Ads",
  GA4 = "Google Analytics 4",
  SALESFORCE = "Salesforce",
  CRM_GENERIC = "Generic CRM Data",
  OPERATIONS = "Operational KPI Insights",
  PASTED_MANUAL = "Pasted/Manual Data Summary"
}

export interface UploadedImage {
  name: string;
  type: string;
  dataUrl: string; // base64 encoded image data
}

export enum BrandStyle {
  LLYC_DEFAULT = "LLYC Default",
  IFEMA_MADRID = "IFEMA MADRID",
  MOTORTEC_REPORT_TEMPLATE = "Motortec Report Template (IFEMA)" // New Template Style
}

export interface AggregatedDataBlock {
  id: string; // For React keys
  source: DataSource;
  timePeriod: string;
  kpis: string;
}

export interface ApiConnection {
  source: DataSource;
  data: any; // Parsed JSON data from the API
}

export interface InsightRequest {
  selectedDataSources: DataSource[];
  data: string;
  clientName?: string; 
  sector?: string; 
  campaignMarket?: string; 
  additionalContext?: string; 
  specificQuestions?: string;
  uploadedCreatives?: UploadedImage[];
  brandStyle: BrandStyle; 
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}

export interface GenerateContentGeminiResponse {
  text: string;
  candidates?: Candidate[];
}

// New types for Structured Campaign Data Analysis
export enum StructuredCampaignPlatform {
  GOOGLE_ADS = "Google Ads",
  META_ADS = "Meta Ads",
}

export enum TimePeriod {
  DAYS_7 = "7",
  DAYS_14 = "14",
  DAYS_30 = "30",
  DAYS_90 = "90",
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export interface StructuredInsightRequest {
  platform: StructuredCampaignPlatform;
  timePeriod: TimePeriod;
  currentMetrics: CampaignMetrics;
  previousMetrics?: CampaignMetrics; // Optional, for comparison
}

// Language Selection
export enum Language {
  EN = "English",
  ES = "Español",
}

// --- Types for Presentation Generation ---

export interface KpiItem {
  name: string;        
  value: string;       
  change?: string;      
  changeType?: "positive" | "negative" | "neutral"; 
  notes?: string;       
}

export interface KpiHighlightSection {
  id?: string; 
  title: string;
  points: string[];
}

export enum SlideType {
  TITLE_SLIDE = "titleSlide",                 
  AGENDA_SLIDE = "agendaSlide",               
  SECTION_DIVIDER_SLIDE = "sectionDividerSlide", 
  EXECUTIVE_SUMMARY = "executiveSummary",     
  KPI_OVERVIEW = "kpiOverview",               
  KPI_HIGHLIGHTS = "kpiHighlights",           
  DETAILED_ANALYSIS = "detailedAnalysis",     
  MULTI_COLUMN_ANALYSIS = "multiColumnAnalysis", 
  CONCLUSIONS_RECOMMENDATIONS = "conclusionsRecommendations", 
  IMAGE_WITH_CAPTION = "imageWithCaption",    
  CREATIVE_ANALYSIS = "creativeAnalysis",       
  ANNEX_SLIDE = "annexSlide",                 
  THANK_YOU_SLIDE = "thankYouSlide"           
}

export interface CreativeAnalysisItem { 
    originalImageName: string;
    analysisPoints: string[];
}

export interface SlideContent {
  type: SlideType;
  title?: string;                             
  subtitle?: string;                          
  agendaPoints?: string[];                    
  executiveSummaryPoints?: string[];          
  kpis?: KpiItem[];                           
  kpiNotes?: string;                          
  kpiHighlightSections?: KpiHighlightSection[];
  analysisTitle?: string;                     
  analysisPoints?: string[];                  
  multiColumnSections?: Array<{ title?: string; points: string[] }>; 
  conclusions?: string[];                     
  recommendations?: string[];                 
  imageIdentifier?: string;                   
  creativeName?: string; 
  annexContent?: string; 
}

// --- Types for Motortec Report Template ---
export interface MotortecSlide1Title {
  pageNumber?: string; // "01"
  reportName?: string; // "MOTORTEC"
  eventDate?: string; // "Abril 2025"
  fixedHeaderText?: string; // "Cierre MOTORTEC|"
}

export interface MotortecSlide2Agenda {
  pageNumber?: string; // "02"
  pageTitle?: string; // "Radiografía de campaña"
  agendaItems?: string[]; // ["Objetivos", "Resultados", ...]
}

export interface MotortecObjective {
  title: string; // "OBJETIVO 1"
  description: string; 
}
export interface MotortecSlide3ObjectivesResults {
  pageNumber?: string; // "03"
  fixedHeaderText?: string; // "Cierre Motrotec |"
  mainTitlePart1?: string; // "Punto de partida,"
  mainTitlePart2?: string; // "Visión de llegada" (yellow)
  objectives?: MotortecObjective[]; // Array of 2 objectives
  resultsTitle?: string; // "RESULTADOS" (yellow)
  resultsPoints?: string[];
}

export interface MotortecKpiValue { label: string; value: string; }
export interface MotortecDonutChartItem { name: string; value: string; // e.g., "64%"
}
export interface MotortecSlide4KPICharts {
  pageNumber?: string; // "04"
  pageTitle?: string; // "La venta es trabajo en equipo"
  headerKpis?: MotortecKpiValue[]; // ["Inversión", "Total conv", ...]
  mvpCampaignTitle?: string; // "Los MVPs de la campaña"
  mvpCampaignQuestion?: string;
  mvpCampaignCharts?: MotortecDonutChartItem[]; // [GADS, DV360, META]
  invisibleNetworkTitle?: string; // "La red invisible de la conversión"
  invisibleNetworkQuestion?: string;
  invisibleNetworkCharts?: MotortecDonutChartItem[]; // [GADS, DV360, META, CRITEO, MEDIOS, BING]
  cmSobreCampañaText?: string;
}

export interface MotortecSlide5ComparativeCharts {
    pageNumber?: string; // "05"
    pageTitle?: string; // "El momento que dijeron SÍ"
    totalConversionsText?: string; // "8.857 CONVERSIONES EN MOTORTEC"
    loNuestroTitle?: string; // "Lo Nuestro."
    loNuestroCampaignName?: string; // "Campaña de Motortec"
    loNuestroQuestion?: string;
    loNuestroCharts?: MotortecDonutChartItem[]; // [motortec, fruitattraction, sicur]
    loDeTodosTitle?: string; // "Lo de todos."
    loDeTodosCampaignName?: string; // "Usuarios registrados en Motortec"
    loDeTodosQuestion?: string;
    loDeTodosCharts?: MotortecDonutChartItem[]; // [motortec, semana-educación, Almoneda]
}

export interface MotortecSlide6PlatformDivider {
    pageNumber?: string; // "06"
    fixedHeaderText?: string; // "Cierre Motortec | Abril 2025"
    pageTitle?: string; // "Plataforma"
    analysisPoints?: string[]; // ["1. Analisis del target", ...]
}

export interface MotortecDemographicChart {
    chartTitle: string; // "SEXO", "EDAD", "UBICACIÓN"
    items: Array<{label: string; value?: number; color?: string}>; // AI should provide items, color can be mapped later
}
export interface MotortecSlide7DemographicsCreative {
    pageNumber?: string; // "07"
    mainTitle?: string; // "A quién le hablamos"
    subTitle?: string; // "Por qué nos escuchó"
    creativeImageIdentifier?: string; // Filename of the Meta ad creative
    charts?: MotortecDemographicChart[];
}

export interface MotortecGlobalResultsKpi { kpiName: string; value: string; change?: string; }
export interface MotortecRegionalTable { regionName: string; kpis: Array<{name: string; value: string;}> }
export interface MotortecChannelsTableItem { channelName: string; kpis: Array<{name: string; value: string;}> }
export interface MotortecSlide8Consideracion {
    pageNumber?: string; // "08"
    pageTitle?: string; // "Consideración: Del recuerdo al interés"
    globalResults?: {
        mainKpis: MotortecGlobalResultsKpi[]; // [Impresiones, Clics, CTR]
        regionalTables: MotortecRegionalTable[]; // [Nacional, Portugal]
    };
    channelsTable?: {
        headers: string[]; // ["", "Inversión", "Imp", "CTR"]
        items: MotortecChannelsTableItem[]; // [DV360, Deal DV, Meta, Dgen]
    };
    insightsPoints?: string[];
}

export interface MotortecSlide9Conversion extends MotortecSlide8Consideracion { // Similar structure to slide 8
    // pageTitle is different: "Conversión: Donde el click se convierte en acción"
    // globalResults.mainKpis: [Conversiones, CPA, CR]
    // channelsTable.items: [PMAX, SEARCH, Meta, DV360]
}

export interface MotortecCreativeGalleryItem {
    imageIdentifier: string; // Filename
    registros?: string; // e.g. "1.504"
    ctr?: string; // e.g. "0,57%"
    inversionPercent?: string; // e.g. "54%"
}
export interface MotortecSlide10CreativeAnalysisMeta {
    pageTitle?: string; // "Análisis de creatividade s:Meta"
    creatives: MotortecCreativeGalleryItem[];
    analysisPoints: string[];
}

export interface MotortecOrganicObjective { title: string; kpiPoints: string[]; }
export interface MotortecSlide11Organico {
    pageNumber?: string; // "10" (but 11th slide)
    pageTitle?: string; // "Orgánico: Donde el contenido cobra fuerza."
    reelsImageIdentifier?: string; // Filename
    objectives: MotortecOrganicObjective[]; // [Aumentar seguidores IG, Generar engagement]
    globalSummaryPoints?: string[];
}

export interface MotortecReportContent {
    slide1_Title?: MotortecSlide1Title;
    slide2_Agenda?: MotortecSlide2Agenda;
    slide3_ObjectivesResults?: MotortecSlide3ObjectivesResults;
    slide4_KPICharts?: MotortecSlide4KPICharts;
    slide5_ComparativeCharts?: MotortecSlide5ComparativeCharts;
    slide6_PlatformDivider?: MotortecSlide6PlatformDivider;
    slide7_DemographicsCreative?: MotortecSlide7DemographicsCreative;
    slide8_Consideracion?: MotortecSlide8Consideracion;
    slide9_Conversion?: MotortecSlide9Conversion;
    slide10_CreativeAnalysisMeta?: MotortecSlide10CreativeAnalysisMeta;
    slide11_Organico?: MotortecSlide11Organico;
    // Slides 12+ (Anexo, Estrategia Global) are very data-heavy and might be too complex for initial AI templating
}


export interface PresentationData {
  presentationTitle: string;                  
  clientName?: string;                        
  period?: string;                            
  language: Language;                         
  brandStyle: BrandStyle;                     
  slides?: SlideContent[]; // For LLYC_DEFAULT and general IFEMA_MADRID styles
  motortecReportContent?: MotortecReportContent; // For MOTORTEC_REPORT_TEMPLATE
}

// --- UI String Keys ---
export type UIStringKeys =
  | "APP_TITLE"
  | "APP_SUBTITLE"
  | "API_KEY_MISSING_BANNER_TITLE"
  | "API_KEY_MISSING_BANNER_MESSAGE"
  | "TAB_AGGREGATED"
  | "TAB_STRUCTURED"
  | "SECTION_TITLE_GENERATED_INSIGHTS"
  | "SECTION_TITLE_CAMPAIGN_SUMMARY"
  | "PLACEHOLDER_AGGREGATED_RESULTS"
  | "PLACEHOLDER_STRUCTURED_RESULTS"
  | "NO_SPECIFIC_INSIGHTS_GENERATED"
  | "FOOTER_TEXT"
  | "TIPS_TITLE"
  | "TIPS_INTRO"
  | "TIPS_CONTEXT_TITLE"
  | "TIPS_CONTEXT_CLIENT"
  | "TIPS_CONTEXT_SECTOR"
  | "TIPS_CONTEXT_MARKET"
  | "TIPS_STRUCTURE_TITLE"
  | "TIPS_STRUCTURE_HEADINGS"
  | "TIPS_STRUCTURE_TIME"
  | "TIPS_STRUCTURE_KPIS"
  | "TIPS_STRUCTURE_COMPARATIVE"
  | "TIPS_STRUCTURE_CONVERSIONS"
  | "TIPS_STRUCTURE_SUMMARIZE"
  | "TIPS_EXCEL_TITLE"
  | "TIPS_EXCEL_UPLOAD"
  | "TIPS_EXCEL_STRUCTURE"
  | "TIPS_EXCEL_SIZE"
  | "TIPS_EXCEL_LIMITS"
  | "TIPS_PDF_TITLE"
  | "TIPS_PDF_NO_UPLOAD"
  | "TIPS_PDF_RECOMMENDATION"
  | "TIPS_ADDITIONAL_CONTEXT_TITLE"
  | "TIPS_ADDITIONAL_CONTEXT_USE"
  | "TIPS_ADDITIONAL_QUESTIONS_USE"
  | "LABEL_CLIENT_NAME"
  | "LABEL_SECTOR"
  | "LABEL_MARKET"
  | "LABEL_DATA_SOURCES"
  | "LABEL_UPLOAD_EXCEL"
  | "LABEL_UPLOAD_CREATIVES_TITLE"
  | "LABEL_UPLOAD_CREATIVES_BUTTON"
  | "NOTE_AI_CREATIVE_ANALYSIS_LIMITATION"
  | "LABEL_UPLOADED_CREATIVES"
  | "LABEL_NO_CREATIVES_UPLOADED"
  | "BUTTON_REMOVE_CREATIVE"
  | "FILE_TYPE_INVALID"
  | "MAX_CREATIVES_REACHED"
  | "LABEL_PASTE_DATA"
  | "LABEL_ADDITIONAL_CONTEXT"
  | "LABEL_SPECIFIC_QUESTIONS"
  | "LABEL_BRAND_STYLE"
  | "BUTTON_GENERATE_INSIGHTS"
  | "BUTTON_GENERATING"
  | "FILE_PROCESSING_MESSAGE"
  | "FILE_SIZE_WARNING_MESSAGE"
  | "FILE_SIZE_WARNING_DETAIL"
  | "FILE_SUCCESS_MESSAGE"
  | "FILE_SUCCESS_DETAIL"
  | "FILE_ERROR_PROCESS_MESSAGE"
  | "FILE_ERROR_PROCESS_DETAIL"
  | "FILE_ERROR_READ_MESSAGE"
  | "ALERT_NO_DATA_SOURCES"
  | "ALERT_NO_DATA"
  | "DATA_INPUT_FOOTER"
  | "SECTION_TITLE_DATA_INPUT"
  | "BUTTON_ADD_DATA_BLOCK"
  | "BUTTON_REMOVE_DATA_BLOCK"
  | "LABEL_DATA_BLOCK_SOURCE"
  | "LABEL_DATA_BLOCK_TIME_PERIOD"
  | "LABEL_DATA_BLOCK_KPIS"
  | "SECTION_TITLE_API_CONNECTORS"
  | "API_CONNECTORS_SUBTITLE"
  | "BUTTON_CONNECT"
  | "BUTTON_DISCONNECT"
  | "PROMPT_API_DATA_PLACEHOLDER"
  | "ERROR_INVALID_JSON"
  | "STATUS_CONNECTED"
  | "STATUS_CONNECTING"
  | "STATUS_DISCONNECTED"
  | "API_DATA_SUMMARY_HEADER"
  | "LABEL_PLATFORM"
  | "LABEL_TIME_PERIOD"
  | "SECTION_TITLE_CURRENT_PERIOD"
  | "LABEL_COMPARE_PERIOD"
  | "SECTION_TITLE_PREVIOUS_PERIOD"
  | "LABEL_IMPRESSIONS"
  | "LABEL_CLICKS"
  | "LABEL_CONVERSIONS"
  | "LABEL_COST"
  | "ALERT_METRICS_NEGATIVE"
  | "ALERT_CLICKS_GT_IMPRESSIONS"
  | "ALERT_PREVIOUS_METRICS_INCOMPLETE"
  | "BUTTON_GENERATE_SUMMARY"
  | "BUTTON_GENERATING_SUMMARY"
  | "LABEL_GROUNDING_SOURCES"
  | "BUTTON_COPY_INSIGHT"
  | "BUTTON_SHARE_INSIGHT_TOOLTIP"
  | "EMAIL_SUBJECT_INSIGHT"
  | "MESSAGE_COPIED_SUCCESS"
  | "LABEL_LOADING"
  | "LABEL_ERROR_PREFIX"
  | "ERROR_API_KEY_MISSING"
  | "ERROR_API_INVALID_KEY"
  | "ERROR_GEMINI_GENERIC"
  | "ERROR_UNEXPECTED"
  | "BUTTON_FEEDBACK_TOOLTIP"
  | "FEEDBACK_EMAIL_SUBJECT"
  | "FEEDBACK_EMAIL_BODY_PLACEHOLDER"
  | "BUTTON_GENERATE_PPT"
  | "LABEL_GENERATING_PPT"
  | "ERROR_PPT_GENERATION"
  | "ERROR_PPT_JSON_PARSE"
  | "BUTTON_HELP_TOOLTIP"
  | "HELP_MODAL_TITLE"
  | "HELP_MODAL_INTRO_TITLE"
  | "HELP_MODAL_INTRO_TEXT"
  | "HELP_MODAL_CLOSE_BUTTON_ARIA_LABEL"
  | "HELP_TOPIC_WHAT_IS_THIS_APP_QUESTION"
  | "HELP_TOPIC_WHAT_IS_THIS_APP_ANSWER"
  | "HELP_TOPIC_DATA_INPUT_TIPS_QUESTION"
  | "HELP_TOPIC_DATA_INPUT_TIPS_ANSWER"
  | "HELP_TOPIC_UNDERSTANDING_INSIGHTS_QUESTION"
  | "HELP_TOPIC_UNDERSTANDING_INSIGHTS_ANSWER"
  | "HELP_TOPIC_PPT_GENERATION_QUESTION"
  | "HELP_TOPIC_PPT_GENERATION_ANSWER"
  | "LABEL_GOOGLE_CLIENT_ID_CONFIG_WARNING"
  | "PROMPT_GOOGLE_ADS_CUSTOMER_ID"
  | "PROMPT_GA4_PROPERTY_ID"
  | "ERROR_GOOGLE_AUTH"
  | "ERROR_GOOGLE_AUTH_PERMISSION_DENIED"
  | "ERROR_GOOGLE_API"
  | "LABEL_META_APP_ID_CONFIG_WARNING"
  | "ERROR_META_AUTH"
  | "ERROR_META_API"
  | "ERROR_META_HTTPS_REQUIRED";

// --- Help System Types ---
export interface HelpTopic {
  id: string;
  questionKey: UIStringKeys; 
  answerKey: UIStringKeys;   
}