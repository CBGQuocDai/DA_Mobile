import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { resolveApiBaseUrl } from './apiUrl.config';

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
