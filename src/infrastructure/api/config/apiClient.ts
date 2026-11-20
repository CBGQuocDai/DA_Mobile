import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { resolveApiBaseUrl } from './apiUrl.config';

interface AuthSessionAccess {
  getAccessToken(): string | null;
  expireSession(token: string): void;
}
let authSession: AuthSessionAccess | null = null;
export const connectAuthSession = (session: AuthSessionAccess) => { authSession = session; };

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl({
    configuredUrl: process.env.EXPO_PUBLIC_API_URL,
    developmentHost: Platform.OS === 'web' && typeof window !== 'undefined'
      ? window.location.host
      : Constants.expoConfig?.hostUri,
    platform: Platform.OS,
  }),
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (config.url === '/customer/login' || config.url === '/customer/register') {
    config.headers.delete('Authorization');
  } else {
    const token = authSession?.getAccessToken();
    if (token && !config.headers.has('Authorization')) config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use((response) => response, (error) => {
  const token = authSession?.getAccessToken();
  if (error.response?.status === 401 && token && error.config?.headers?.get('Authorization') === `Bearer ${token}`) {
    authSession?.expireSession(token);
  }
  return Promise.reject(error);
});
