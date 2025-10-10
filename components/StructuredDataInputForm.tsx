import React, { useState, useEffect } from 'react';
import { StructuredCampaignPlatform, TimePeriod, CampaignMetrics, StructuredInsightRequest, Language, UIStringKeys } from '../types.ts'; 
import { STRUCTURED_PLATFORM_OPTIONS, getTimePeriodOptions, getText } from '../constants.ts'; 

interface StructuredDataInputFormProps {
  onSubmit: (request: StructuredInsightRequest) => void; 
  isLoading: boolean;
  language: Language; 
}

interface CalculatedMetrics {
    ctr: number;
    cpc: number;
    cpa: number;
    cvr: number;
}

const initialMetrics: CampaignMetrics = {
  impressions: 0,
  clicks: 0,
  conversions: 0,
  cost: 0,
};

const initialMetricsInput = { impressions: '', clicks: '', conversions: '', cost: '' };

const initialCalculatedMetrics: CalculatedMetrics = {
    ctr: 0,
    cpc: 0,
    cpa: 0,
    cvr: 0,
};

// Helper to get date string in YYYY-MM-DD format
const getISODateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const TrendIndicator: React.FC<{ change: number, isPositiveGood: boolean }> = ({ change, isPositiveGood }) => {
    if (isNaN(change) || !isFinite(change) || change === 0) {
        return <span className="text-gray-500" title="No change">—</span>;
    }

    const isGood = isPositiveGood ? change > 0 : change < 0;
    const color = isGood ? 'text-green-500' : 'text-red-500';
    const Icon = change > 0 
        ? () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L6.22 8.78a.75.75 0 11-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
        : () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.03-3.176a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L6.22 12.28a.75.75 0 111.06-1.06l3.03 3.176V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>;

    return (
        <span className={`flex items-center text-xs font-semibold ${color}`} title={`${(change * 100).toFixed(1)}% change`}>
            <Icon />
            <span>{Math.abs(change * 100).toFixed(1)}%</span>
        </span>
    );
};


export const StructuredDataInputForm: React.FC<StructuredDataInputFormProps> = ({ onSubmit, isLoading, language }) => {
  const [platform, setPlatform] = useState<StructuredCampaignPlatform>(StructuredCampaignPlatform.GOOGLE_ADS);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.DAYS_30);
  
  const [startDate, setStartDate] = useState<string>(() => getISODateString(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState<string>(() => getISODateString(new Date()));
  
  // State for numeric values used in calculations
  const [currentMetrics, setCurrentMetrics] = useState<CampaignMetrics>(initialMetrics);
  const [previousMetrics, setPreviousMetrics] = useState<CampaignMetrics>(initialMetrics);
  
  // State for string values displayed in input fields to handle locale formatting
  const [currentMetricsInput, setCurrentMetricsInput] = useState(initialMetricsInput);
  const [previousMetricsInput, setPreviousMetricsInput] = useState(initialMetricsInput);

  const [currentCalculated, setCurrentCalculated] = useState<CalculatedMetrics>(initialCalculatedMetrics);
  const [previousCalculated, setPreviousCalculated] = useState<CalculatedMetrics>(initialCalculatedMetrics);
  const [compare, setCompare] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [comparisonPeriodLabel, setComparisonPeriodLabel] = useState<string>('');

  const timePeriodOptions = getTimePeriodOptions(language);

  // Helper to parse a locale-specific string into a number
  const parseLocaleNumber = (str: string, lang: Language): number => {
      if (typeof str !== 'string' || str.trim() === '') return 0;
      
      let standardString: string;
      if (lang === Language.ES) {
          // For Spanish: remove thousand separators (.) and replace decimal separator (,) with a dot.
          standardString = str.replace(/\./g, '').replace(',', '.');
      } else { // For English (EN) and fallback
          // For English: remove thousand separators (,). The dot is already the decimal separator.
          standardString = str.replace(/,/g, '');
      }

      const num = parseFloat(standardString);
      return isNaN(num) ? 0 : num;
  };

  // Helper to format a number into a locale-specific string for display on blur
  const formatNumberForDisplay = (num: number, lang: Language, field: keyof CampaignMetrics): string => {
      if (num === 0) return ''; // Show empty string for 0, easier for user to start typing.
      const locale = lang === Language.ES ? 'es-ES' : 'en-US';
      const isCost = field === 'cost';
      
      const options: Intl.NumberFormatOptions = {
          useGrouping: true,
          minimumFractionDigits: isCost ? 2 : 0,
          maximumFractionDigits: isCost ? 2 : 0,
      };

      return new Intl.NumberFormat(locale, options).format(num);
  };

  useEffect(() => {
    const calculate = (metrics: CampaignMetrics): CalculatedMetrics => {
        const clicks = metrics.clicks || 0;
        const impressions = metrics.impressions || 0;
        const conversions = metrics.conversions || 0;
        const cost = metrics.cost || 0;

        return {
            ctr: impressions > 0 ? (clicks / impressions) : 0,
            cpc: clicks > 0 ? (cost / clicks) : 0,
            cpa: conversions > 0 ? (cost / conversions) : 0,
            cvr: clicks > 0 ? (conversions / clicks) : 0,
        };
    };

    const newErrors: { [key: string]: string } = {};
    if (currentMetrics.clicks > currentMetrics.impressions) {
        newErrors.currentClicks = getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS');
        newErrors.currentImpressions = getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS');
    }
    if (compare && previousMetrics.clicks > previousMetrics.impressions) {
        newErrors.previousClicks = getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS');
        newErrors.previousImpressions = getText(language, 'ALERT_CLICKS_GT_IMPRESSIONS');
    }
    if (timePeriod === TimePeriod.CUSTOM && startDate && endDate && new Date(startDate) > new Date(endDate)) {
        newErrors.dateRange = language === Language.ES ? 'La fecha de inicio no puede ser posterior a la fecha de fin.' : 'Start date cannot be after end date.';
    }
    
    setErrors(newErrors);
    
    setCurrentCalculated(calculate(currentMetrics));
    if (compare) {
        setPreviousCalculated(calculate(previousMetrics));
    }
  }, [currentMetrics, previousMetrics, compare, language, timePeriod, startDate, endDate]);

  useEffect(() => {
    if (compare && timePeriod === TimePeriod.CUSTOM && startDate && endDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate duration in days (inclusive). Using UTC methods avoids DST issues.
        const durationMs = end.getTime() - start.getTime();
        const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24)) + 1;
        
        if (durationDays <= 0) {
            setComparisonPeriodLabel('');
            return;
        }

        // Calculate previous period.
        const prevEnd = new Date(start);
        prevEnd.setUTCDate(start.getUTCDate() - 1);

        const prevStart = new Date(prevEnd);
        prevStart.setUTCDate(prevEnd.getUTCDate() - (durationDays - 1));
        
        const locale = language === Language.ES ? 'es-ES' : 'en-US';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
        
        const label = `(${language === Language.ES ? 'Compara con:' : 'Compares to:'} ${prevStart.toLocaleDateString(locale, options)} - ${prevEnd.toLocaleDateString(locale, options)})`;
        setComparisonPeriodLabel(label);
      } catch (e) {
        console.error("Error calculating comparison period:", e);
        setComparisonPeriodLabel(''); // Clear label on error
      }
    } else {
      setComparisonPeriodLabel('');
    }
  }, [compare, timePeriod, startDate, endDate, language]);
  
  // Reformat input display values when language changes
  useEffect(() => {
      const reformatInputs = (metrics: CampaignMetrics, setter: React.Dispatch<React.SetStateAction<typeof initialMetricsInput>>) => {
          setter({
              impressions: formatNumberForDisplay(metrics.impressions, language, 'impressions'),
              clicks: formatNumberForDisplay(metrics.clicks, language, 'clicks'),
              conversions: formatNumberForDisplay(metrics.conversions, language, 'conversions'),
              cost: formatNumberForDisplay(metrics.cost, language, 'cost'),
          });
      };
      reformatInputs(currentMetrics, setCurrentMetricsInput);
      if (compare) {
          reformatInputs(previousMetrics, setPreviousMetricsInput);
      }
  }, [language]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, period: 'current' | 'previous') => {
      const { name, value } = e.target;
      const key = name as keyof CampaignMetrics;

      // Update the string state that is directly bound to the input field
      const stringSetter = period === 'current' ? setCurrentMetricsInput : setPreviousMetricsInput;
      stringSetter(prev => ({ ...prev, [key]: value }));

      // Parse the input string to a number and update the numeric state used for calculations
      const parsedValue = parseLocaleNumber(value, language);
      const numberSetter = period === 'current' ? setCurrentMetrics : setPreviousMetrics;
      numberSetter(prev => ({ ...prev, [key]: parsedValue >= 0 ? parsedValue : 0 }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, period: 'current' | 'previous') => {
      const { name } = e.target;
      const key = name as keyof CampaignMetrics;
      
      // Get the true numeric value from the number state
      const metrics = period === 'current' ? currentMetrics : previousMetrics;
      const numericValue = metrics[key];

      // Format it for display and update the string state
      const formattedValue = formatNumberForDisplay(numericValue, language, key);
      const stringSetter = period === 'current' ? setCurrentMetricsInput : setPreviousMetricsInput;
      stringSetter(prev => ({ ...prev, [key]: formattedValue }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return; // Do not submit if there are validation errors
    }
    
    let submissionRequest: StructuredInsightRequest = {
      platform,
      timePeriod,
      currentMetrics,
    };

    if (timePeriod === TimePeriod.CUSTOM) {
      submissionRequest.startDate = startDate;
      submissionRequest.endDate = endDate;
    }

    if (compare) {
      const allPreviousFieldsZero = Object.values(previousMetrics).every(v => v === 0);
      if(allPreviousFieldsZero) {
        setErrors(prev => ({...prev, previousPeriod: getText(language, 'ALERT_PREVIOUS_METRICS_INCOMPLETE')}));
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
    { name: 'cost', labelKey: 'LABEL_COST', placeholder: language === Language.ES ? 'e.g., 500,00' : 'e.g., 500.00' },
  ];
  
  const labelStyle = { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 };

  const renderMetricFields = (period: 'current' | 'previous') => {
    const metricsInput = period === 'current' ? currentMetricsInput : previousMetricsInput;
    const periodErrors = Object.keys(errors)
      .filter(key => key.startsWith(period))
      .reduce((obj, key) => {
        obj[key.replace(period, '').toLowerCase()] = errors[key];
        return obj;
      }, {} as {[key: string]: string});

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {metricInputFields.map(field => (
          <div key={`${period}-${field.name}`}>
            <label htmlFor={`${period}-${field.name}`} className="block text-xs font-medium text-[#6D7475] mb-1">
              {getText(language, field.labelKey)}
            </label>
            <input
              type="text"
              inputMode="decimal"
              id={`${period}-${field.name}`}
              name={field.name}
              value={metricsInput[field.name]}
              onChange={(e) => handleInputChange(e, period)}
              onBlur={(e) => handleBlur(e, period)}
              onFocus={(e) => e.target.select()}
              placeholder={field.placeholder} 
              className={`w-full p-2 bg-white border rounded-md shadow-sm focus:ring-[#F54963] focus:border-[#F54963] text-[#0A263B] placeholder-[#878E90] text-sm ${periodErrors[field.name.toLowerCase()] ? 'border-red-500' : 'border-[#ACB4B6]'}`}
              disabled={isLoading}
            />
          </div>
        ))}
         {Object.values(periodErrors).length > 0 && <p className="col-span-2 text-xs text-red-600 mt-1">{Object.values(periodErrors)[0]}</p>}
      </div>
    );
  }

  const renderCalculatedMetrics = (calculated: CalculatedMetrics, baseMetrics: CampaignMetrics, compareCalculated?: CalculatedMetrics) => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    const formatCurrency = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
    const formatPercent = (value: number) => `${(value * 100).toFixed(2).replace('.', ',')}%`; // Always use comma for percent in this UI display

    const metrics = [
        { label: 'CTR', value: formatPercent(calculated.ctr), compareValue: compareCalculated?.ctr, isPositiveGood: true },
        { label: 'CPC', value: formatCurrency(calculated.cpc), compareValue: compareCalculated?.cpc, isPositiveGood: false },
        { label: 'CPA', value: formatCurrency(calculated.cpa), compareValue: compareCalculated?.cpa, isPositiveGood: false },
        { label: 'CVR', value: formatPercent(calculated.cvr), compareValue: compareCalculated?.cvr, isPositiveGood: true },
    ];

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
            {metrics.map(metric => (
                <div key={metric.label} className="text-xs">
                    <span className="font-semibold text-gray-600">{metric.label}:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-gray-800">{metric.value}</span>
                      {compareCalculated && typeof metric.compareValue === 'number' && (
                          <TrendIndicator change={(calculated[metric.label.toLowerCase() as keyof CalculatedMetrics] / metric.compareValue) - 1} isPositiveGood={metric.isPositiveGood} />
                      )}
                    </div>
                </div>
            ))}
        </div>
    );
  };

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
            {timePeriodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            </select>
        </div>
      </div>

       {timePeriod === TimePeriod.CUSTOM && (
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/70">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="start-date" className="block text-xs font-medium text-[#6D7475] mb-1">
                        {language === Language.ES ? 'Fecha de Inicio' : 'Start Date'}
                    </label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isLoading} max={endDate} className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm text-sm" />
                </div>
                 <div>
                    <label htmlFor="end-date" className="block text-xs font-medium text-[#6D7475] mb-1">
                        {language === Language.ES ? 'Fecha de Fin' : 'End Date'}
                    </label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isLoading} min={startDate} className="w-full p-2 bg-white border border-[#ACB4B6] rounded-md shadow-sm text-sm" />
                </div>
            </div>
            {errors.dateRange && <p className="text-xs text-red-600 mt-2">{errors.dateRange}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="space-y-2 p-3 border border-gray-200 rounded-lg">
            <legend className="text-md font-medium text-[#0A263B] px-2 text-sm" style={labelStyle}>
                {getText(language, 'SECTION_TITLE_CURRENT_PERIOD')}
            </legend>
            {renderMetricFields('current')}
            <div className="pt-2 border-t border-gray-200/60">
              {renderCalculatedMetrics(currentCalculated, currentMetrics, compare ? previousCalculated : undefined)}
            </div>
        </fieldset>

        <div>
            <div className="relative flex items-start mb-4">
                <div className="flex h-6 items-center">
                <input
                    id="compare-period"
                    name="compare-period"
                    type="checkbox"
                    checked={compare}
                    onChange={(e) => setCompare(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-[#F54963] focus:ring-[#F54963]"
                />
                </div>
                <div className="ml-3 text-sm leading-6">
                <label htmlFor="compare-period" className="font-medium text-gray-900" style={{...labelStyle, fontSize: '0.9rem'}}>
                    {getText(language, 'LABEL_COMPARE_PERIOD')}
                </label>
                {comparisonPeriodLabel && <span className="ml-2 text-xs text-gray-500">{comparisonPeriodLabel}</span>}
                </div>
            </div>
            
            {compare && (
                <fieldset className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50/70 transition-opacity duration-300">
                    <legend className="text-md font-medium text-[#0A263B] px-2 text-sm" style={labelStyle}>
                        {getText(language, 'SECTION_TITLE_PREVIOUS_PERIOD')}
                    </legend>
                    {renderMetricFields('previous')}
                     <div className="pt-2 border-t border-gray-200/60">
                        {renderCalculatedMetrics(previousCalculated, previousMetrics)}
                    </div>
                    {errors.previousPeriod && <p className="text-xs text-red-600 mt-1">{errors.previousPeriod}</p>}
                </fieldset>
            )}
        </div>
      </div>


      <button
        type="submit"
        disabled={isLoading || Object.keys(errors).length > 0}
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