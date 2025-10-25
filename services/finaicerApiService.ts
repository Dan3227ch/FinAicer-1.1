import { AIReport, AIPrediction, NotificationSettingsState } from '../types';
const API_URL = 'http://localhost:3000/api'; // Point directly to the backend server

// Generic fetch wrapper to handle auth and errors
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, token: string) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // Handle cases with no JSON response body
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } 
    return {};
};

/**
 * Sends a user message to the AI chat backend.
 * @param message The user's message.
 * @param token The user's JWT.
 * @returns The AI's text response.
 */
export const sendMessageToAI = async (message: string, token: string): Promise<string> => {
    const data = await fetchWithAuth('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
    }, token);
    return data.response;
};

/**
 * Requests a financial analysis from the backend.
 * @param token The user's JWT.
 * @returns A structured AIReport object.
 */
export const analyzeFinances = async (token: string): Promise<AIReport> => {
    return fetchWithAuth('/ai/analyze', { method: 'POST' }, token);
};

/**
 * Requests an expense prediction from the backend.
 * @param token The user's JWT.
 * @returns A structured AIPrediction object.
 */
export const predictExpenses = async (token: string): Promise<AIPrediction> => {
    return fetchWithAuth('/ai/predict', { method: 'POST' }, token);
};

// --- Notification Services ---

/**
 * Fetches the user's current notification preferences.
 * @param token The user's JWT.
 * @returns The user's notification settings.
 */
export const getNotificationPreferences = async (token: string): Promise<Partial<NotificationSettingsState>> => {
    // This endpoint should be added to auth.routes to return user.notificationPreferences
    const userProfile = await fetchWithAuth('/auth/profile', { method: 'GET' }, token);
    return userProfile.notificationPreferences || {};
};

/**
 * Updates the user's notification preferences.
 * @param preferences The settings object to save.
 * @param token The user's JWT.
 * @returns The updated notification settings.
 */
export const updateNotificationPreferences = async (preferences: NotificationSettingsState, token: string): Promise<NotificationSettingsState> => {
    return fetchWithAuth('/notifications/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
    }, token);
};


/**
 * Sends a test push notification to the current user.
 * @param token The user's JWT.
 * @returns A confirmation message.
 */
export const sendTestPush = async (token: string): Promise<{ msg: string }> => {
    return fetchWithAuth('/notifications/test-push', { method: 'POST' }, token);
};