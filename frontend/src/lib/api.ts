// Web için localhost, mobil için 10.181.165.38
import { Capacitor } from '@capacitor/core';

const isCapacitor = Capacitor.isNativePlatform();
export const API_BASE_URL = isCapacitor 
  ? 'http://10.181.165.38:5000' 
  : 'http://localhost:5000';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(API_BASE_URL + endpoint);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  put: async (endpoint: string, data: any) => {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  delete: async (endpoint: string) => {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};
