// This service handles making the actual API calls to Google services
// after authentication has been successful.

declare namespace google.accounts.oauth2 {
    interface TokenResponse {
        access_token: string;
    }
}

const get30DaysAgo = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
};

const getToday = (): string => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Fetches data from the Google Analytics 4 Data API.
 * @param tokenResponse The token response object from Google authentication.
 * @param propertyId The GA4 Property ID.
 * @returns A promise that resolves with the GA4 report data.
 */
export const fetchGa4Data = async (tokenResponse: google.accounts.oauth2.TokenResponse, propertyId: string): Promise<any> => {
    console.log(`[SIMULATION] Would fetch GA4 data for property ID: ${propertyId}`);
    
    // In a real application, the following API call would be made.
    // For this prototype, we return mock data to ensure the connection flow completes.
    /*
    const API_URL = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    
    const requestBody = {
      dateRanges: [{ "startDate": get30DaysAgo(), "endDate": getToday() }],
      dimensions: [{ "name": "date" }, { "name": "sessionSource" }],
      metrics: [{ "name": "activeUsers" }, { "name": "sessions" }, { "name": "conversions" }]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("GA4 API Error Response:", data);
            const errorDetail = data.error?.message || `HTTP status ${response.status}`;
            throw new Error(`Failed to fetch GA4 data. ${errorDetail}`);
        }
        
        console.log("GA4 Data fetched successfully:", data);
        return data;

    } catch (error) {
        console.error("Error in fetchGa4Data:", error);
        throw error; // Re-throw to be caught by the component
    }
    */

    // Return mock data, now including the propertyId for better simulation
    return Promise.resolve({
        "rowCount": 5,
        "dimensionHeaders": [{"name": "date"}, {"name": "sessionSource"}],
        "metricHeaders": [{"name": "activeUsers"}, {"name": "sessions"}, {"name": "conversions"}],
        "rows": [
            {"dimensionValues": [{"value": "20240401"}, {"value": "google"}], "metricValues": [{"value": "1200"}, {"value": "1500"}, {"value": "50"}]},
            {"dimensionValues": [{"value": "20240401"}, {"value": "facebook"}], "metricValues": [{"value": "800"}, {"value": "1000"}, {"value": "30"}]},
            {"dimensionValues": [{"value": "20240402"}, {"value": "google"}], "metricValues": [{"value": "1250"}, {"value": "1550"}, {"value": "55"}]},
            {"dimensionValues": [{"value": "20240402"}, {"value": "facebook"}], "metricValues": [{"value": "820"}, {"value": "1050"}, {"value": "32"}]},
            {"dimensionValues": [{"value": "20240403"}, {"value": "(direct)"}], "metricValues": [{"value": "500"}, {"value": "600"}, {"value": "15"}]}
        ],
        "metadata": {
            "currencyCode": "USD",
            "timeZone": "America/Los_Angeles",
            "dataLossFromOtherRow": false,
            "sourcePropertyId": propertyId
        },
        "kind": "analyticsData#runReport"
    });
};

/**
 * Fetches data from the Google Ads API using a GAQL query.
 * @param tokenResponse The token response object from Google authentication.
 * @param customerId The Google Ads Customer ID (without hyphens).
 * @returns A promise that resolves with the Google Ads report data.
 */
export const fetchGoogleAdsData = async (tokenResponse: google.accounts.oauth2.TokenResponse, customerId: string): Promise<any> => {
    console.log(`[SIMULATION] Would fetch Google Ads data for customer ID: ${customerId}`);
    
    // The real Google Ads API is complex and requires a developer token.
    // We will simulate the response to allow the prototype to function.
    /*
    const API_URL = `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`;
    
    const query = `
        SELECT 
            campaign.name, 
            metrics.impressions, 
            metrics.clicks, 
            metrics.cost_micros, 
            metrics.conversions 
        FROM 
            campaign 
        WHERE 
            segments.date DURING LAST_30_DAYS
            AND campaign.status = 'ENABLED'
        ORDER BY 
            metrics.impressions DESC
        LIMIT 50
    `;

    const requestBody = {
        query: query
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json',
                // The developer token is typically required for Google Ads API.
                // It should be handled securely, e.g., via a backend proxy.
                // For this client-side example, we note its importance.
                // 'developer-token': 'YOUR_DEVELOPER_TOKEN', 
                'login-customer-id': customerId // MCC account ID if applicable, otherwise same as customerId
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();

        if (!response.ok) {
             try {
                const errorJson = JSON.parse(responseText);
                console.error("Google Ads API Error Response:", errorJson);
                const errorDetail = errorJson.error?.details?.[0]?.errors?.[0]?.message || errorJson.error?.message || `HTTP status ${response.status}`;
                throw new Error(`Failed to fetch Google Ads data. ${errorDetail}`);
             } catch(e) {
                 throw new Error(`Failed to fetch Google Ads data. HTTP status ${response.status}. Response: ${responseText}`);
             }
        }
        
        const data = JSON.parse(responseText);
        console.log("Google Ads Data fetched successfully:", data);
        return data;

    } catch (error) {
        console.error("Error in fetchGoogleAdsData:", error);
        if (error instanceof Error && error.message.includes("developer token")) {
            throw new Error("The Google Ads API request failed. This often requires a 'developer token' which is not configured in this client-side demo.");
        }
        throw error;
    }
    */

    // Return mock data, now including the customerId for better simulation
    return Promise.resolve([
      {
        "results": [
          {
            "campaign": { "resourceName": `customers/${customerId}/campaigns/1001`, "name": "Simulated Branding Campaign" },
            "metrics": { "impressions": "150000", "clicks": "3000", "costMicros": "500000000", "conversions": "120.0" }
          },
          {
            "campaign": { "resourceName": `customers/${customerId}/campaigns/1002`, "name": "Simulated Performance Campaign" },
            "metrics": { "impressions": "80000", "clicks": "4500", "costMicros": "750000000", "conversions": "250.0" }
          }
        ],
        "fieldMask": "campaign.name,metrics.impressions,metrics.clicks,metrics.costMicros,metrics.conversions",
        "requestId": `simulated-for-${customerId}-${Date.now()}`
      }
    ]);
};