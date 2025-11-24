

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
  MOTORTEC_REPORT_TEMPLATE = "Motortec Report Template (IFEMA)"
}

export interface AggregatedDataBlock {
  id: string; 
  source: DataSource;
  timePeriodSelection: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
  kpis: string;
}

export interface ApiConnection {
  source: DataSource;
  data: any; 
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
  // Fields for reconstructing state (optional, but helpful for history)
  rawBlocks?: AggregatedDataBlock[];
  apiConnections?: ApiConnection[];
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

export enum StructuredCampaignPlatform {
  GOOGLE_ADS = "Google Ads",
  META_ADS = "Meta Ads",
}

export enum TimePeriod {
  DAYS_7 = "7",
  DAYS_14 = "14",
  DAYS_30 = "30",
  DAYS_90 = "90",
  CUSTOM = "CUSTOM",
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  primaryMetricName: string; 
  primaryMetricValue: number;
}

export interface CampaignGoals {
  targetCPA?: number;
  targetCTR?: number; 
  targetCVR?: number; 
}

export interface StructuredInsightRequest {
  platform: StructuredCampaignPlatform;
  timePeriod: TimePeriod;
  currentMetrics: CampaignMetrics;
  previousMetrics?: CampaignMetrics; 
  campaignGoals?: CampaignGoals; 
  startDate?: string; 
  endDate?: string;   
}

export enum Language {
  EN = "English",
  ES = "Español",
}

// --- History Types ---

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'aggregated' | 'structured';
  clientName: string; // Display title
  previewText: string; // Subtitle context
  data: InsightRequest | StructuredInsightRequest;
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
  KPI_GRID = "kpiGrid", // NEW: Visual Grid Layout
  TWO_COLUMN = "twoColumn", // NEW: Two Column Text Layout
  DETAILED_ANALYSIS = "detailedAnalysis",     
  CONCLUSIONS_RECOMMENDATIONS = "conclusionsRecommendations", 
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
  
  // For KPI Grid
  kpis?: KpiItem[];                           
  
  // For KPI Highlights (Legacy list style)
  kpiHighlightSections?: KpiHighlightSection[];
  
  // For standard analysis
  analysisTitle?: string;                     
  analysisPoints?: string[];
  
  // For Two Column Layout
  leftColumnTitle?: string;
  leftColumnPoints?: string[];
  rightColumnTitle?: string;
  rightColumnPoints?: string[];

  conclusions?: string[];                     
  recommendations?: string[];                 
  imageIdentifier?: string;                   
  creativeName?: string; 
  annexContent?: string; 
}

// --- Types for Motortec Report Template ---
export interface MotortecSlide1Title {
  pageNumber?: string; 
  reportName?: string; 
  eventDate?: string; 
  fixedHeaderText?: string; 
}

export interface MotortecSlide2Agenda {
  pageNumber?: string; 
  pageTitle?: string; 
  agendaItems?: string[]; 
}

export interface MotortecObjective {
  title: string; 
  description: string; 
}
export interface MotortecSlide3ObjectivesResults {
  pageNumber?: string; 
  fixedHeaderText?: string; 
  mainTitlePart1?: string; 
  mainTitlePart2?: string; 
  objectives?: MotortecObjective[]; 
  resultsTitle?: string; 
  resultsPoints?: string[];
}

export interface MotortecKpiValue { label: string; value: string; }
export interface MotortecDonutChartItem { name: string; value: string; }
export interface MotortecSlide4KPICharts {
  pageNumber?: string; 
  pageTitle?: string; 
  headerKpis?: MotortecKpiValue[]; 
  mvpCampaignTitle?: string; 
  mvpCampaignQuestion?: string;
  mvpCampaignCharts?: MotortecDonutChartItem[]; 
  invisibleNetworkTitle?: string; 
  invisibleNetworkQuestion?: string;
  invisibleNetworkCharts?: MotortecDonutChartItem[]; 
  cmSobreCampañaText?: string;
}

export interface MotortecSlide5ComparativeCharts {
    pageNumber?: string; 
    pageTitle?: string; 
    totalConversionsText?: string; 
    loNuestroTitle?: string; 
    loNuestroCampaignName?: string; 
    loNuestroQuestion?: string;
    loNuestroCharts?: MotortecDonutChartItem[]; 
    loDeTodosTitle?: string; 
    loDeTodosCampaignName?: string; 
    loDeTodosQuestion?: string;
    loDeTodosCharts?: MotortecDonutChartItem[]; 
}

export interface MotortecSlide6PlatformDivider {
    pageNumber?: string; 
    fixedHeaderText?: string; 
    pageTitle?: string; 
    analysisPoints?: string[]; 
}

export interface MotortecDemographicChart {
    chartTitle: string; 
    items: Array<{label: string; value?: number; color?: string}>; 
}
export interface MotortecSlide7DemographicsCreative {
    pageNumber?: string; 
    mainTitle?: string; 
    subTitle?: string; 
    creativeImageIdentifier?: string; 
    charts?: MotortecDemographicChart[];
}

export interface MotortecGlobalResultsKpi { kpiName: string; value: string; change?: string; }
export interface MotortecRegionalTable { regionName: string; kpis: Array<{name: string; value: string;}> }
export interface MotortecChannelsTableItem { channelName: string; kpis: Array<{name: string; value: string;}> }
export interface MotortecSlide8Consideracion {
    pageNumber?: string; 
    pageTitle?: string; 
    globalResults?: {
        mainKpis: MotortecGlobalResultsKpi[]; 
        regionalTables: MotortecRegionalTable[]; 
    };
    channelsTable?: {
        headers: string[]; 
        items: MotortecChannelsTableItem[]; 
    };
    insightsPoints?: string[];
}

export interface MotortecSlide9Conversion extends MotortecSlide8Consideracion { }

export interface MotortecCreativeGalleryItem {
    imageIdentifier: string; 
    registros?: string; 
    ctr?: string; 
    inversionPercent?: string; 
}
export interface MotortecSlide10CreativeAnalysisMeta {
    pageTitle?: string; 
    creatives: MotortecCreativeGalleryItem[];
    analysisPoints: string[];
}

export interface MotortecOrganicObjective { title: string; kpiPoints: string[]; }
export interface MotortecSlide11Organico {
    pageNumber?: string; 
    pageTitle?: string; 
    reelsImageIdentifier?: string; 
    objectives: MotortecOrganicObjective[]; 
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
}


export interface PresentationData {
  presentationTitle: string;                  
  clientName?: string;                        
  period?: string;                            
  language: Language;                         
  brandStyle: BrandStyle;                     
  slides?: SlideContent[]; 
  motortecReportContent?: MotortecReportContent; 
}

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
  | "LABEL_CAMPAIGN_GOALS_SECTION"
  | "LABEL_TARGET_CPA"
  | "LABEL_TARGET_CTR"
  | "LABEL_TARGET_CVR"
  | "LABEL_IMPRESSIONS"
  | "LABEL_CLICKS"
  | "LABEL_CONVERSIONS"
  | "LABEL_PRIMARY_METRIC_NAME"
  | "LABEL_PRIMARY_METRIC_VALUE"
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
  | "HELP_TOPIC_EXCEL_GUIDE_QUESTION"
  | "HELP_TOPIC_EXCEL_GUIDE_ANSWER"
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
  | "ERROR_META_HTTPS_REQUIRED"
  | "TIME_PERIOD_7_DAYS"
  | "TIME_PERIOD_14_DAYS"
  | "TIME_PERIOD_30_DAYS"
  | "TIME_PERIOD_90_DAYS"
  | "TIME_PERIOD_CUSTOM"
  | "BUTTON_HISTORY_TOOLTIP"
  | "HISTORY_PANEL_TITLE"
  | "HISTORY_TAB_AGGREGATED"
  | "HISTORY_TAB_STRUCTURED"
  | "HISTORY_EMPTY_STATE"
  | "HISTORY_ITEM_DELETE_TOOLTIP"
  | "HISTORY_ITEM_LOAD_BUTTON"
  | "HISTORY_CLEAR_ALL";

export interface HelpTopic {
  id: string;
  questionKey: UIStringKeys; 
  answerKey: UIStringKeys;   
}