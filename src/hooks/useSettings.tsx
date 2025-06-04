import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingsService';

export interface Settings {
  username: string;
  password: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  tileServerUrl: string;
  defaultZoom: number;
  defaultCenter: [number, number];
  mbtilePath: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    setLoading(true);
    setError(null);
    try {
      await updateSettings(newSettings);
      setSettings(newSettings);
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings,
  };
};