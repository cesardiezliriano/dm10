import PptxGenJS from 'pptxgenjs';
import {
    PresentationData,
    SlideContent,
    SlideType,
    KpiItem,
    Language,
    UploadedImage,
    KpiHighlightSection,
    BrandStyle,
    MotortecReportContent,
    MotortecSlide1Title,
    MotortecSlide2Agenda,
    MotortecSlide3ObjectivesResults,
    MotortecObjective,
    MotortecSlide4KPICharts,
    MotortecDonutChartItem,
    MotortecSlide5ComparativeCharts,
    MotortecSlide6PlatformDivider,
    MotortecSlide7DemographicsCreative,
    MotortecDemographicChart,
    MotortecSlide8Consideracion,
    MotortecGlobalResultsKpi,
    MotortecRegionalTable,
    MotortecChannelsTableItem,
    MotortecSlide9Conversion,
    MotortecSlide10CreativeAnalysisMeta,
    MotortecCreativeGalleryItem,
    MotortecSlide11Organico,
    MotortecOrganicObjective
} from '../types.ts';
import { getText } from '../constants.ts';


// Helper to add a text object, handles undefined text gracefully
export const addTextSafely = (slide: PptxGenJS.Slide, text: string | undefined | string[] | PptxGenJS.TextProps[], options: PptxGenJS.TextPropsOptions) => {
    if (text && (!Array.isArray(text) || text.length > 0)) {
        const textContent = (Array.isArray(text) && typeof text[0] === 'string') ? text.join('\n') : text;
        if (typeof textContent === 'string' && textContent.trim()) {
            const finalOptions = {...options};
            slide.addText(textContent as string, finalOptions);
        } else if (Array.isArray(textContent) && textContent.length > 0) { // For array of TextProps
             slide.addText(textContent as PptxGenJS.TextProps[], options);
        }
    }
};

// --- Brand Definitions ---

// LLYC Brand
const LLYC_RED = "F54963";
const LLYC_AZUL_OSCURO = "0A263B";
const LLYC_TURQUESA = "36A7B7";
const LLYC_BLANCO = "FFFFFF";
const LLYC_GRIS_01 = "6D7475";
const LLYC_GRIS_02 = "878E90";
const LLYC_GRIS_03 = "ACB4B6";
const LLYC_MENTA = "76CC9B";
const LLYC_HEADLINE_FONT = "Montserrat";
const LLYC_BODY_FONT = "Open Sans";

// IFEMA MADRID Brand (approximated from guide)
const IFEMA_AZUL_PROFUNDO = "171736";
const IFEMA_AZUL = "292152";
const IFEMA_CORAL = "E32424";
const IFEMA_NARANJA = "EB4F2A";
const IFEMA_BLANCO = "FFFFFF";
const IFEMA_LAVANDA = "8322FA";
const IFEMA_CELESTE = "70BFE3";
const IFEMA_MANDARINA = "FF660F";
const IFEMA_AMBAR = "FFC405";
const IFEMA_GRIS_TEXTO_CUERPO = "333333";
const IFEMA_GRIS_03 = "ACB4B6";
const IFEMA_HEADLINE_FONT = "Montserrat";
const IFEMA_BODY_FONT = "Open Sans";

// Motortec Specifics (from PDF)
const MOTORTEC_DARK_BLUE = "201D4B"; // Dark purple/blue from Motortec PDF
const MOTORTEC_TEXT_ON_DARK = IFEMA_BLANCO;
const MOTORTEC_CORAL_BACKGROUND = "EA4F2A"; // Main red/orange from Motortec PDF
const MOTORTEC_TEXT_ON_CORAL_PRIMARY = IFEMA_BLANCO;
const MOTORTEC_TEXT_ON_CORAL_SECONDARY = "1E1A4F"; // Dark blue for sub-text on coral
const MOTORTEC_YELLOW = "F7D050"; // Accent yellow from Motortec PDF (approximated)
const MOTORTEC_LOGO_PLACEHOLDER = "https://via.placeholder.com/100x34/FFFFFF/E32424?Text=IFEMA+MADRID"; // Placeholder with IFEMA styling

interface BrandScheme {
    primary: string; secondary: string; accent: string; backgroundDark: string; backgroundLight: string;
    textOnDark: string; textOnLightHeadline: string; textOnLightBody: string; textOnLightSubtle: string;
    positiveChange: string; negativeChange: string; headlineFont: string; bodyFont: string;
    masterTitle: string; masterContent: string; masterSectionDivider: string;
    logoText?: string; logoPlaceholderText?: string;
    footerText?: (lang: Language, clientName?: string, period?: string) => string;
    tagline?: (lang: Language) => string | undefined;
    bulletColor: string; kpiHighlightOvalFill: string; kpiHighlightTitleColor: string;
    conclusionBulletColor: string; recommendationBulletColor: string;
    tableHeaderFill: string; tableHeaderFontColor: string; tableCellBorderColor: string;
}

const BRAND_SCHEMES: Record<BrandStyle, BrandScheme> = {
    [BrandStyle.LLYC_DEFAULT]: {
        primary: LLYC_RED, secondary: LLYC_TURQUESA, accent: LLYC_MENTA, backgroundDark: LLYC_AZUL_OSCURO,
        backgroundLight: LLYC_BLANCO, textOnDark: LLYC_BLANCO, textOnLightHeadline: LLYC_AZUL_OSCURO,
        textOnLightBody: LLYC_GRIS_01, textOnLightSubtle: LLYC_GRIS_02, positiveChange: LLYC_MENTA,
        negativeChange: LLYC_RED, headlineFont: LLYC_HEADLINE_FONT, bodyFont: LLYC_BODY_FONT,
        masterTitle: "LLYC_MASTER_TITLE_SLIDE", masterContent: "LLYC_MASTER_CONTENT_SLIDE",
        masterSectionDivider: "LLYC_MASTER_SECTION_DIVIDER_DARK", logoText: "LLYC",
        footerText: (lang, client, period) => `${client || (lang === Language.ES ? "Cliente LLYC" : "LLYC Client")} | ${period || (lang === Language.ES ? "Periodo Analizado" : "Analyzed Period")}`,
        tagline: (lang) => lang === Language.ES ? "ANTICÍPATE." : "ANTICIPATE.", bulletColor: LLYC_RED,
        kpiHighlightOvalFill: LLYC_RED, kpiHighlightTitleColor: LLYC_AZUL_OSCURO,
        conclusionBulletColor: LLYC_TURQUESA, recommendationBulletColor: LLYC_MENTA,
        tableHeaderFill: LLYC_GRIS_03, tableHeaderFontColor: LLYC_AZUL_OSCURO, tableCellBorderColor: LLYC_GRIS_03,
    },
    [BrandStyle.IFEMA_MADRID]: {
        primary: IFEMA_CORAL, secondary: IFEMA_NARANJA, accent: IFEMA_AZUL, backgroundDark: IFEMA_AZUL_PROFUNDO,
        backgroundLight: IFEMA_BLANCO, textOnDark: IFEMA_BLANCO, textOnLightHeadline: IFEMA_AZUL_PROFUNDO,
        textOnLightBody: IFEMA_GRIS_TEXTO_CUERPO, textOnLightSubtle: "#666666", positiveChange: IFEMA_CELESTE,
        negativeChange: IFEMA_CORAL, headlineFont: IFEMA_HEADLINE_FONT, bodyFont: IFEMA_BODY_FONT,
        masterTitle: "IFEMA_MASTER_TITLE_SLIDE", masterContent: "IFEMA_MASTER_CONTENT_SLIDE",
        masterSectionDivider: "IFEMA_MASTER_SECTION_DIVIDER_DARK", logoPlaceholderText: "IFEMA MADRID",
        footerText: (lang) => `IFEMA MADRID. ${lang === Language.ES ? "Guía de identidad de marca." : "Brand Identity Guide."}`,
        tagline: undefined, bulletColor: IFEMA_CORAL, kpiHighlightOvalFill: IFEMA_NARANJA,
        kpiHighlightTitleColor: IFEMA_AZUL_PROFUNDO, conclusionBulletColor: IFEMA_AZUL,
        recommendationBulletColor: IFEMA_LAVANDA, tableHeaderFill: IFEMA_AZUL_PROFUNDO,
        tableHeaderFontColor: IFEMA_BLANCO, tableCellBorderColor: IFEMA_GRIS_03,
    },
    [BrandStyle.MOTORTEC_REPORT_TEMPLATE]: {
        primary: MOTORTEC_CORAL_BACKGROUND, secondary: IFEMA_NARANJA, accent: MOTORTEC_YELLOW,
        backgroundDark: MOTORTEC_DARK_BLUE, backgroundLight: IFEMA_BLANCO, textOnDark: MOTORTEC_TEXT_ON_DARK,
        textOnLightHeadline: MOTORTEC_TEXT_ON_CORAL_PRIMARY, textOnLightBody: IFEMA_GRIS_TEXTO_CUERPO,
        textOnLightSubtle: MOTORTEC_TEXT_ON_CORAL_SECONDARY, positiveChange: IFEMA_CELESTE,
        negativeChange: MOTORTEC_CORAL_BACKGROUND, headlineFont: IFEMA_HEADLINE_FONT,
        bodyFont: IFEMA_BODY_FONT, masterTitle: "MOTORTEC_SLIDE", masterContent: "MOTORTEC_SLIDE",
        masterSectionDivider: "MOTORTEC_SLIDE", logoPlaceholderText: "IFEMA MADRID",
        footerText: () => `IFEMA MADRID`, tagline: undefined, bulletColor: MOTORTEC_CORAL_BACKGROUND,
        kpiHighlightOvalFill: IFEMA_NARANJA, kpiHighlightTitleColor: MOTORTEC_TEXT_ON_CORAL_PRIMARY,
        conclusionBulletColor: IFEMA_AZUL, recommendationBulletColor: IFEMA_LAVANDA,
        tableHeaderFill: MOTORTEC_DARK_BLUE, tableHeaderFontColor: MOTORTEC_TEXT_ON_DARK,
        tableCellBorderColor: IFEMA_GRIS_03,
    }
};

const PAGE_WIDTH_IN = 10;
const PAGE_HEIGHT_IN = 5.625;
const MARGIN_SIDE_IN = 0.35;
const MARGIN_TOP_IN = 0.3;
const MARGIN_BOTTOM_IN = 0.3;
const CONTENT_WIDTH_IN = PAGE_WIDTH_IN - (2 * MARGIN_SIDE_IN);

const getImageDataUrl = (imageIdentifier: string | undefined, uploadedCreatives?: UploadedImage[]): string => {
    if (!imageIdentifier) return `https://via.placeholder.com/300x200?text=No+ID`;
    const creative = uploadedCreatives?.find(c => c.name === imageIdentifier);
    return creative?.dataUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(imageIdentifier.substring(0,20))}`;
};

// --- Motortec Template Specific Slide Generation Functions ---

const _addMotortecSlide1_Title = (pres: PptxGenJS, data?: MotortecSlide1Title, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "01", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_DARK, width: 1 }});
    addTextSafely(slide, data?.fixedHeaderText, { x: PAGE_WIDTH_IN - 2.5, y: 0.3, w: 2.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_DARK, align: "right" });
    addTextSafely(slide, data?.reportName, { x: 0.5, y: 1.8, w: 8.0, h: 1.0, fontFace: scheme?.headlineFont, fontSize: 54, bold: true, color: MOTORTEC_TEXT_ON_DARK });
    addTextSafely(slide, data?.eventDate, { x: 0.5, y: PAGE_HEIGHT_IN - 0.9, w: 3.0, h: 0.4, fontFace: scheme?.bodyFont, fontSize: 16, color: MOTORTEC_TEXT_ON_DARK });
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.9, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 1 (Title)");
};

const _addMotortecSlide2_Agenda = (pres: PptxGenJS, data?: MotortecSlide2Agenda, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "02", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_DARK, width: 1 }});
    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: 1.2, w: 8.0, h: 0.8, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_TEXT_ON_DARK });
    if (data?.agendaItems && data.agendaItems.length > 0) {
        const agendaTextProps: PptxGenJS.TextProps[] = data.agendaItems.map(item => ({
            text: item, // item is a string
            options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 12, color: MOTORTEC_TEXT_ON_DARK, bullet: { type: 'bullet', characterCode: '25A1' /* □ */ } }
        }));
        addTextSafely(slide, agendaTextProps, { x: 0.7, y: 2.2, w: 7.0, h: 2.8, valign: 'top', lineSpacing: 24 });
    }
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 2 (Agenda)");
};

const _addMotortecSlide3_ObjectivesResults = (pres: PptxGenJS, data?: MotortecSlide3ObjectivesResults, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "03", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_DARK, width: 1 }});
    addTextSafely(slide, data?.fixedHeaderText, { x: PAGE_WIDTH_IN - 2.8, y: 0.3, w: 2.3, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_DARK, align: "right" });

    addTextSafely(slide, data?.mainTitlePart1, { x: 0.5, y: 1.5, w: 4.0, h: 1.2, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_CORAL_BACKGROUND });
    addTextSafely(slide, data?.mainTitlePart2, { x: 0.5, y: 2.5, w: 4.0, h: 1.2, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_YELLOW });

    let yPosObjective = 0.8;
    data?.objectives?.forEach((obj: MotortecObjective, index: number) => {
        addTextSafely(slide, obj.title, { x: 5.0, y: yPosObjective, w: 4.5, h: 0.4, fontFace: scheme?.headlineFont, fontSize: 14, bold: true, color: MOTORTEC_TEXT_ON_DARK });
        yPosObjective += 0.4;
        addTextSafely(slide, obj.description, { x: 5.0, y: yPosObjective, w: 4.5, h: 0.6, fontFace: scheme?.bodyFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK, lineSpacing: 14 });
        yPosObjective += (obj.description.length > 100 ? 1.0 : 0.8); // Adjust spacing
    });

    addTextSafely(slide, data?.resultsTitle, { x: 5.0, y: yPosObjective, w: 4.5, h: 0.4, fontFace: scheme?.headlineFont, fontSize: 16, bold: true, color: MOTORTEC_YELLOW });
    yPosObjective += 0.5;
    if (data?.resultsPoints && data.resultsPoints.length > 0) {
        const resultsTextProps: PptxGenJS.TextProps[] = data.resultsPoints.map(point => ({
            text: point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK, bullet: true, lineSpacing: 14 }
        }));
        addTextSafely(slide, resultsTextProps, { x: 5.2, y: yPosObjective, w: 4.3, h: 1.5 });
    }
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 3 (Objectives/Results)");
};

const _addMotortecSlide4_KPICharts = (pres: PptxGenJS, data?: MotortecSlide4KPICharts, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_CORAL_BACKGROUND };
    addTextSafely(slide, data?.pageNumber || "04", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, width: 1 }});
    addTextSafely(slide, data?.pageTitle, { x: 3.0, y: 0.5, w: 6.5, h: 0.8, fontFace: scheme?.headlineFont, fontSize: 28, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center" });

    // KPI Table
    const tableData = data?.headerKpis?.map(kpi => [kpi.label, kpi.value]) || [];
    if (tableData.length > 0) {
        const transposedData = tableData[0].map((_, colIndex) => tableData.map(row => row[colIndex]));
        slide.addTable(transposedData.map(row => row.map(cell => ({text: cell}))), {
            x: 0.5, y: 1.4, w: 9.0, h: 0.8,
            colW: data?.headerKpis?.map(() => 9.0 / (data.headerKpis?.length || 1)) || [1.5],
            border: { type: "none" },
            autoPage: false,
            fontFace: scheme?.bodyFont, fontSize: 10, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY,
            fill: { color: IFEMA_BLANCO }, // Light background for table cells
            valign: "middle", align: "center"
        });
    }

    // MVP Campaign Charts (Donut approximations)
    addTextSafely(slide, data?.mvpCampaignTitle, { x: 0.5, y: 2.5, w: 4.0, h: 0.3, fontFace: scheme?.headlineFont, bold: true, fontSize: 14, color: MOTORTEC_DARK_BLUE });
    addTextSafely(slide, data?.mvpCampaignQuestion, { x: 0.5, y: 2.8, w: 4.0, h: 0.4, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_DARK_BLUE });
    let chartX = 0.7;
    data?.mvpCampaignCharts?.forEach(chartItem => {
        slide.addShape(PptxGenJS.ShapeType.donut, { x: chartX, y: 3.3, w: 1.0, h: 1.0, fill: { color: IFEMA_BLANCO }, line: { color: MOTORTEC_DARK_BLUE, width: 2 } });
        addTextSafely(slide, chartItem.value, { x: chartX, y: 3.55, w: 1.0, h: 0.5, fontFace: scheme?.headlineFont, fontSize: 12, bold:true, color: MOTORTEC_DARK_BLUE, align: "center" });
        addTextSafely(slide, chartItem.name, { x: chartX, y: 4.35, w: 1.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_DARK_BLUE, align: "center" });
        chartX += 1.3;
    });

    // Invisible Network Charts
    addTextSafely(slide, data?.invisibleNetworkTitle, { x: 5.5, y: 2.5, w: 4.0, h: 0.3, fontFace: scheme?.headlineFont, bold: true, fontSize: 14, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    addTextSafely(slide, data?.invisibleNetworkQuestion, { x: 5.5, y: 2.8, w: 4.0, h: 0.4, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    chartX = 5.0; // Reset for this section
    let chartY = 3.3;
    data?.invisibleNetworkCharts?.forEach((chartItem, index) => {
        if (index > 0 && index % 3 === 0) { chartX = 5.0; chartY += 1.3; } // New row
        slide.addShape(PptxGenJS.ShapeType.ellipse, { x: chartX, y: chartY, w: 0.8, h: 0.8, fill: { color: IFEMA_BLANCO } }); // Simpler circles
        addTextSafely(slide, chartItem.value, { x: chartX, y: chartY + 0.2, w: 0.8, h: 0.4, fontFace: scheme?.headlineFont, fontSize: 10, bold:true, color: MOTORTEC_DARK_BLUE, align: "center" });
        addTextSafely(slide, chartItem.name, { x: chartX - 0.1, y: chartY + 0.85, w: 1.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 8, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center" });
        chartX += 1.0;
    });

    addTextSafely(slide, data?.cmSobreCampañaText, { x: 0.5, y: PAGE_HEIGHT_IN - 0.9, w: 4.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 10, color: MOTORTEC_DARK_BLUE });
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 4 (KPI Charts)");
};

const _addMotortecSlide5_ComparativeCharts = (pres: PptxGenJS, data?: MotortecSlide5ComparativeCharts, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_CORAL_BACKGROUND };
    addTextSafely(slide, data?.pageNumber || "05", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, width: 1 }});

    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: 0.8, w: 4.0, h: 1.5, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, lineSpacing: 38 });
    addTextSafely(slide, data?.totalConversionsText, { x: 6.0, y: 0.8, w: 3.5, h: 0.5, fontFace: scheme?.headlineFont, fontSize: 18, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "right" });

    // Lo Nuestro
    addTextSafely(slide, data?.loNuestroTitle, { x: 0.5, y: 2.5, w: 2.0, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 14, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    addTextSafely(slide, data?.loNuestroCampaignName, { x: 0.5, y: 2.8, w: 3.5, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY });
    addTextSafely(slide, data?.loNuestroQuestion, { x: 0.5, y: 3.1, w: 3.5, h: 0.3, fontFace: scheme?.bodyFont, italic: true, fontSize: 8, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY });
    let chartX = 0.7;
    data?.loNuestroCharts?.forEach(chartItem => {
        slide.addShape(PptxGenJS.ShapeType.ellipse, { x: chartX, y: 3.5, w: 1.0, h: 1.0, fill: { color: IFEMA_BLANCO } });
        addTextSafely(slide, chartItem.value, { x: chartX, y: 3.75, w: 1.0, h: 0.5, fontFace: scheme?.headlineFont, fontSize: 12, bold:true, color: MOTORTEC_DARK_BLUE, align: "center" });
        addTextSafely(slide, chartItem.name, { x: chartX, y: 4.55, w: 1.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY, align: "center" });
        chartX += 1.3;
    });

    addTextSafely(slide, "VS", { x: 4.5, y: 3.6, w: 1.0, h: 1.0, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center"});

    // Lo de Todos
    addTextSafely(slide, data?.loDeTodosTitle, { x: 6.0, y: 2.5, w: 2.0, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 14, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    addTextSafely(slide, data?.loDeTodosCampaignName, { x: 6.0, y: 2.8, w: 3.5, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY });
    addTextSafely(slide, data?.loDeTodosQuestion, { x: 6.0, y: 3.1, w: 3.5, h: 0.3, fontFace: scheme?.bodyFont, italic: true, fontSize: 8, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY });
    chartX = 6.2;
    data?.loDeTodosCharts?.forEach(chartItem => {
        slide.addShape(PptxGenJS.ShapeType.ellipse, { x: chartX, y: 3.5, w: 1.0, h: 1.0, fill: { color: IFEMA_BLANCO } });
        addTextSafely(slide, chartItem.value, { x: chartX, y: 3.75, w: 1.0, h: 0.5, fontFace: scheme?.headlineFont, fontSize: 12, bold:true, color: MOTORTEC_DARK_BLUE, align: "center" });
        addTextSafely(slide, chartItem.name, { x: chartX, y: 4.55, w: 1.0, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY, align: "center" });
        chartX += 1.3;
    });

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 5 (Comparative Charts)");
};

const _addMotortecSlide6_PlatformDivider = (pres: PptxGenJS, data?: MotortecSlide6PlatformDivider, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "06", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_DARK });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_DARK, width: 1 }});
    addTextSafely(slide, data?.fixedHeaderText, { x: PAGE_WIDTH_IN - 2.8, y: 0.3, w: 2.3, h: 0.3, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_DARK, align: "right" });
    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: PAGE_HEIGHT_IN - 1.5, w: 4.0, h: 0.8, fontFace: scheme?.headlineFont, fontSize: 36, bold: true, color: MOTORTEC_TEXT_ON_DARK });

    let yPos = 0.8;
    data?.analysisPoints?.forEach(point => {
        addTextSafely(slide, point, { x: 5.0, y: yPos, w: 4.5, h: 0.5, fontFace: scheme?.headlineFont, fontSize: 16, bold: true, color: MOTORTEC_TEXT_ON_DARK });
        yPos += 1.2;
    });
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 6 (Platform Divider)");
};

const _addMotortecSlide7_DemographicsCreative = (pres: PptxGenJS, data?: MotortecSlide7DemographicsCreative, scheme?: BrandScheme, uploadedCreatives?: UploadedImage[]) => {
    const slide = pres.addSlide();
    // Left side with coral background
    slide.addShape(PptxGenJS.ShapeType.rect, { x:0, y:0, w: '40%', h:'100%', fill: {color: MOTORTEC_CORAL_BACKGROUND}});
    addTextSafely(slide, data?.pageNumber || "07", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, width: 1 }});
    addTextSafely(slide, data?.mainTitle, { x: 0.5, y: 1.2, w: 3.5, h: 1.5, fontFace: scheme?.headlineFont, fontSize: 28, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, lineSpacing: 30 });
    addTextSafely(slide, data?.subTitle, { x: 0.5, y: 3.8, w: 3.5, h: 1.0, fontFace: scheme?.headlineFont, fontSize: 28, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, lineSpacing: 30 });

    // Right side with dark blue background
    slide.addShape(PptxGenJS.ShapeType.rect, { x:'40%', y:0, w: '60%', h:'100%', fill: {color: MOTORTEC_DARK_BLUE}});
    const creativeImageUrl = getImageDataUrl(data?.creativeImageIdentifier, uploadedCreatives);
    slide.addImage({ path: creativeImageUrl, x: 4.2, y: 0.4, w: 2.4, h: 4.8, sizing: { type: 'contain', w: 2.4, h: 4.8 } });

    // Charts (simplified representation)
    let chartY = 0.5;
    data?.charts?.forEach(chart => {
        addTextSafely(slide, chart.chartTitle, { x: 7.0, y: chartY, w: 2.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, bold:true, color: MOTORTEC_YELLOW, align:"center" });
        chartY += 0.4;
        // Simple placeholder for chart graphic area
        slide.addShape(PptxGenJS.ShapeType.ellipse, {x: 7.75, y: chartY, w:1, h:1, fill: {color: IFEMA_BLANCO, transparency: 80}});
        chartY += 1.2;
        chart.items.forEach(item => {
            addTextSafely(slide, `□ ${item.label}`, { x: 7.2, y: chartY, w: 2.3, h: 0.2, fontFace: scheme?.bodyFont, fontSize: 8, color: MOTORTEC_TEXT_ON_DARK });
            chartY += 0.25;
        });
        chartY += 0.3; // Spacing between charts
    });

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 7 (Demographics/Creative)");
};

const _addMotortecSlide8_Consideracion = (pres: PptxGenJS, data?: MotortecSlide8Consideracion, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "08", { x: 0.5, y: 0.3, w: 4.0, h: 0.4, fontFace: scheme?.headlineFont, fontSize: 24, bold: true, color: MOTORTEC_CORAL_BACKGROUND });
    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: 0.8, w: 4.0, h: 1.5, fontFace: scheme?.headlineFont, fontSize: 22, bold: true, color: MOTORTEC_TEXT_ON_DARK, lineSpacing: 24 });

    // Yellow circle for "1"
    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 5.0, y: 0.3, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "1", {x: 5.0, y:0.3, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Resultados globales", {x:6.0, y:0.5, w:3.5, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});

    // Global Results KPIs
    let kpiX = 5.5;
    data?.globalResults?.mainKpis.forEach(kpi => {
        slide.addShape(PptxGenJS.ShapeType.rect, {x: kpiX - 0.1, y: 1.0, w:1.3, h:0.6, fill:{color:MOTORTEC_TEXT_ON_DARK, transparency:85}});
        addTextSafely(slide, kpi.kpiName.toUpperCase(), {x:kpiX, y:1.05, w:1.1, h:0.2, fontFace:scheme?.bodyFont, fontSize:8, color:MOTORTEC_TEXT_ON_DARK, align:'center'});
        addTextSafely(slide, kpi.value, {x:kpiX, y:1.25, w:1.1, h:0.3, fontFace:scheme?.headlineFont, fontSize:12, bold:true, color:MOTORTEC_TEXT_ON_DARK, align:'center'});
        if(kpi.change) addTextSafely(slide, kpi.change, {x:kpiX, y:0.85, w:1.1, h:0.2, fontFace:scheme?.bodyFont, fontSize:7, color:kpi.change.startsWith('+') ? IFEMA_CELESTE: IFEMA_CORAL, align:'center'});
        kpiX += 1.5;
    });

    // Regional Tables (simplified)
    let tableY = 1.8;
    data?.globalResults?.regionalTables.forEach(region => {
        addTextSafely(slide, region.regionName, {x:5.5, y:tableY, w:1.5, h:0.2, fontFace:scheme?.headlineFont, fontSize:9, bold:true, color:MOTORTEC_TEXT_ON_DARK});
        let regionKpiX = 7.0;
        region.kpis.forEach(kpi => {
            addTextSafely(slide, `${kpi.name.toUpperCase()}: ${kpi.value}`, {x:regionKpiX, y:tableY, w:1.0, h:0.2, fontFace:scheme?.bodyFont, fontSize:8, color:MOTORTEC_TEXT_ON_DARK});
            regionKpiX += 1.2;
        });
        tableY += 0.3;
    });

    // Yellow circle for "2"
    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 5.0, y: tableY + 0.3, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "2", {x: 5.0, y:tableY + 0.3, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Canales", {x:6.0, y:tableY + 0.5, w:3.5, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});
    tableY += 1.0;

    // Channels Table
    if (data?.channelsTable?.items) {
        const channelsTableRows = [data.channelsTable.headers];
        data.channelsTable.items.forEach(item => {
            const row = [item.channelName];
            item.kpis.forEach(kpi => row.push(kpi.value));
            channelsTableRows.push(row);
        });
        slide.addTable(channelsTableRows.map(row => row.map(cell => ({text: cell}))), {
            x:5.5, y:tableY, w:4.0,
            colW: [1, 0.8, 0.8, 0.8, 0.6],
            border: { type:'none' }, autoPage:false,
            fontFace:scheme?.bodyFont, fontSize:8, color: MOTORTEC_TEXT_ON_DARK,
            alternateRowColors: [MOTORTEC_DARK_BLUE, '2A275B'] // Slightly different dark blues
        });
        // Custom header styling for channels table
        const headerRow = channelsTableRows[0];
        headerRow.forEach((text, colIdx) => {
            addTextSafely(slide, text, {
                x: 5.5 + (colIdx * (colIdx === 0 ? 1 : 0.8)),
                y: tableY - 0.25, // Position above the table
                w: (colIdx === 0 ? 1 : 0.8), h: 0.2,
                fontFace: scheme?.headlineFont, fontSize:7, bold:true, color:MOTORTEC_YELLOW, align:'center'
            });
        });
    }
    tableY += (data?.channelsTable?.items.length || 0) * 0.3 + 0.4;


    // Yellow circle for "3"
    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 0.5, y: tableY, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "3", {x: 0.5, y:tableY, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Insights", {x:1.5, y:tableY + 0.2, w:3.0, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});
    tableY += 0.7;

    if(data?.insightsPoints) {
        const insightsTextProps: PptxGenJS.TextProps[] = data.insightsPoints.map(point => ({
            text: point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 8, color: MOTORTEC_TEXT_ON_DARK, bullet: true, lineSpacing: 12 }
        }));
        addTextSafely(slide, insightsTextProps, { x: 0.7, y: tableY, w: 8.8, h: 1.0 });
    }

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 8 (Consideracion)");
};

const _addMotortecSlide9_Conversion = (pres: PptxGenJS, data?: MotortecSlide9Conversion, scheme?: BrandScheme) => {
    // This slide is very similar to Slide 8, just with different data and titles
    // For brevity, reusing the structure of slide 8 with data replaced.
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_DARK_BLUE };
    addTextSafely(slide, data?.pageNumber || "09", { x: 0.5, y: 0.3, w: 4.0, h: 0.4, fontFace: scheme?.headlineFont, fontSize: 24, bold: true, color: MOTORTEC_CORAL_BACKGROUND });
    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: 0.8, w: 4.0, h: 1.5, fontFace: scheme?.headlineFont, fontSize: 22, bold: true, color: MOTORTEC_TEXT_ON_DARK, lineSpacing: 24 });

    // Yellow circle for "1"
    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 5.0, y: 0.3, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "1", {x: 5.0, y:0.3, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Resultados globales", {x:6.0, y:0.5, w:3.5, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});

    let kpiX = 5.5;
    data?.globalResults?.mainKpis.forEach(kpi => {
        slide.addShape(PptxGenJS.ShapeType.rect, {x: kpiX - 0.1, y: 1.0, w:1.3, h:0.6, fill:{color:MOTORTEC_TEXT_ON_DARK, transparency:85}});
        addTextSafely(slide, kpi.kpiName.toUpperCase(), {x:kpiX, y:1.05, w:1.1, h:0.2, fontFace:scheme?.bodyFont, fontSize:8, color:MOTORTEC_TEXT_ON_DARK, align:'center'});
        addTextSafely(slide, kpi.value, {x:kpiX, y:1.25, w:1.1, h:0.3, fontFace:scheme?.headlineFont, fontSize:12, bold:true, color:MOTORTEC_TEXT_ON_DARK, align:'center'});
        if(kpi.change) addTextSafely(slide, kpi.change, {x:kpiX, y:0.85, w:1.1, h:0.2, fontFace:scheme?.bodyFont, fontSize:7, color:kpi.change.startsWith('+') ? IFEMA_CELESTE: IFEMA_CORAL, align:'center'});
        kpiX += 1.5;
    });

    let tableY = 1.8;
    data?.globalResults?.regionalTables.forEach(region => {
        addTextSafely(slide, region.regionName, {x:5.5, y:tableY, w:1.5, h:0.2, fontFace:scheme?.headlineFont, fontSize:9, bold:true, color:MOTORTEC_TEXT_ON_DARK});
        let regionKpiX = 7.0;
        region.kpis.forEach(kpi => {
            addTextSafely(slide, `${kpi.name.toUpperCase()}: ${kpi.value}`, {x:regionKpiX, y:tableY, w:1.0, h:0.2, fontFace:scheme?.bodyFont, fontSize:8, color:MOTORTEC_TEXT_ON_DARK});
            regionKpiX += 1.2;
        });
        tableY += 0.3;
    });

    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 5.0, y: tableY + 0.3, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "2", {x: 5.0, y:tableY + 0.3, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Canales", {x:6.0, y:tableY + 0.5, w:3.5, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});
    tableY += 1.0;

    if (data?.channelsTable?.items) {
        const channelsTableRows = [data.channelsTable.headers];
        data.channelsTable.items.forEach(item => {
            const row = [item.channelName];
            item.kpis.forEach(kpi => row.push(kpi.value));
            channelsTableRows.push(row);
        });
        slide.addTable(channelsTableRows.map(row => row.map(cell => ({text: cell}))), {
            x:5.5, y:tableY, w:4.0,
            colW: [1, 0.8, 0.8, 0.8],
            border: { type:'none' }, autoPage:false,
            fontFace:scheme?.bodyFont, fontSize:8, color: MOTORTEC_TEXT_ON_DARK,
            alternateRowColors: [MOTORTEC_DARK_BLUE, '2A275B']
        });
        const headerRow = channelsTableRows[0];
        headerRow.forEach((text, colIdx) => {
            addTextSafely(slide, text, {
                x: 5.5 + (colIdx * (colIdx === 0 ? 1 : 0.8)),
                y: tableY - 0.25,
                w: (colIdx === 0 ? 1 : 0.8), h: 0.2,
                fontFace: scheme?.headlineFont, fontSize:7, bold:true, color:MOTORTEC_YELLOW, align:'center'
            });
        });
    }
    tableY += (data?.channelsTable?.items.length || 0) * 0.3 + 0.4;

    slide.addShape(PptxGenJS.ShapeType.ellipse, { x: 0.5, y: tableY, w:0.8, h:0.8, fill:{color:MOTORTEC_YELLOW}});
    addTextSafely(slide, "3", {x: 0.5, y:tableY, w:0.8,h:0.8, align:'center', valign:'middle', fontFace: scheme?.headlineFont, bold:true, fontSize:24, color:MOTORTEC_DARK_BLUE});
    addTextSafely(slide, "Insights", {x:1.5, y:tableY + 0.2, w:3.0, h:0.4, fontFace:scheme?.headlineFont, fontSize:14, bold:true, color:MOTORTEC_TEXT_ON_DARK});
    tableY += 0.7;

    if(data?.insightsPoints) {
        const insightsTextProps: PptxGenJS.TextProps[] = data.insightsPoints.map(point => ({
            text: point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 8, color: MOTORTEC_TEXT_ON_DARK, bullet: true, lineSpacing: 12 }
        }));
        addTextSafely(slide, insightsTextProps, { x: 0.7, y: tableY, w: 8.8, h: 1.0 });
    }

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 9 (Conversion)");
};

const _addMotortecSlide10_CreativeAnalysisMeta = (pres: PptxGenJS, data?: MotortecSlide10CreativeAnalysisMeta, scheme?: BrandScheme, uploadedCreatives?: UploadedImage[]) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_CORAL_BACKGROUND };

    const numCreatives = data?.creatives?.length || 0;
    const creativeWidth = numCreatives > 0 ? (CONTENT_WIDTH_IN * 0.6) / numCreatives : 1.5;
    const creativeHeight = 2.5;
    let currentX = 0.5;

    data?.creatives?.forEach((creative: MotortecCreativeGalleryItem) => {
        const imageUrl = getImageDataUrl(creative.imageIdentifier, uploadedCreatives);
        slide.addImage({ path: imageUrl, x: currentX, y: 0.5, w: creativeWidth, h: creativeHeight, sizing: { type: 'contain', w: creativeWidth, h: creativeHeight } });
        addTextSafely(slide, `Registros: ${creative.registros || 'N/A'}`, { x: currentX, y: 3.1, w: creativeWidth, h: 0.2, fontFace: scheme?.bodyFont, fontSize: 7, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center" });
        addTextSafely(slide, `CTR: ${creative.ctr || 'N/A'}`, { x: currentX, y: 3.3, w: creativeWidth, h: 0.2, fontFace: scheme?.bodyFont, fontSize: 7, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center" });
        addTextSafely(slide, `Inversión: ${creative.inversionPercent || 'N/A'}`, { x: currentX, y: 3.5, w: creativeWidth, h: 0.2, fontFace: scheme?.bodyFont, fontSize: 7, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, align: "center" });
        currentX += creativeWidth + 0.2; // Add some spacing
    });

    const analysisX = (CONTENT_WIDTH_IN * 0.6) + 0.7;
    const analysisW = CONTENT_WIDTH_IN * 0.4 - 0.4;
    addTextSafely(slide, data?.pageTitle, { x: analysisX, y: 0.5, w: analysisW, h: 0.8, fontFace: scheme?.headlineFont, fontSize: 20, bold: true, color: MOTORTEC_DARK_BLUE, lineSpacing:22 });
    if (data?.analysisPoints) {
        const analysisProps: PptxGenJS.TextProps[] = data.analysisPoints.map(point => ({
            text: point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_DARK_BLUE, bullet:true, lineSpacing:14 }
        }));
        addTextSafely(slide, analysisProps, { x: analysisX + 0.1, y: 1.4, w: analysisW - 0.1, h: 3.5 });
    }

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 10 (Creative Analysis Meta)");
};

const _addMotortecSlide11_Organico = (pres: PptxGenJS, data?: MotortecSlide11Organico, scheme?: BrandScheme, uploadedCreatives?: UploadedImage[]) => {
    const slide = pres.addSlide();
    slide.background = { color: MOTORTEC_CORAL_BACKGROUND };
     addTextSafely(slide, data?.pageNumber || "10", { x: 0.5, y: 0.3, w: 0.5, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 10, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    slide.addShape(PptxGenJS.ShapeType.line, { x: 1.0, y: 0.45, w: 1.0, h: 0, line: { color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, width: 1 }});

    // Left side title
    addTextSafely(slide, data?.pageTitle, { x: 0.5, y: 1.0, w: 3.5, h: 2.0, fontFace: scheme?.headlineFont, fontSize: 28, bold: true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY, lineSpacing:30 });

    // Center Reels Image
    const reelsImageUrl = getImageDataUrl(data?.reelsImageIdentifier, uploadedCreatives);
    slide.addImage({ path: reelsImageUrl, x: 3.8, y: 0.5, w: 2.4, h: 4.6, sizing: { type: 'contain', w:2.4, h:4.6 }});

    // Right side objectives and summary
    let yPos = 0.6;
    data?.objectives?.forEach(obj => {
        addTextSafely(slide, obj.title, { x: 6.5, y: yPos, w: 3.0, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 12, bold:true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
        yPos += 0.4;
        if (obj.kpiPoints) {
            const kpiProps: PptxGenJS.TextProps[] = obj.kpiPoints.map(point => ({
                text: "⭐ " + point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY, bullet: false, lineSpacing:13 }
            }));
            addTextSafely(slide, kpiProps, { x: 6.6, y: yPos, w: 2.9, h: 1.0, lineSpacing:13 });
            yPos += (obj.kpiPoints.length * 0.3) + 0.4;
        }
    });

    addTextSafely(slide, "Resumen global", { x: 6.5, y: yPos, w: 3.0, h: 0.3, fontFace: scheme?.headlineFont, fontSize: 12, bold:true, color: MOTORTEC_TEXT_ON_CORAL_PRIMARY });
    yPos += 0.4;
    if (data?.globalSummaryPoints) {
        const summaryProps: PptxGenJS.TextProps[] = data.globalSummaryPoints.map(point => ({
            text: point, options: { breakLine: true, fontFace: scheme?.bodyFont, fontSize: 9, color: MOTORTEC_TEXT_ON_CORAL_SECONDARY, bullet: true }
        }));
        addTextSafely(slide, summaryProps, { x: 6.6, y: yPos, w: 2.9, h: 1.0 });
    }

    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
    console.log("[PPT Service] Added Motortec Slide 11 (Organico)");
};

const _addMotortecThankYouSlide = (pres: PptxGenJS, scheme?: BrandScheme) => {
    const slide = pres.addSlide();
    // Using a slightly different shade or a simple dark blue for the IFEMA thanks
    slide.background = { color: MOTORTEC_DARK_BLUE};
    addTextSafely(slide, "Gracias", { x:0, y:0, w:'100%', h:'90%', align:'center', valign:'middle', fontSize:48, bold:true, color: MOTORTEC_TEXT_ON_DARK, fontFace: scheme?.headlineFont });
    slide.addImage({ path: MOTORTEC_LOGO_PLACEHOLDER, x: PAGE_WIDTH_IN - 1.5, y: PAGE_HEIGHT_IN - 0.8, w: 1.2, h: 0.34 });
};


export const generatePptxFromData = async (
    presentationJson: PresentationData,
    currentLanguage: Language,
    uploadedCreativesData?: UploadedImage[]
): Promise<void> => {
    console.log("[PresentationService] Starting generatePptxFromData. Language:", currentLanguage, "Brand Style:", presentationJson.brandStyle);

    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE'; // 10x5.625 inches

    const brand = BRAND_SCHEMES[presentationJson.brandStyle || BrandStyle.LLYC_DEFAULT];

    // --- Generic Slide Generation Functions (defined within scope to access pres, brand, etc.) ---
    const addTitleSlide = (content: SlideContent, scheme: BrandScheme, overallPresentationTitle: string) => {
        const slide = pres.addSlide({ masterName: scheme.masterTitle });
        const titleText = content.title || overallPresentationTitle || (currentLanguage === Language.ES ? "Informe de Resultados" : "Results Report");
        addTextSafely(slide, titleText, { placeholder: 'title' });
        if (content.subtitle) {
             addTextSafely(slide, content.subtitle, { placeholder: 'subtitle' });
        }
        console.log("[PPT Service] Added Generic Title Slide");
    };

    const addAgendaSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title || (currentLanguage === Language.ES ? "Índice" : "Agenda"), { placeholder: 'title' });
        if (content.agendaPoints && content.agendaPoints.length > 0) {
            const agendaTextProps: PptxGenJS.TextProps[] = content.agendaPoints.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { type: 'bullet', characterCode: "25A0", style: { color: scheme.bulletColor } }, indentLevel: 0, fontSize: 12, fontFace: scheme.bodyFont, color:scheme.textOnLightBody }
            }));
            addTextSafely(slide, agendaTextProps, { placeholder: 'body', lineSpacing: 24 });
        }
        console.log("[PPT Service] Added Generic Agenda Slide");
    };

    const addSectionDividerSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterSectionDivider });
        addTextSafely(slide, content.title, { placeholder: 'title' });
        addTextSafely(slide, content.subtitle, { placeholder: 'subtitle' });
        console.log("[PPT Service] Added Generic Section Divider Slide");
    };
    
    const addExecutiveSummarySlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title || (currentLanguage === Language.ES ? "Resumen Ejecutivo" : "Executive Summary"), { placeholder: 'title' });
        if (content.executiveSummaryPoints && content.executiveSummaryPoints.length > 0) {
            const pointsProps: PptxGenJS.TextProps[] = content.executiveSummaryPoints.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { code: "25BA", color: scheme.primary }, indentLevel: 0, fontSize: 12, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
            }));
            addTextSafely(slide, pointsProps, { placeholder: 'body', lineSpacing: 24, autoFit: true });
        }
        console.log("[PPT Service] Added Generic Executive Summary Slide");
    };
    
    const addKpiHighlightsSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title, { placeholder: 'title' });
        
        let yPos = 1.2; // Starting Y position for the body
        
        content.kpiHighlightSections?.forEach(section => {
            slide.addText(section.title, { 
                x: MARGIN_SIDE_IN, y: yPos, w: CONTENT_WIDTH_IN, h: 0.4, 
                fontFace: scheme.headlineFont, fontSize: 14, bold: true, color: scheme.kpiHighlightTitleColor 
            });
            yPos += 0.5;
    
            if (section.points && section.points.length > 0) {
                const pointsProps: PptxGenJS.TextProps[] = section.points.map(point => ({
                    text: point,
                    options: { breakLine: true, bullet: { type: 'bullet', color: scheme.bulletColor }, indentLevel: 0, fontSize: 11, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
                }));
                const textHeight = section.points.length * 0.4 + 0.2;
                slide.addText(pointsProps, { x: MARGIN_SIDE_IN + 0.2, y: yPos, w: CONTENT_WIDTH_IN - 0.2, h: textHeight, lineSpacing: 22 });
                yPos += textHeight + 0.3;
            }
        });
        console.log("[PPT Service] Added Generic KPI Highlights Slide");
    };
    
    const addDetailedAnalysisSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title, { placeholder: 'title' });
        if (content.analysisPoints && content.analysisPoints.length > 0) {
             const pointsProps: PptxGenJS.TextProps[] = content.analysisPoints.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { type: 'bullet', color: scheme.bulletColor }, indentLevel: 0, fontSize: 11, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
            }));
            addTextSafely(slide, pointsProps, { placeholder: 'body', lineSpacing: 22 });
        }
        console.log("[PPT Service] Added Generic Detailed Analysis Slide");
    };
    
    const addCreativeAnalysisSlide = (content: SlideContent, scheme: BrandScheme, uploadedCreatives?: UploadedImage[]) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title, { placeholder: 'title' });
        
        const imageUrl = getImageDataUrl(content.imageIdentifier, uploadedCreatives);
        const hasPoints = content.analysisPoints && content.analysisPoints.length > 0;
        
        const imageWidth = hasPoints ? 4.5 : CONTENT_WIDTH_IN;
        const imageHeight = 3.5;
        const imageX = MARGIN_SIDE_IN;
        const imageY = 1.2;
        
        slide.addImage({
            path: imageUrl,
            x: imageX, y: imageY, w: imageWidth, h: imageHeight,
            sizing: { type: 'contain', w: imageWidth, h: imageHeight }
        });
        
        if (hasPoints) {
            const textX = imageX + imageWidth + 0.3;
            const textW = CONTENT_WIDTH_IN - imageWidth - 0.3;
            
            const pointsProps: PptxGenJS.TextProps[] = content.analysisPoints!.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { type: 'bullet', color: scheme.accent }, indentLevel: 0, fontSize: 10, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
            }));
            
            slide.addText(pointsProps, { x: textX, y: imageY, w: textW, h: imageHeight, lineSpacing: 20, autoFit: true });
        }
        console.log("[PPT Service] Added Generic Creative Analysis Slide");
    };
    
    const addConclusionsRecommendationsSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title, { placeholder: 'title' });
        
        let yPos = 1.2;
        const contentWidthHalf = CONTENT_WIDTH_IN / 2 - 0.1;
    
        if (content.conclusions && content.conclusions.length > 0) {
            slide.addText(currentLanguage === Language.ES ? 'Conclusiones' : 'Conclusions', {
                x: MARGIN_SIDE_IN, y: yPos, w: contentWidthHalf, h: 0.4,
                fontFace: scheme.headlineFont, fontSize: 14, bold: true, color: scheme.conclusionBulletColor
            });
            const pointsProps: PptxGenJS.TextProps[] = content.conclusions.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { type: 'bullet', color: scheme.conclusionBulletColor }, indentLevel: 0, fontSize: 11, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
            }));
            slide.addText(pointsProps, { 
                x: MARGIN_SIDE_IN, y: yPos + 0.5, w: contentWidthHalf, h: 3.5, 
                lineSpacing: 22, autoFit: true 
            });
        }
        
        if (content.recommendations && content.recommendations.length > 0) {
             slide.addText(currentLanguage === Language.ES ? 'Recomendaciones' : 'Recommendations', {
                x: MARGIN_SIDE_IN + contentWidthHalf + 0.2, y: yPos, w: contentWidthHalf, h: 0.4,
                fontFace: scheme.headlineFont, fontSize: 14, bold: true, color: scheme.recommendationBulletColor
            });
             const pointsProps: PptxGenJS.TextProps[] = content.recommendations.map(point => ({
                text: point,
                options: { breakLine: true, bullet: { type: 'bullet', color: scheme.recommendationBulletColor }, indentLevel: 0, fontSize: 11, fontFace: scheme.bodyFont, color: scheme.textOnLightBody }
            }));
            slide.addText(pointsProps, { 
                x: MARGIN_SIDE_IN + contentWidthHalf + 0.2, y: yPos + 0.5, w: contentWidthHalf, h: 3.5, 
                lineSpacing: 22, autoFit: true 
            });
        }
        console.log("[PPT Service] Added Generic Conclusions/Recommendations Slide");
    };

    const addAnnexSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterContent });
        addTextSafely(slide, content.title || (currentLanguage === Language.ES ? "Anexo" : "Annex"), { placeholder: 'title' });
        if (content.annexContent) {
            addTextSafely(slide, content.annexContent, { placeholder: 'body', fontSize: 9 });
        }
        console.log("[PPT Service] Added Generic Annex Slide");
    };
    
    const addThankYouSlide = (content: SlideContent, scheme: BrandScheme) => {
        const slide = pres.addSlide({ masterName: scheme.masterTitle });
        addTextSafely(slide, content.title || (currentLanguage === Language.ES ? "GRACIAS" : "THANK YOU"), { placeholder: 'title' });
        console.log("[PPT Service] Added Generic Thank You Slide");
    };

    // --- Main Logic ---

    if (presentationJson.brandStyle === BrandStyle.MOTORTEC_REPORT_TEMPLATE) {
        const motortecData = presentationJson.motortecReportContent;
        if (!motortecData) {
            console.error("[PresentationService] Motortec Report Template selected, but motortecReportContent is missing in JSON.");
            throw new Error("Motortec template data is missing.");
        }
        if(motortecData.slide1_Title) _addMotortecSlide1_Title(pres, motortecData.slide1_Title, brand);
        if(motortecData.slide2_Agenda) _addMotortecSlide2_Agenda(pres, motortecData.slide2_Agenda, brand);
        if(motortecData.slide3_ObjectivesResults) _addMotortecSlide3_ObjectivesResults(pres, motortecData.slide3_ObjectivesResults, brand);
        if(motortecData.slide4_KPICharts) _addMotortecSlide4_KPICharts(pres, motortecData.slide4_KPICharts, brand);
        if(motortecData.slide5_ComparativeCharts) _addMotortecSlide5_ComparativeCharts(pres, motortecData.slide5_ComparativeCharts, brand);
        if(motortecData.slide6_PlatformDivider) _addMotortecSlide6_PlatformDivider(pres, motortecData.slide6_PlatformDivider, brand);
        if(motortecData.slide7_DemographicsCreative) _addMotortecSlide7_DemographicsCreative(pres, motortecData.slide7_DemographicsCreative, brand, uploadedCreativesData);
        if(motortecData.slide8_Consideracion) _addMotortecSlide8_Consideracion(pres, motortecData.slide8_Consideracion, brand);
        if(motortecData.slide9_Conversion) _addMotortecSlide9_Conversion(pres, motortecData.slide9_Conversion, brand);
        if(motortecData.slide10_CreativeAnalysisMeta) _addMotortecSlide10_CreativeAnalysisMeta(pres, motortecData.slide10_CreativeAnalysisMeta, brand, uploadedCreativesData);
        if(motortecData.slide11_Organico) _addMotortecSlide11_Organico(pres, motortecData.slide11_Organico, brand, uploadedCreativesData);
        _addMotortecThankYouSlide(pres, brand);
    } else { 
        const clientPeriodText = brand.footerText ? brand.footerText(currentLanguage, presentationJson.clientName, presentationJson.period) :
                                 `${presentationJson.clientName || ""} | ${presentationJson.period || ""}`.trim();

        const footerY = PAGE_HEIGHT_IN - MARGIN_BOTTOM_IN - 0.3;
        const footerHeight = 0.3;
        const contentWidthThird = CONTENT_WIDTH_IN / 3;

        if (presentationJson.brandStyle === BrandStyle.LLYC_DEFAULT) {
             pres.defineSlideMaster({
                title: brand.masterTitle,
                background: { color: brand.backgroundDark },
                objects: [
                    { 'rect': { x: 0, y: PAGE_HEIGHT_IN - 0.1, w: '100%', h: 0.1, fill: { color: brand.primary }}},
                    { 'placeholder': {
                        options: { name: 'title', type: 'title', x: MARGIN_SIDE_IN, y: 1.8, w: CONTENT_WIDTH_IN, h: 2.0, fontFace: brand.headlineFont, fontSize: 40, bold: true, color: brand.textOnDark, align: 'left', valign: 'middle' },
                        text: 'Título de la Presentación',
                    }},
                    { 'placeholder': {
                         options: { name: 'subtitle', type: 'body', x: MARGIN_SIDE_IN, y: 3.8, w: CONTENT_WIDTH_IN, h: 0.5, fontFace: brand.bodyFont, fontSize: 18, color: brand.textOnDark, align: 'left' },
                         text: 'Subtítulo',
                    }},
                    { 'text': { text: brand.logoText, options: { x: MARGIN_SIDE_IN, y: footerY, w: contentWidthThird, h: footerHeight, fontFace: brand.headlineFont, fontSize: 14, bold: true, color: brand.primary } } },
                ],
            });
            pres.defineSlideMaster({
                title: brand.masterContent,
                background: { color: brand.backgroundLight },
                objects: [
                    { 'rect': { x: 0, y: 0, w: '100%', h: MARGIN_TOP_IN + 0.1, fill: { color: brand.backgroundDark }}},
                    { 'text': { text: brand.logoText, options: { x: MARGIN_SIDE_IN, y: 0, w: 2, h: MARGIN_TOP_IN + 0.1, fontFace: brand.headlineFont, fontSize: 14, bold:true, color: brand.primary, valign: 'middle' }}},
                    { 'placeholder': {
                        options: { name: 'title', type: 'title', x: MARGIN_SIDE_IN, y: MARGIN_TOP_IN + 0.3, w: CONTENT_WIDTH_IN, h: 0.5, fontFace: brand.headlineFont, fontSize: 24, bold: true, color: brand.textOnLightHeadline },
                        text: 'Título de Diapositiva',
                    }},
                    { 'placeholder': {
                         options: { name: 'body', type: 'body', x: MARGIN_SIDE_IN, y: MARGIN_TOP_IN + 1.0, w: CONTENT_WIDTH_IN, h: PAGE_HEIGHT_IN - (MARGIN_TOP_IN + 1.0) - (MARGIN_BOTTOM_IN + 0.5), fontFace: brand.bodyFont, fontSize: 11, color: brand.textOnLightBody },
                         text: 'Contenido de la diapositiva',
                    }},
                    { 'text': { text: clientPeriodText, options: { x: MARGIN_SIDE_IN, y: footerY, w: contentWidthThird - 0.1, h: footerHeight, fontFace: brand.bodyFont, fontSize: 8, color: brand.textOnLightSubtle } }},
                    { 'text': { text: brand.tagline ? brand.tagline(currentLanguage) : "", options: { x: MARGIN_SIDE_IN + contentWidthThird, y: footerY, w: contentWidthThird, h: footerHeight, fontFace: brand.bodyFont, fontSize: 8, color: brand.textOnLightSubtle, align: 'center' } }},
                ],
                slideNumber: { x: PAGE_WIDTH_IN - MARGIN_SIDE_IN - 0.5, y: PAGE_HEIGHT_IN - MARGIN_BOTTOM_IN - 0.15, fontFace: brand.bodyFont, fontSize: 10, color: brand.textOnLightHeadline, align: "right" }
            });
             pres.defineSlideMaster({
                title: brand.masterSectionDivider,
                background: { color: brand.backgroundDark },
                objects: [
                     { 'rect': { x: MARGIN_SIDE_IN, y: 2.0, w: 0.15, h: 1.0, fill: { color: brand.primary }}},
                     { 'placeholder': {
                        options: { name: 'title', type: 'title', x: MARGIN_SIDE_IN + 0.3, y: 2.0, w: CONTENT_WIDTH_IN - 0.3, h: 1.0, fontFace: brand.headlineFont, fontSize: 32, color: brand.textOnDark, valign:'middle' },
                        text: 'SECCIÓN'
                    }},
                    { 'placeholder': {
                        options: { name: 'subtitle', type: 'body', x: MARGIN_SIDE_IN + 0.3, y: 3.0, w: CONTENT_WIDTH_IN - 0.3, h: 0.5, fontFace: brand.bodyFont, fontSize: 16, color: brand.textOnLightSubtle, valign:'top' },
                        text: 'Breve descripción de la sección'
                    }},
                    { 'text': { text: brand.logoText, options: { x: MARGIN_SIDE_IN, y: footerY, w: contentWidthThird, h: footerHeight, fontFace: brand.headlineFont, fontSize: 14, bold:true, color: brand.primary }}},
                    { 'text': { text: brand.tagline ? brand.tagline(currentLanguage) : "", options: { x: MARGIN_SIDE_IN + contentWidthThird, y: footerY, w: contentWidthThird, h: footerHeight, fontFace: brand.bodyFont, fontSize: 8, color: brand.textOnLightSubtle, align: 'center' } }},
                ],
                 slideNumber: { x: PAGE_WIDTH_IN - MARGIN_SIDE_IN - 0.5, y: PAGE_HEIGHT_IN - MARGIN_BOTTOM_IN - 0.15, fontFace: brand.bodyFont, fontSize: 10, color: brand.textOnDark, align: "right" }
            });
        } else if (presentationJson.brandStyle === BrandStyle.IFEMA_MADRID) {
            pres.defineSlideMaster({
                title: brand.masterTitle,
                background: { color: brand.backgroundDark },
                objects: [
                    { 'rect': { x: 0, y: PAGE_HEIGHT_IN - 0.2, w: '100%', h: 0.2, fill: { color: brand.primary }}},
                    { 'placeholder': {
                         options: { name: 'title', type: 'title', x: MARGIN_SIDE_IN, y: 1.5, w: CONTENT_WIDTH_IN, h: 2.0, fontFace: brand.headlineFont, fontSize: 48, bold: true, color: brand.textOnDark, align: 'left', valign: 'middle'},
                         text: 'Título Principal'
                    }},
                    { 'placeholder': {
                        options: { name: 'subtitle', type: 'body', x: MARGIN_SIDE_IN, y: 3.5, w: CONTENT_WIDTH_IN, h: 0.75, fontFace: brand.bodyFont, fontSize: 20, color: brand.textOnDark, align: 'left'},
                        text: 'Subtítulo Opcional'
                   }},
                   { 'text': { text: brand.logoPlaceholderText, options: { x: PAGE_WIDTH_IN - MARGIN_SIDE_IN - 2.0, y: MARGIN_TOP_IN, w: 2.0, h: 0.5, fontFace: brand.headlineFont, fontSize: 12, color: brand.textOnDark, align:'right' }}}
                ],
            });
            // NOTE: Other IFEMA masters would be defined here. For this fix, the default content master will be used implicitly by PptxGenJS if not defined.
        }

        if (presentationJson.slides && Array.isArray(presentationJson.slides)) {
            presentationJson.slides.forEach((slideContent, index) => {
                console.log(`[PresentationService] Processing generic slide ${index + 1}. Type: ${slideContent.type}`);
                 try {
                    switch (slideContent.type) {
                        case SlideType.TITLE_SLIDE: addTitleSlide(slideContent, brand, presentationJson.presentationTitle); break;
                        case SlideType.AGENDA_SLIDE: addAgendaSlide(slideContent, brand); break;
                        case SlideType.SECTION_DIVIDER_SLIDE: addSectionDividerSlide(slideContent, brand); break;
                        case SlideType.EXECUTIVE_SUMMARY: addExecutiveSummarySlide(slideContent, brand); break;
                        case SlideType.KPI_HIGHLIGHTS: addKpiHighlightsSlide(slideContent, brand); break;
                        case SlideType.DETAILED_ANALYSIS: addDetailedAnalysisSlide(slideContent, brand); break;
                        case SlideType.CREATIVE_ANALYSIS: addCreativeAnalysisSlide(slideContent, brand, uploadedCreativesData); break;
                        case SlideType.CONCLUSIONS_RECOMMENDATIONS: addConclusionsRecommendationsSlide(slideContent, brand); break;
                        case SlideType.ANNEX_SLIDE: addAnnexSlide(slideContent, brand); break;
                        case SlideType.THANK_YOU_SLIDE: addThankYouSlide(slideContent, brand); break;
                        default: console.warn(`[PresentationService] Generic Style - Unsupported slide type: ${(slideContent as any).type}`);
                    }
                } catch (slideError) {
                    console.error(`[PresentationService] Generic Style - Error generating slide ${index + 1} (Type: ${slideContent.type}):`, slideError);
                }
            });
        } else {
            console.error("[PresentationService] Generic Style - presentationJson.slides is undefined or not an array.");
            throw new Error("Slide data is missing or invalid for generic presentation style.");
        }
    }

    const fileName = `${presentationJson.presentationTitle || "Presentation"}_${presentationJson.brandStyle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pptx`;
    try {
        await pres.writeFile({ fileName: fileName });
        console.log(`[PresentationService] pres.writeFile executed for ${fileName}.`);
    } catch (writeError) {
        console.error(`[PresentationService] Error during pres.writeFile for ${fileName}:`, writeError);
        throw writeError;
    }
};
