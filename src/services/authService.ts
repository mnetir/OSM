import axios from 'axios';

// API URL
const API_URL = '/api';

export interface AuthResponse {
  token: string;
  user: {
    username: string;
  };
}

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  // In a real app, this would be an API call
  // For demonstration, we'll simulate a successful login
  
  // Mock authentication (in a real app, this would be an API request)
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if credentials match stored settings
      // In a real app, this would be a server-side validation
      if (username === 'admin' && password === 'admin') {
        resolve({
          token: 'mock-jwt-token',
          user: { username }
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const validateToken = async (token: string): Promise<boolean> => {
  // In a real app, this would validate the token with the server
  // For demonstration, we'll always return true for the mock token
  return token === 'mock-jwt-token';
};