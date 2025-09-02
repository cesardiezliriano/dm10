
import React, { useState } from 'react';
import { DataSource, Language, ApiConnection, UIStringKeys } from '../types.ts';
import { getText, API_CONNECTOR_LIST, GOOGLE_CLIENT_ID, META_APP_ID } from '../constants.ts';
import { initiateGoogleAuth, revokeGoogleToken } from '../services/googleAuthService.ts';
import { fetchGa4Data, fetchGoogleAdsData } from '../services/googleApiService.ts';
import { loginToMeta, logoutFromMeta, fetchMetaAdsData } from '../services/metaApiService.ts';


interface ApiConnectorProps {
  language: Language;
  isLoading: boolean;
  connections: ApiConnection[];
  onConnect: (connection: ApiConnection) => void;
  onDisconnect: (source: DataSource) => void;
}

const ConnectionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);


export const ApiConnector: React.FC<ApiConnectorProps> = ({ language, isLoading, connections, onConnect, onDisconnect }) => {
  const [connectingSource, setConnectingSource] = useState<DataSource | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGoogleClientIdConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';
  const isMetaAppIdConfigured = META_APP_ID && META_APP_ID !== 'YOUR_META_APP_ID_HERE';

  const handleMetaConnect = async () => {
    setConnectingSource(DataSource.META_ADS);
    setError(null);
    try {
        const loginResponse = await loginToMeta();
        if (loginResponse && loginResponse.authResponse) {
            const adsData = await fetchMetaAdsData(loginResponse.authResponse.accessToken);
            onConnect({ source: DataSource.META_ADS, data: adsData });
        } else {
            console.log("Meta login was not completed by the user.");
        }
    } catch (err: unknown) {
        console.error("Error during Meta connection:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage === "HTTPS_REQUIRED") {
             setError(getText(language, 'ERROR_META_HTTPS_REQUIRED'));
        } else {
            setError(getText(language, 'ERROR_META_AUTH', errorMessage));
        }
    } finally {
        setConnectingSource(null);
    }
  };


  const handleGoogleConnect = async (source: DataSource.GOOGLE_ADS | DataSource.GA4) => {
    setConnectingSource(source);
    setError(null);
    try {
      const tokenResponse = await initiateGoogleAuth(source);
      
      let fetchedData;
      if (source === DataSource.GOOGLE_ADS) {
        const customerId = window.prompt(getText(language, 'PROMPT_GOOGLE_ADS_CUSTOMER_ID'));
        if (!customerId) { setConnectingSource(null); return; }
        fetchedData = await fetchGoogleAdsData(tokenResponse, customerId.replace(/-/g, ''));
      } else { // GA4
        const propertyId = window.prompt(getText(language, 'PROMPT_GA4_PROPERTY_ID'));
        if (!propertyId) { setConnectingSource(null); return; }
        fetchedData = await fetchGa4Data(tokenResponse, propertyId);
      }
      
      onConnect({ source, data: fetchedData });

    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message === 'POPUP_CLOSED') {
                // User cancelled. This is expected, not an error to display.
                console.log(`Connection attempt to ${source} was cancelled by the user.`);
                setError(null);
            } else if (err.message === 'PERMISSION_DENIED') {
                console.warn(`Connection to ${source} failed: Permission was denied by the user.`);
                setError(getText(language, 'ERROR_GOOGLE_AUTH_PERMISSION_DENIED'));
            } else {
                // For other, more technical errors.
                console.error(`Error connecting to ${source}:`, err);
                const formattedError = getText(language, 'ERROR_GOOGLE_AUTH', err.message);
                setError(formattedError);
            }
        } else {
            console.error(`An unknown error occurred while connecting to ${source}:`, err);
            const unknownError = getText(language, 'ERROR_GOOGLE_AUTH', String(err));
            setError(unknownError);
        }
    } finally {
        setConnectingSource(null);
    }
  };
  
  const handleDisconnect = (source: DataSource) => {
      const connection = connections.find(c => c.source === source);
      if (connection) {
        if (source === DataSource.GOOGLE_ADS || source === DataSource.GA4) {
             revokeGoogleToken(source).catch(err => console.warn(`Failed to revoke token for ${source}:`, err));
        } else if (source === DataSource.META_ADS) {
            logoutFromMeta().catch(err => console.warn(`Failed to logout from Meta:`, err));
        }
      }
      onDisconnect(source);
  };

  const handleConnectClick = (source: DataSource, isGoogle: boolean) => {
    setError(null); // Clear previous errors on a new attempt
    if (isGoogle) {
      handleGoogleConnect(source as DataSource.GOOGLE_ADS | DataSource.GA4);
    } else if (source === DataSource.META_ADS) {
      handleMetaConnect();
    }
  };

  const labelStyle = { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 };

  return (
    <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
        <legend className="text-md font-medium text-[#0A263B] px-2" style={labelStyle}>
          {getText(language, 'SECTION_TITLE_API_CONNECTORS')}
        </legend>
        <p className="text-sm text-gray-500 px-2 -mt-2">
            {getText(language, 'API_CONNECTORS_SUBTITLE')}
        </p>

        {(!isGoogleClientIdConfigured || !isMetaAppIdConfigured) && (
            <div className="p-3 text-xs text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md space-y-1">
                {!isGoogleClientIdConfigured && <p>{getText(language, 'LABEL_GOOGLE_CLIENT_ID_CONFIG_WARNING')}</p>}
                {!isMetaAppIdConfigured && <p>{getText(language, 'LABEL_META_APP_ID_CONFIG_WARNING')}</p>}
            </div>
        )}
        {error && (
             <div className="p-3 text-xs text-red-800 bg-red-100 border border-red-300 rounded-md">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {API_CONNECTOR_LIST.map(({ id, name, isGoogle }) => {
                const connection = connections.find(c => c.source === id);
                const isConnected = !!connection;
                const isThisOneConnecting = connectingSource === id;
                const isConfigMissing = (isGoogle && !isGoogleClientIdConfigured) || (!isGoogle && !isMetaAppIdConfigured);
                const isDisabled = isConfigMissing || isLoading || !!connectingSource;

                let statusTextKey: UIStringKeys = 'STATUS_DISCONNECTED';
                if (isConnected) statusTextKey = 'STATUS_CONNECTED';
                if (isThisOneConnecting) statusTextKey = 'STATUS_CONNECTING';

                return (
                    <div key={id} className={`p-3 border rounded-md flex flex-col justify-between transition-colors ${isConnected ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                        <div className="flex items-center mb-3">
                            <ConnectionIcon />
                            <span className="font-semibold text-sm text-[#0A263B]">{name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                isConnected ? 'bg-green-200 text-green-800' : 
                                isThisOneConnecting ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'
                            }`}>
                                {getText(language, statusTextKey)}
                            </span>
                            {isConnected ? (
                                <button
                                    type="button"
                                    onClick={() => handleDisconnect(id)}
                                    disabled={isLoading || !!connectingSource}
                                    className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    {getText(language, 'BUTTON_DISCONNECT')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleConnectClick(id, isGoogle)}
                                    disabled={isDisabled}
                                    className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-[#36A7B7] hover:bg-[#2A8E9A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isThisOneConnecting ? '...' : getText(language, 'BUTTON_CONNECT')}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {connections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-[#0A263B] mb-2" style={labelStyle}>{getText(language, 'API_DATA_SUMMARY_HEADER')}</h4>
                <div className="space-y-2">
                {connections.map(conn => (
                    <div key={conn.source} className="p-2 bg-white border border-gray-200 rounded-md text-xs">
                        <strong className="text-green-800">{conn.source}:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-600 text-[10px] max-h-20 overflow-auto custom-scrollbar">
                            {JSON.stringify(conn.data, null, 2)}
                        </pre>
                    </div>
                ))}
                </div>
            </div>
        )}
    </fieldset>
  );
};