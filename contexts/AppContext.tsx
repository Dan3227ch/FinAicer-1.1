import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SavingTip } from '../types';
import { initialSavingTips } from '../constants';

interface AppContextType {
  savingTips: SavingTip[];
  implementTip: (tipId: string) => void;
  getImplementedCount: () => number;
  getImplementedSavings: () => number;
  getTotalPotentialSavings: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savingTips, setSavingTips] = useState<SavingTip[]>(initialSavingTips);

  const implementTip = (tipId: string) => {
    setSavingTips(prevTips =>
      prevTips.map(tip =>
        tip.id === tipId ? { ...tip, implemented: true } : tip
      )
    );
  };

  const getImplementedCount = () => {
    return savingTips.filter(tip => tip.implemented).length;
  };
  
  const getImplementedSavings = () => {
      return savingTips.reduce((total, tip) => {
          return tip.implemented ? total + tip.potentialSaving : total;
      }, 0);
  };
  
  const getTotalPotentialSavings = () => {
      return initialSavingTips.reduce((total, tip) => total + tip.potentialSaving, 0);
  };

  return (
    <AppContext.Provider value={{ savingTips, implementTip, getImplementedCount, getImplementedSavings, getTotalPotentialSavings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
