import { ReactElement } from 'react';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // This will be the relative date string like "Hoy"
  fullDate: string; // This will be the full date string, e.g., an ISO string
  description?: string; // Optional description
  icon: ReactElement<IconProps>;
  iconBgColor: string;
  iconColor: string;
}

export interface BudgetCategory {
  id:string;
  name: string;
  spent: number;
  budget: number;
  icon: ReactElement<IconProps>;
  color: string;
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    // Fix: Made the 'text' property optional to accommodate AI messages that only contain rich content like reports or predictions.
    text?: string | ReactElement;
    // Add new optional properties for rich AI responses
    report?: AIReport;
    prediction?: AIPrediction;
}

export interface SavingTip {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  potentialSaving: number;
  frequency: 'Mensual';
  icon: ReactElement<IconProps>;
  implemented: boolean;
}

export interface IconProps {
    className?: string;
}

export interface NotificationSettingsState {
  phoneNumber: string;
  isVerified: boolean;
  pushEnabled: boolean;
  pushToken: string | null;
  notifications: {
    dailyUpdates: boolean;
    weeklyReports: boolean;
    paymentReminders: boolean;
    budgetAlerts: boolean;
    largeTransactions: boolean;
    monthlyGoals: boolean;
  };
  dndEnabled: boolean;
  emergencyAlerts: boolean;
  thresholds: {
    largeTransaction: number;
    dailyBudget: number;
    weeklyBudget: number;
  }
}

export interface User {
  _id: string;
  name: string;
  email: string;
  registrationDate: string;
  notificationPreferences?: Partial<NotificationSettingsState>;
}

// New type for AI Financial Analysis Report
export interface AIReport {
  month: string;
  totalExpenses: number;
  recommendedSavings: number;
  summary: string;
  recommendations: string[];
  risks: string[];
  categorySpending: { [key: string]: number };
}

// New type for AI Expense Prediction
export interface AIPrediction {
    nextMonth: string;
    predictedExpenses: { [key: string]: number };
    summary: string;
}