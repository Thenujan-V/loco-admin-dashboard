import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export interface SettingsContextType {
  themeMode: string;
  themeDirection: string;
  themeContrast: string;
  themeLayout: string;
  themeColorPresets: string;
  themeStretch: boolean;
  onUpdate: (name: string, value: any) => void;
  onChangeDirectionByLang: (lang: string) => void;
  canReset: boolean;
  onReset: () => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  [key: string]: any;
}

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};
