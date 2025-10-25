import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NotificationSettingsState } from '../types';
import { getNotificationPreferences, updateNotificationPreferences } from '../services/finaicerApiService';

interface NotificationSettingsContextType {
  settings: NotificationSettingsState;
  setSettings: React.Dispatch<React.SetStateAction<NotificationSettingsState>>;
  toggleSmsNotification: (key: keyof NotificationSettingsState['notifications']) => void;
  setPhoneNumber: (phone: string) => void;
  fetchPreferences: (token: string) => Promise<void>;
  savePreferences: (settings: NotificationSettingsState, token: string) => Promise<void>;
}

const SmsSettingsContext = createContext<NotificationSettingsContextType | undefined>(undefined);

const initialState: NotificationSettingsState = {
  phoneNumber: '',
  isVerified: false,
  pushEnabled: true,
  pushToken: null,
  notifications: {
    dailyUpdates: true,
    weeklyReports: true,
    paymentReminders: false,
    budgetAlerts: true,
    largeTransactions: true,
    monthlyGoals: true,
  },
  dndEnabled: true,
  emergencyAlerts: true,
  thresholds: {
    largeTransaction: 200,
    dailyBudget: 80,
    weeklyBudget: 90,
  }
};

export const SmsSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettingsState>(initialState);

  const fetchPreferences = async (token: string) => {
    try {
        const savedPreferences = await getNotificationPreferences(token);
        // Merge saved preferences with initial state to ensure all keys are present
        setSettings(prev => ({...prev, ...savedPreferences}));
    } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
    }
  };

  const savePreferences = async (currentSettings: NotificationSettingsState, token: string) => {
    try {
      const updatedPreferences = await updateNotificationPreferences(currentSettings, token);
      setSettings(prev => ({...prev, ...updatedPreferences}));
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      throw error; // Re-throw to be caught by the UI
    }
  };

  const toggleSmsNotification = (key: keyof NotificationSettingsState['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };
  
  const setPhoneNumber = (phone: string) => {
      setSettings(prev => ({ ...prev, phoneNumber: phone }));
  }

  return (
    <SmsSettingsContext.Provider value={{ settings, setSettings, toggleSmsNotification, setPhoneNumber, fetchPreferences, savePreferences }}>
      {children}
    </SmsSettingsContext.Provider>
  );
};

export const useSmsSettingsContext = () => {
  const context = useContext(SmsSettingsContext);
  if (context === undefined) {
    throw new Error('useSmsSettingsContext must be used within a SmsSettingsProvider');
  }
  return context;
};