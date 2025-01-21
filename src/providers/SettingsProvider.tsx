import { createContext, useContext, useState, useEffect, FC, PropsWithChildren, Dispatch, SetStateAction } from 'react';

const SETTINGS_KEY = import.meta.env.VITE_STORAGE_KEY + '-settings';

interface SettingsContextProps {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

const defaultSettings: Settings = {
  zipDownload: true,
  quality: -1,
  theme: 'system',
  maxFileSize: -1
};

const SettingsContext = createContext<SettingsContextProps | null>(null);

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return { ...defaultSettings, ...(settings ? JSON.parse(settings) : null) };
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
