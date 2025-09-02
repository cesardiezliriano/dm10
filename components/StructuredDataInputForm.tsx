
import React, { useState } from 'react';
import { StructuredCampaignPlatform, TimePeriod, CampaignMetrics, StructuredInsightRequest, Language, UIStringKeys } from '../types.ts'; 
import { STRUCTURED_PLATFORM_OPTIONS, getTimePeriodLabel, getText } from '../constants.ts'; 

interface StructuredDataInputFormProps {
  onSubmit: (request: StructuredInsightRequest) => void; 
  isLoading: boolean;
  language: Language; 
}

const initialMetrics: CampaignMetrics = {
  impressions: 0,
  clicks: 0,
  conversions: 0,
  cost: 0,
};

export const StructuredDataInputForm: React.FC<StructuredDataInputFormProps> = ({ onSubmit, isLoading, language }) => {
  const [platform, setPlatform] = useState<StructuredCampaignPlatform>(StructuredCampaignPlatform.GOOGLE_ADS);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.DAYS_30);
  const [currentMetrics, setCurrentMetrics] = useState<CampaignMetrics>(initialMetrics);
  const [previousMetrics, setPreviousMetrics] = useState<CampaignMetrics>(initialMetrics);
  const [compare, setCompare] = useState<boolean>(false);

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>, period: 'current' | 'previous') => {
    const { name, value } = e.target;
    const valueAsNumber = value === '' ? 0 : parseFloat(value);
    const metricSetter = period === 'current' ? setCurrentMetrics : setPreviousMetrics;
    
    metricSetter(prev => ({
      ...prev,
      [name]: valueAsNumber
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate current metrics
    if (Object.values(currentMetrics).some(v => v < 0)) {
        alert(getText(language, 'ALERT_METRICS_NEGATIVE'));
        return;
    }
    if (currentMetrics.clicks > currentMetrics.impressions) {
        alert(getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS'));
        return;
    }
    
    let submissionRequest: StructuredInsightRequest = {
      platform,
      timePeriod,
      currentMetrics,
    };

    // Validate and include previous metrics if comparison is enabled
    if (compare) {
      const allPreviousFieldsZero = Object.values(previousMetrics).every(v => v === 0);
      if(allPreviousFieldsZero) {
        alert(getText(language, 'ALERT_PREVIOUS_METRICS_INCOMPLETE'));
        return;
      }
      if (Object.values(previousMetrics).some(v => v < 0)) {
        alert(getText(language, 'ALERT_METRICS_NEGATIVE'));
        return;
      }
      if (previousMetrics.clicks > previousMetrics.impressions) {
        alert(getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS'));
        return;
      }
      submissionRequest.previousMetrics = previousMetrics;
    }

    onSubmit(submissionRequest);
  };

  const metricInputFields: Array<{ name: keyof CampaignMetrics; labelKey: UIStringKeys; placeholder: string }> = [
    { name: 'impressions', labelKey: 'LABEL_IMPRESSIONS', placeholder: 'e.g., 100000' },
    { name: 'clicks', labelKey: 'LABEL_CLICKS', placeholder: 'e.g., 2000' },
    { name: 'conversions', labelKey: 'LABEL_CONVERSIONS', placeholder: 'e.g., 100' },
    { name: 'cost', labelKey: 'LABEL_COST', placeholder: 'e.g., 500.00' },
  ];
  
  const labelStyle = { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 };

  const renderMetricFields = (period: 'current' | 'previous') => {
    const metrics = period === 'current' ? currentMetrics : previousMetrics;
    return (
      <div className="grid grid-cols-2 gap-4">
        {metricInputFields.map(field => (
          <div key={`${period}-${field.name}`}>
            <label htmlFor={`${period}-${field.name}`} className="block text-xs font-medium text-[#6D7475] mb-1">
              {getText(language, field.labelKey)}
            </label>
            <input
              type="number"
              id={`${period}-${field.name}`}
              name={field.name}
              value={metrics[field.name] === 0 && document.activeElement?.id !== `${period}-${field.name}` ? '' : metrics[field.name]}
              onChange={(e) => handleMetricChange(e, period)}
              onFocus={(e) => e.target.select()}
              placeholder={field.placeholder} 
              min="0"
              step={field.name === 'cost' ? "0.01" : "1"}
              className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm"
              disabled={isLoading}
              required
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-[#0A263B]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="platform" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
            {getText(language, 'LABEL_PLATFORM')}
            </label>
            <select
            id="platform"
            name="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as StructuredCampaignPlatform)}
            disabled={isLoading}
            className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] text-sm"
            >
            {STRUCTURED_PLATFORM_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            </select>
        </div>
        <div>
            <label htmlFor="timePeriod" className="block text-sm font-medium text-[#0A263B] mb-1" style={labelStyle}>
            {getText(language, 'LABEL_TIME_PERIOD')}
            </label>
            <select
            id="timePeriod"
            name="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            disabled={isLoading}
            className="w-full p-3 bg-white border border-[#ACB4B6] rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] text-sm"
            >
            {Object.values(TimePeriod).map(tpValue => (
                <option key={tpValue} value={tpValue}>{getTimePeriodLabel(language, tpValue as TimePeriod)}</option>
            ))}
            </select>
        </div>
      </div>

      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <legend className="text-md font-medium text-[#0A263B] px-2" style={labelStyle}>
            {getText(language, 'SECTION_TITLE_CURRENT_PERIOD')}
        </legend>
        {renderMetricFields('current')}
      </fieldset>

      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="compare-period"
            aria-describedby="compare-period-description"
            name="compare-period"
            type="checkbox"
            checked={compare}
            onChange={(e) => setCompare(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-[#F54963] focus:ring-[#F54963]"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="compare-period" className="font-medium text-gray-900" style={labelStyle}>
            {getText(language, 'LABEL_COMPARE_PERIOD')}
          </label>
        </div>
      </div>
      
      {compare && (
        <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <legend className="text-md font-medium text-[#0A263B] px-2" style={labelStyle}>
                {getText(language, 'SECTION_TITLE_PREVIOUS_PERIOD')}
            </legend>
            {renderMetricFields('previous')}
        </fieldset>
      )}


      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#F54963] hover:bg-[#D93E52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#F54963] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {getText(language, 'BUTTON_GENERATING_SUMMARY')}
          </>
        ) : (
          getText(language, 'BUTTON_GENERATE_SUMMARY')
        )}
      </button>
    </form>
  );
};
