# InsightsBuilder V2

Generate data-driven insights and presentations with AI. This powerful tool leverages the Google Gemini API to transform complex marketing, sales, or operational data into clear, actionable textual analysis and professional PowerPoint presentations.

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20API-blue.svg)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## Introduction

InsightsBuilder V2 is designed for analysts, marketers, and consultants who need to quickly understand performance data and communicate findings effectively. It eliminates hours of manual reporting by automating the entire process from data ingestion to final presentation.

The application operates in two primary modes:
1.  **Aggregated Data Analysis**: For in-depth analysis of complex, multi-source data. Users can paste data, upload Excel files, connect to APIs (prototype), and upload ad creatives for visual analysis. The output is a comprehensive report and a customizable PowerPoint presentation.
2.  **Quick Campaign Summary**: For a fast, high-level overview of a single campaign's performance. Users input basic metrics (impressions, clicks, conversions, cost) to receive a concise, well-structured summary.

## Key Features

-   **AI-Powered Analysis**: Utilizes Google's `gemini-2.5-flash` model to interpret data, identify trends, provide causal explanations, and offer actionable recommendations.
-   **Automated Presentation Generation**: Transforms generated insights into a downloadable `.pptx` file with a single click, using the powerful `pptxgenjs` library.
-   **Branded Presentation Styles**: Supports multiple presentation templates, allowing for consistent branding:
    -   LLYC Default
    -   IFEMA MADRID (General Style)
    -   Motortec Report Template (A specific, multi-slide IFEMA report)
-   **Visual Creative Analysis**: Upload ad creatives (images) for AI-powered visual feedback on composition, messaging, and potential effectiveness.
-   **Flexible Data Input**:
    -   Manually paste data from any source.
    -   Upload `.xls` or `.xlsx` files.
    -   Connect directly to APIs like Google Ads, GA4, and Meta Ads (OAuth2 flow implemented).
-   **Context-Aware Insights**: Enhance analysis by providing optional context like client name, industry sector, market conditions, and specific questions to guide the AI.
-   **Multilingual Support**: The user interface and AI-generated responses are available in both **English** and **Spanish**.

## How It Works

The application follows a sophisticated, multi-step process to deliver high-quality results:

1.  **Data & Context Input**: The user provides data, selects a language, and chooses a presentation brand style. For Aggregated Analysis, they can also upload creative images and add contextual details.
2.  **First Gemini API Call (Insight Generation)**:
    -   The application constructs a detailed prompt for the Gemini API. This prompt includes:
        -   A **System Instruction** defining the AI's persona (e.g., an expert business consultant).
        -   The user-provided data, context, and any uploaded images (as base64 data).
        -   Specific instructions for visual analysis of the creatives.
    -   Gemini processes this multi-modal request and returns a comprehensive textual insight formatted in Markdown.
3.  **Display Insight**: The application renders the Markdown response in a clean, readable format for the user to review.
4.  **Second Gemini API Call (Presentation Structuring)**:
    -   When the user clicks "Generate Presentation," a second prompt is sent to Gemini.
    -   This prompt includes the original data and the *first AI-generated insight*, instructing the model to restructure all this information into a **strict JSON format** that maps to the selected presentation brand style (e.g., LLYC, Motortec).
    -   The `responseMimeType: "application/json"` parameter is used to ensure a valid JSON output.
5.  **Presentation Generation**:
    -   The front end parses the structured JSON response.
    -   Using `pptxgenjs`, the application programmatically builds the PowerPoint presentation slide by slide, populating titles, text, KPIs, images, and charts according to the JSON data and brand style.
6.  **Download**: The final `.pptx` file is automatically downloaded to the user's browser.

## Tech Stack

-   **Frontend**: React 18, TypeScript, Tailwind CSS
-   **AI Model**: Google Gemini (`@google/genai` library)
-   **Presentation Generation**: `pptxgenjs`
-   **Data Handling**: `xlsx` (for Excel files), `marked` (for Markdown rendering)
-   **Authentication**: Google Identity Services for OAuth2 with Google APIs.
-   **Build Process**: This project is configured for a **zero build-step** deployment. It uses `ES Module Shims` and `@babel/standalone` to transpile JSX/TS directly in the browser, making it incredibly easy to deploy on any static hosting service.

## Setup and Running the Application

### Prerequisites

-   A modern web browser (Chrome, Firefox, Edge).
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. API Key Configuration (Required)

This application requires a Google Gemini API Key to function. The key **must** be provided as an environment variable.

-   **For Hosting (Vercel, Netlify, etc.)**:
    In your hosting provider's project settings, navigate to the "Environment Variables" section and add a new variable:
    -   **Name**: `API_KEY`
    -   **Value**: `Your-Gemini-API-Key-Here`

-   **For Local Development**:
    The code reads from `process.env.API_KEY`. Since this is a client-side application, you need a simple server that can make this variable available. A common approach is to use a tool like `vite` which handles `.env` files automatically. Alternatively, for a quick start, you can temporarily hardcode it in `services/geminiService.ts` (NOT recommended for production).

### 2. Google & Meta API Configuration (Optional)

To enable the direct API connectors for Google Ads, GA4, and Meta Ads, you must configure their respective client/app IDs in `constants.ts`:

-   `GOOGLE_CLIENT_ID`: Obtain this from the [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project.
    -   Go to "APIs & Services" > "Credentials".
    -   Create an "OAuth 2.0 Client ID" of type "Web application".
    -   **Crucially**, add your application's URL (e.g., `http://localhost:3000`, `https://your-app.vercel.app`) to the "Authorized JavaScript origins".
-   `META_APP_ID`: Obtain this from [Meta for Developers](https://developers.facebook.com/).
    -   Create a new App.
    -   Add the "Facebook Login" product.
    -   Note that the Meta SDK requires the application to be served over **HTTPS** to function correctly.

### 3. Running Locally

Since this project has no build step, you can run it with any simple static file server.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/insights-builder.git
    cd insights-builder
    ```
2.  **Serve the files:**
    -   **Using VS Code**: Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and select "Open with Live Server".
    -   **Using Python**:
        ```bash
        python -m http.server
        ```
    -   **Using Node.js**:
        ```bash
        npx serve
        ```
3.  Open your browser to the provided local address (e.g., `http://localhost:8000`).

## Project Structure

```
/
├── index.html              # Main HTML entry point, loads scripts
├── index.tsx               # Root of the React application
├── App.tsx                 # Main application component, state management
├── README.md               # This file
├── metadata.json           # Application metadata
├── constants.ts            # UI strings, prompts, API scopes, options
├── types.ts                # All TypeScript interfaces and type definitions
│
├── components/             # Reusable React components
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
└── services/               # Logic for external services
    ├── geminiService.ts    # Handles all calls to the Gemini API
    ├── googleApiService.ts # Fetches data from Google Ads & GA4 APIs
    ├── googleAuthService.ts# Manages Google OAuth2 flow
    ├── metaApiService.ts   # Manages Meta Login and API calls
    └── presentationService.ts # Builds the PPTX file using pptxgenjs
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

-   This tool was developed as part of an innovation initiative at [LLYC](https://www.llyc.global/).
-   Powered by the incredible capabilities of the Google Gemini API.