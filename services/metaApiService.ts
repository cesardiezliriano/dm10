
import { META_APP_ID } from '../constants.ts';

declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

let sdkInitializationPromise: Promise<void> | null = null;

/**
 * Initializes the Meta SDK. This function sets up the fbAsyncInit callback 
 * and returns a promise that resolves when the SDK is ready.
 * It's safe to call this multiple times; it will only initialize once.
 */
export const initializeMetaSdk = (): Promise<void> => {
    if (sdkInitializationPromise) {
        return sdkInitializationPromise;
    }

    sdkInitializationPromise = new Promise((resolve, reject) => {
        const appId = META_APP_ID;
        if (!appId || appId === 'YOUR_META_APP_ID_HERE') {
            const errorMsg = "Meta App ID is not configured.";
            console.warn(errorMsg);
            // We don't reject here, as the app can run without it.
            // Rejection will happen on attempted use.
            return resolve(); // Resolve to allow app to load.
        }

        // This is the core logic. Assign the init function to the window.
        // The script loaded from index.html will call this function.
        window.fbAsyncInit = function() {
            try {
                window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v20.0'
                });
                console.log("Meta SDK Initialized successfully via fbAsyncInit.");
                resolve(); // Resolve the promise once FB.init is called.
            } catch (e) {
                console.error("Error during FB.init:", e);
                reject(e);
            }
        };
    });

    return sdkInitializationPromise;
};


export const loginToMeta = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            await initializeMetaSdk();
            
            if (typeof window.FB === 'undefined') {
                return reject(new Error("Meta SDK could not be initialized, possibly due to a missing App ID or network issue."));
            }

            // Security check required by Facebook
            if (window.location.protocol !== 'https:') {
                console.error("Attempted to call FB.login from a non-HTTPS page.");
                return reject(new Error("HTTPS_REQUIRED"));
            }

            window.FB.getLoginStatus((response: any) => {
                if (response.status === 'connected') {
                    console.log("Meta user is already connected.");
                    resolve(response);
                } else {
                    // Not connected, so we initiate the login flow.
                    window.FB.login((loginResponse: any) => {
                        if (loginResponse.authResponse) {
                            console.log('Meta Login Success: Welcome!');
                            resolve(loginResponse);
                        } else {
                            console.log('User cancelled Meta login or did not fully authorize.');
                            resolve(null); // Resolve with null to indicate cancellation without erroring.
                        }
                    }, { scope: 'public_profile,email,ads_read,read_insights' });
                }
            });
        } catch(error) {
            console.error("Error in loginToMeta flow:", error);
            reject(error);
        }
    });
};


export const logoutFromMeta = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            await initializeMetaSdk();
            if (typeof window.FB === 'undefined') return resolve(); // Nothing to do

            window.FB.getLoginStatus((response: any) => {
                if (response.status === 'connected') {
                    window.FB.logout(() => {
                        console.log("Logged out from Meta.");
                        resolve();
                    });
                } else {
                     console.log("No active Meta session to log out from.");
                     resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};


export const fetchMetaAdsData = (accessToken: string): Promise<any> => {
     return new Promise(async (resolve, reject) => {
        try {
            await initializeMetaSdk();
            if (typeof window.FB === 'undefined') {
                return reject(new Error("Meta SDK not initialized."));
            }

            // First, get the user's ad accounts
            window.FB.api('/me/adaccounts', { fields: 'name,account_id', access_token: accessToken }, (response: any) => {
                if (response && !response.error) {
                    if (response.data && response.data.length > 0) {
                        // For this demo, we'll fetch insights for the first ad account
                        const adAccountId = response.data[0].account_id;
                        
                        window.FB.api(
                            `/${adAccountId}/insights`,
                            { 
                                fields: 'impressions,clicks,spend,conversions,cpc,ctr,cpm',
                                date_preset: 'last_30d',
                                access_token: accessToken,
                            },
                            (insightResponse: any) => {
                                if (insightResponse && !insightResponse.error) {
                                    resolve({
                                        adAccounts: response.data,
                                        insightsSummary: insightResponse.data
                                    });
                                } else {
                                    reject(new Error(insightResponse.error?.message || 'Failed to fetch Meta Ads insights.'));
                                }
                            }
                        );

                    } else {
                        resolve({ message: "No ad accounts found for this user." });
                    }
                } else {
                    reject(new Error(response.error?.message || 'Failed to fetch Meta Ad Accounts.'));
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};
