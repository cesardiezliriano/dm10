import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { DataSource, InsightRequest, Language, UploadedImage, BrandStyle, AggregatedDataBlock, ApiConnection } from '../types.ts'; 
import { 
    DATA_SOURCE_OPTIONS, 
    BRAND_STYLE_OPTIONS,
    getText, 
    SPECIFIC_QUESTIONS_PLACEHOLDER_FN,
    ADDITIONAL_CONTEXT_PLACEHOLDER_FN,
    CLIENT_NAME_PLACEHOLDER_FN,
    SECTOR_PLACEHOLDER_FN,
    CAMPAIGN_MARKET_PLACEHOLDER_FN,
    PLACEHOLDER_DATA_BLOCK_TIME_PERIOD,
    PLACEHOLDER_DATA_BLOCK_KPIS,
    MAX_CREATIVES
} from '../constants.ts';
import { ApiConnector } from './ApiConnector.tsx';

interface DataInputFormProps {
  onSubmit: (request: InsightRequest) => void;
  isLoading: boolean;
  language: Language; 
  selectedBrandStyle: BrandStyle;
  onBrandStyleChange: (style: BrandStyle) => void;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ onSubmit, isLoading, language, selectedBrandStyle, onBrandStyleChange }) => {
  const [dataBlocks, setDataBlocks] = useState<AggregatedDataBlock[]>([]);
  const [clientName, setClientName] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [campaignMarket, setCampaignMarket] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [specificQuestions, setSpecificQuestions] = useState<string>('');
  
  const [uploadedCreatives, setUploadedCreatives] = useState<UploadedImage[]>([]);
  const [excelFileMessage, setExcelFileMessage] = useState<string | null>(null);
  const [creativeFileMessage, setCreativeFileMessage] = useState<string | null>(null);
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>([]);
  
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const creativeFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDataBlock = () => {
    const newBlock: AggregatedDataBlock = {
      id: crypto.randomUUID(),
      source: DataSource.PASTED_MANUAL,
      timePeriod: '',
      kpis: ''
    };
    setDataBlocks(prev => [...prev, newBlock]);
  };

  const handleRemoveDataBlock = (id: string) => {
    setDataBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleDataBlockChange = (id: string, field: keyof AggregatedDataBlock, value: string) => {
    setDataBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const handleApiConnect = (connection: ApiConnection) => {
    setApiConnections(prev => {
        // Remove any existing connection for the same source before adding the new one
        const otherConnections = prev.filter(c => c.source !== connection.source);
        return [...otherConnections, connection];
    });
  };

  const handleApiDisconnect = (source: DataSource) => {
      setApiConnections(prev => prev.filter(c => c.source !== source));
  };


  const handleExcelFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExcelFileMessage(`${getText(language, 'FILE_PROCESSING_MESSAGE')} '${file.name}'...`);

    if (file.size > 2 * 1024 * 1024) { // 2MB warning
        setExcelFileMessage(`${getText(language, 'FILE_SIZE_WARNING_MESSAGE')} '${file.name}' ${getText(language, 'FILE_SIZE_WARNING_DETAIL')}`);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer) throw new Error("Could not read file buffer.");
        
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        let tableMarkdown = '';
        if (sheetData.length > 0) {
          const header = sheetData[0].map(String); 
          tableMarkdown += `| ${header.join(" | ")} |\n`;
          tableMarkdown += `| ${header.map(() => "---").join(" | ")} |\n`;
          for (let i = 1; i < sheetData.length; i++) {
            tableMarkdown += `| ${sheetData[i].map(String).join(" | ")} |\n`; 
          }
        } else {
          tableMarkdown += "(Sheet was empty or data could not be structured as a table)\n";
        }
        
        const newBlock: AggregatedDataBlock = {
            id: crypto.randomUUID(),
            source: DataSource.PASTED_MANUAL,
            timePeriod: `From file: ${file.name}`,
            kpis: tableMarkdown
        };
        setDataBlocks(prev => [...prev, newBlock]);
        setExcelFileMessage(`${getText(language, 'FILE_SUCCESS_MESSAGE')} '${file.name}' ${getText(language, 'FILE_SUCCESS_DETAIL')}`);

      } catch (error) {
        console.error("Error processing Excel file:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setExcelFileMessage(`${getText(language, 'FILE_ERROR_PROCESS_MESSAGE', file.name)}. ${getText(language, 'FILE_ERROR_PROCESS_DETAIL')} ${errorMessage}`);
      } finally {
        if (excelFileInputRef.current) excelFileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
        setExcelFileMessage(`${getText(language, 'FILE_ERROR_READ_MESSAGE')} '${file.name}'.`);
        if (excelFileInputRef.current) excelFileInputRef.current.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCreativeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setCreativeFileMessage(null); // Clear previous messages
    let localErrors: string[] = [];
    
    const currentCreativesCount = uploadedCreatives.length;
    // Determine how many files can actually be processed based on MAX_CREATIVES
    const filesToProcess = Array.from(files).slice(0, MAX_CREATIVES - currentCreativesCount);

    if (files.length > filesToProcess.length && currentCreativesCount < MAX_CREATIVES) {
        // This means some files were selected but couldn't be added due to exceeding MAX_CREATIVES
        localErrors.push(getText(language, 'MAX_CREATIVES_REACHED', String(MAX_CREATIVES)));
    } else if (currentCreativesCount >= MAX_CREATIVES && files.length > 0) {
        // This means max capacity was already reached before selecting new files
        localErrors.push(getText(language, 'MAX_CREATIVES_REACHED', String(MAX_CREATIVES)));
        if (creativeFileInputRef.current) {
            creativeFileInputRef.current.value = ""; // Clear the file input
        }
        setCreativeFileMessage(localErrors.join('\n'));
        return; // No need to process further
    }


    // Fix: Explicitly type `file` as `File` to resolve incorrect type inference to `unknown`.
    const promises: Promise<UploadedImage | null>[] = filesToProcess.map((file: File) => {
        return new Promise((resolve) => {
            if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
                localErrors.push(`${getText(language, 'FILE_TYPE_INVALID')} (${file.name})`);
                resolve(null);
                return;
            }
            // Optional: Add a size check per file if desired
            // if (file.size > SOME_MAX_SIZE_PER_IMAGE) { ... }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === 'string') {
                    resolve({ name: file.name, type: file.type, dataUrl: e.target.result });
                } else {
                    localErrors.push(`${getText(language, 'FILE_ERROR_READ_MESSAGE')} '${file.name}' (empty result).`);
                    resolve(null);
                }
            };
            reader.onerror = () => {
                localErrors.push(`${getText(language, 'FILE_ERROR_READ_MESSAGE')} '${file.name}'.`);
                resolve(null);
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(promises).then(results => {
        const successfullyReadImages = results.filter(img => img !== null) as UploadedImage[];
        if (successfullyReadImages.length > 0) {
            setUploadedCreatives(prev => [...prev, ...successfullyReadImages].slice(0, MAX_CREATIVES)); // Ensure MAX_CREATIVES limit
        }
        
        if (localErrors.length > 0) {
            setCreativeFileMessage(localErrors.join('\n'));
        } else if (successfullyReadImages.length === 0 && filesToProcess.length > 0) {
            // This case means files were selected for processing, but none were valid or readable.
            setCreativeFileMessage(getText(language, 'FILE_TYPE_INVALID')); // Or a more general error if multiple reasons
        } else if (successfullyReadImages.length > 0) {
            setCreativeFileMessage(null); // Clear message on success
        }
    });

    if (creativeFileInputRef.current) {
        creativeFileInputRef.current.value = "";
    }
  };


  const removeCreative = (fileName: string) => {
    setUploadedCreatives(prev => {
        const updatedList = prev.filter(img => img.name !== fileName);
        if (updatedList.length === 0) {
            setCreativeFileMessage(null);
        }
        return updatedList;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const manualDataString = dataBlocks
      .map(block => `=== ${block.source} - ${block.timePeriod || 'General'} ===\n${block.kpis}`)
      .join('\n\n');

    const apiDataString = apiConnections
      .map(conn => `=== API Data: ${conn.source} ===\n\`\`\`json\n${JSON.stringify(conn.data, null, 2)}\n\`\`\``)
      .join('\n\n');

    const combinedData = [apiDataString, manualDataString].filter(Boolean).join('\n\n');

    if (!combinedData.trim()) {
        alert(getText(language, 'ALERT_NO_DATA'));
        return;
    }

    const manualDataSources = [...new Set(dataBlocks.map(b => b.source))];
    const apiDataSources = apiConnections.map(c => c.source);
    const selectedDataSources = [...new Set([...apiDataSources, ...manualDataSources])];

     if (selectedDataSources.length === 0 && (dataBlocks.length > 0 || apiConnections.length > 0)) {
        selectedDataSources.push(DataSource.PASTED_MANUAL);
    }
    
    onSubmit({ 
        selectedDataSources, 
        data: combinedData, 
        clientName,
        sector,
        campaignMarket,
        additionalContext,
        specificQuestions,
        uploadedCreatives,
        brandStyle: selectedBrandStyle
    });
    setExcelFileMessage(null); 
    // Do not clear creativeFileMessage here, it might contain important error info from last upload attempt
  };

  const labelStyle = { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-[#0A263B]">
      <details className="bg-[#F54963]/10 p-3 rounded-lg border border-[#F54963]/30 group">
        <summary className="text-sm font-medium text-[#F54963] hover:text-[#D93E52] cursor-pointer list-none flex justify-between items-center" style={labelStyle}>
          <span>{getText(language, 'TIPS_TITLE')}</span>
          <span className="text-xs text-[#F54963]/80 group-open:rotate-90 transition-transform transform duration-150">&#9656;</span>
        </summary>
        <div className="mt-3 space-y-2 text-xs text-[#6D7475] prose prose-xs max-w-none">
          {/* ... existing tips content ... */}
          <p>{getText(language, 'TIPS_INTRO')}</p>
          
          <strong className="text-[#F54963]">{getText(language, 'TIPS_CONTEXT_TITLE')}</strong>
          <ul>
            <li>{getText(language, 'TIPS_CONTEXT_CLIENT')}</li>
            <li>{getText(language, 'TIPS_CONTEXT_SECTOR')}</li>
            <li>{getText(language, 'TIPS_CONTEXT_MARKET')}</li>
          </ul>

          <strong className="text-[#F54963]">{getText(language, 'TIPS_STRUCTURE_TITLE')}</strong>
          <ul>
            <li>{getText(language, 'TIPS_STRUCTURE_HEADINGS')} <code>=== Google Ads - {getText(language, 'LABEL_TIME_PERIOD')} ===</code>.</li>
            <li>{getText(language, 'TIPS_STRUCTURE_TIME')}</li>
            <li>{getText(language, 'TIPS_STRUCTURE_KPIS')}</li>
            <li>{getText(language, 'TIPS_STRUCTURE_COMPARATIVE')} <code>{getText(language, 'LABEL_CLICKS')}: 500 (vs 400 período ant., +25%)</code>.</li>
            <li>{getText(language, 'TIPS_STRUCTURE_CONVERSIONS')}</li>
            <li>{getText(language, 'TIPS_STRUCTURE_SUMMARIZE')}</li>
          </ul>

          <strong className="text-[#F54963]">{getText(language, 'TIPS_EXCEL_TITLE')}</strong>
          <ul>
            <li>{getText(language, 'TIPS_EXCEL_UPLOAD')}</li>
            <li>{getText(language, 'TIPS_EXCEL_STRUCTURE')}</li>
            <li>{getText(language, 'TIPS_EXCEL_SIZE')}</li>
            <li>{getText(language, 'TIPS_EXCEL_LIMITS')}</li>
          </ul>

          <strong className="text-[#F54963]">{getText(language, 'TIPS_PDF_TITLE')}</strong>
          <ul>
            <li>{getText(language, 'TIPS_PDF_NO_UPLOAD')}</li>
            <li>{getText(language, 'TIPS_PDF_RECOMMENDATION')}</li>
          </ul>
          
          <strong className="text-[#F54963]">{getText(language, 'TIPS_ADDITIONAL_CONTEXT_TITLE')}</strong>
          <ul>
            <li>{getText(language, 'TIPS_ADDITIONAL_CONTEXT_USE')}</li>
            <li>{getText(language, 'TIPS_ADDITIONAL_QUESTIONS_USE')}</li>
          </ul>
        </div>
      </details>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
            {getText(language, 'LABEL_CLIENT_NAME')}
            </label>
            <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder={CLIENT_NAME_PLACEHOLDER_FN(language)}
            className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm"
            disabled={isLoading}
            />
        </div>
        <div>
            <label htmlFor="sector" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
            {getText(language, 'LABEL_SECTOR')}
            </label>
            <input
            type="text"
            id="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder={SECTOR_PLACEHOLDER_FN(language)}
            className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm"
            disabled={isLoading}
            />
        </div>
        <div>
            <label htmlFor="campaignMarket" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
            {getText(language, 'LABEL_MARKET')}
            </label>
            <input
            type="text"
            id="campaignMarket"
            value={campaignMarket}
            onChange={(e) => setCampaignMarket(e.target.value)}
            placeholder={CAMPAIGN_MARKET_PLACEHOLDER_FN(language)}
            className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm"
            disabled={isLoading}
            />
        </div>
      </div>
      
      {/* API Connectors Section */}
      <ApiConnector 
        language={language}
        isLoading={isLoading}
        connections={apiConnections}
        onConnect={handleApiConnect}
        onDisconnect={handleApiDisconnect}
      />

      {/* Dynamic Data Blocks Section */}
      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
        <legend className="text-md font-medium text-[#0A263B] px-2" style={labelStyle}>
          {getText(language, 'SECTION_TITLE_DATA_INPUT')}
        </legend>

        <div className="space-y-4">
          {dataBlocks.map((block, index) => (
            <div key={block.id} className="p-4 border border-[#ACB4B6] rounded-md bg-white shadow-sm relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`block-source-${block.id}`} className="block text-xs font-medium text-[#6D7475] mb-1" style={{...labelStyle, fontSize: '0.8rem'}}>
                    {getText(language, 'LABEL_DATA_BLOCK_SOURCE')}
                  </label>
                  <select
                    id={`block-source-${block.id}`}
                    value={block.source}
                    onChange={(e) => handleDataBlockChange(block.id, 'source', e.target.value as DataSource)}
                    disabled={isLoading}
                    className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] text-sm"
                  >
                    {DATA_SOURCE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`block-time-${block.id}`} className="block text-xs font-medium text-[#6D7475] mb-1" style={{...labelStyle, fontSize: '0.8rem'}}>
                    {getText(language, 'LABEL_DATA_BLOCK_TIME_PERIOD')}
                  </label>
                  <input
                    type="text"
                    id={`block-time-${block.id}`}
                    value={block.timePeriod}
                    onChange={(e) => handleDataBlockChange(block.id, 'timePeriod', e.target.value)}
                    placeholder={PLACEHOLDER_DATA_BLOCK_TIME_PERIOD(language)}
                    disabled={isLoading}
                    className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`block-kpis-${block.id}`} className="block text-xs font-medium text-[#6D7475] mb-1" style={{...labelStyle, fontSize: '0.8rem'}}>
                  {getText(language, 'LABEL_DATA_BLOCK_KPIS')}
                </label>
                <textarea
                  id={`block-kpis-${block.id}`}
                  rows={5}
                  value={block.kpis}
                  onChange={(e) => handleDataBlockChange(block.id, 'kpis', e.target.value)}
                  placeholder={PLACEHOLDER_DATA_BLOCK_KPIS(language)}
                  disabled={isLoading}
                  className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm custom-scrollbar"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDataBlock(block.id)}
                disabled={isLoading}
                title={getText(language, 'BUTTON_REMOVE_DATA_BLOCK')}
                className="absolute top-2 right-2 p-1 bg-gray-200 text-gray-600 rounded-full hover:bg-red-200 hover:text-red-800 transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleAddDataBlock}
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-dashed border-[#36A7B7] rounded-md text-sm font-medium text-[#36A7B7] bg-white hover:bg-[#36A7B7]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#36A7B7] disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            {getText(language, 'BUTTON_ADD_DATA_BLOCK')}
          </button>
          
          <div className="flex-grow">
            <label htmlFor="excelFile" className="sr-only">{getText(language, 'LABEL_UPLOAD_EXCEL')}</label>
            <input
              type="file"
              id="excelFile"
              ref={excelFileInputRef}
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleExcelFileChange}
              disabled={isLoading}
              className="block w-full text-sm text-[#6D7475] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F54963] file:text-white hover:file:bg-[#D93E52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#F54963]"
            />
          </div>
        </div>
         {excelFileMessage && <p className={`mt-2 text-xs ${excelFileMessage.includes(getText(language, 'LABEL_ERROR_PREFIX')) || excelFileMessage.includes(getText(language, 'FILE_SIZE_WARNING_MESSAGE')) ? 'text-red-600' : 'text-green-600'}`}>{excelFileMessage}</p>}

      </fieldset>

      {/* Creative Upload Section */}
      <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50/50">
        <label htmlFor="creativeFiles" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
          {getText(language, 'LABEL_UPLOAD_CREATIVES_TITLE')}
        </label>
        <input
          type="file"
          id="creativeFiles"
          ref={creativeFileInputRef}
          multiple
          accept="image/png, image/jpeg, image/gif"
          onChange={handleCreativeFileChange}
          disabled={isLoading || uploadedCreatives.length >= MAX_CREATIVES}
          className="block w-full text-sm text-[#6D7475] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#36A7B7] file:text-white hover:file:bg-[#2A8E9A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#36A7B7] disabled:opacity-50"
          aria-label={getText(language, 'LABEL_UPLOAD_CREATIVES_BUTTON')}
        />
        <p className="mt-1 text-xs text-gray-500">{getText(language, 'NOTE_AI_CREATIVE_ANALYSIS_LIMITATION')}</p>
        {creativeFileMessage && <p className={`mt-2 text-xs whitespace-pre-line ${creativeFileMessage.includes(getText(language, 'LABEL_ERROR_PREFIX')) || creativeFileMessage.includes(getText(language, 'MAX_CREATIVES_REACHED')) || creativeFileMessage.includes(getText(language, 'FILE_TYPE_INVALID')) ? 'text-red-600' : 'text-green-600'}`}>{creativeFileMessage}</p>}
        
        {uploadedCreatives.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-[#0A263B] mb-2">{getText(language, 'LABEL_UPLOADED_CREATIVES')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {uploadedCreatives.map(creative => (
                <div key={creative.name} className="relative group border border-gray-300 rounded p-1 bg-white">
                  <img src={creative.dataUrl} alt={creative.name} className="w-full h-20 object-contain rounded"/>
                  <p className="text-[10px] text-center text-gray-600 truncate mt-1" title={creative.name}>{creative.name}</p>
                  <button
                    type="button"
                    onClick={() => removeCreative(creative.name)}
                    disabled={isLoading}
                    className="absolute -top-2 -right-2 bg-[#F54963] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50"
                    aria-label={`${getText(language, 'BUTTON_REMOVE_CREATIVE')} ${creative.name}`}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {uploadedCreatives.length === 0 && !creativeFileMessage && (
             <p className="text-xs text-gray-500 mt-2">{getText(language, 'LABEL_NO_CREATIVES_UPLOADED')}</p>
        )}
      </div>

      <div>
        <label htmlFor="additionalContext" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
          {getText(language, 'LABEL_ADDITIONAL_CONTEXT')}
        </label>
        <textarea
          id="additionalContext"
          rows={3}
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder={ADDITIONAL_CONTEXT_PLACEHOLDER_FN(language)}
          className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm custom-scrollbar"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="specificQuestions" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
          {getText(language, 'LABEL_SPECIFIC_QUESTIONS')}
        </label>
        <textarea
          id="specificQuestions"
          rows={3}
          value={specificQuestions}
          onChange={(e) => setSpecificQuestions(e.target.value)}
          placeholder={SPECIFIC_QUESTIONS_PLACEHOLDER_FN(language)}
          className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm custom-scrollbar"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="brandStyle" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
          {getText(language, 'LABEL_BRAND_STYLE')}
        </label>
        <select
          id="brandStyle"
          value={selectedBrandStyle}
          onChange={(e) => onBrandStyleChange(e.target.value as BrandStyle)}
          disabled={isLoading}
          className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] text-sm"
        >
          {BRAND_STYLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || (dataBlocks.length === 0 && apiConnections.length === 0)}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#F54963] hover:bg-[#D93E52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#F54963] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {getText(language, 'BUTTON_GENERATING')}
          </>
        ) : (
          getText(language, 'BUTTON_GENERATE_INSIGHTS')
        )}
      </button>
    </form>
  );
};