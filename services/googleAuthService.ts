
import { GOOGLE_CLIENT_ID, GOOGLE_ADS_SCOPES, GA4_SCOPES } from '../constants.ts';
import { DataSource } from '../types.ts';

declare namespace google.accounts.oauth2 {
    interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
        error_uri?: string;
    }

    interface TokenClient {
        requestAccessToken: (options?: { prompt: string }) => void;
    }

    interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (tokenResponse: TokenResponse) => void;
        error_callback?: (error: any) => void;
    }
    
    function initTokenClient(config: TokenClientConfig): TokenClient;
    function revoke(token: string, done: () => void): void;
}

declare global {
    interface Window {
        google: {
            accounts: {
                oauth2: typeof google.accounts.oauth2;
            }
        };
    }
}

// Store tokens in memory. In a real-world app, this might be handled more robustly.
const tokenClients: { [key in DataSource]?: google.accounts.oauth2.TokenClient } = {};
const accessTokens: { [key in DataSource]?: google.accounts.oauth2.TokenResponse } = {};


const getScopeForSource = (source: DataSource.GOOGLE_ADS | DataSource.GA4): string => {
    return source === DataSource.GOOGLE_ADS ? GOOGLE_ADS_SCOPES : GA4_SCOPES;
};


export const initiateGoogleAuth = (source: DataSource.GOOGLE_ADS | DataSource.GA4): Promise<google.accounts.oauth2.TokenResponse> => {
    return new Promise((resolve, reject) => {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            return reject(new Error('Google Client ID is not configured.'));
        }
        if (typeof window.google === 'undefined' || typeof window.google.accounts === 'undefined') {
            return reject(new Error('Google Identity Services library is not loaded.'));
        }

        const scope = getScopeForSource(source);

        const callback = (tokenResponse: google.accounts.oauth2.TokenResponse) => {
            if (tokenResponse.error) {
                console.error(`Google Auth Error for ${source}:`, tokenResponse);
                if (tokenResponse.error === 'access_denied') {
                    // Reject with a specific error type that the UI can catch
                    reject(new Error('PERMISSION_DENIED'));
                } else {
                    reject(new Error(`An error occurred during authentication: ${tokenResponse.error_description || tokenResponse.error}`));
                }
                return;
            }
            console.log(`Google Auth Success for ${source}: Token received.`);
            accessTokens[source] = tokenResponse;
            resolve(tokenResponse);
        };
        
        const error_callback = (error: any) => {
             if (error && (error.type === 'popup_closed' || error.type === 'popup_closed_by_user')) {
                // This is a user cancellation, not a technical error. Log it as info.
                console.log(`Google Auth for ${source} was cancelled by the user (popup closed).`);
                reject(new Error('POPUP_CLOSED'));
             } else {
                 // This is a technical error.
                console.error(`Google Auth Error Callback for ${source}:`, error);
                reject(new Error(`Google Authentication failed: ${error.type || 'Unknown error'}`));
             }
        };

        // Check if a client for this scope already exists
        if (tokenClients[source]) {
            tokenClients[source].requestAccessToken({ prompt: 'consent' }); // Re-prompt for consent if needed
        } else {
             try {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: scope,
                    callback: callback,
                    error_callback: error_callback
                });
                tokenClients[source] = client;
                client.requestAccessToken({ prompt: 'consent' }); // Initial request
             } catch (initError) {
                 console.error(`Failed to initialize Google Token Client for ${source}:`, initError);
                 reject(new Error('Failed to initialize Google Authentication service.'));
             }
        }
    });
};

export const revokeGoogleToken = (source: DataSource.GOOGLE_ADS | DataSource.GA4): Promise<void> => {
    return new Promise((resolve, reject) => {
        const token = accessTokens[source]?.access_token;
        if (token) {
            window.google.accounts.oauth2.revoke(token, () => {
                console.log(`Token for ${source} revoked successfully.`);
                delete accessTokens[source];
                // Note: We don't delete the tokenClient instance, it can be reused.
                resolve();
            });
        } else {
            console.warn(`No active token found for ${source} to revoke.`);
            resolve(); // Resolve even if no token, as the state is effectively "disconnected"
        }
    });
};
