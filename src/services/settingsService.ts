import axios from 'axios';
import { Settings } from '../hooks/useSettings';

// API URL
const API_URL = '/api';

// Mock settings data for development
const MOCK_SETTINGS: Settings = {
  username: 'admin',
  password: 'admin',
  database: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'gis'
  },
  tileServerUrl: 'http://localhost:8080',
  defaultZoom: 10,
  defaultCenter: [51.5, 35.7], // Center of Iran
  mbtilePath: '/data/mbtiles'
};

export const getSettings = async (): Promise<Settings> => {
  // In a real app, this would be an API call
  // For demonstration, we'll return mock data
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if we have settings in localStorage
      const storedSettings = localStorage.getItem('osmManagerSettings');
      if (storedSettings) {
        resolve(JSON.parse(storedSettings));
      } else {
        // Use default mock settings
        resolve(MOCK_SETTINGS);
      }
    }, 300);
  });
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
  // In a real app, this would be an API call
  // For demonstration, we'll store in localStorage
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('osmManagerSettings', JSON.stringify(settings));
      resolve(settings);
    }, 500);
  });
};