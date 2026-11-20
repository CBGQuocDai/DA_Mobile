interface ApiUrlOptions {
  configuredUrl?: string;
  developmentHost?: string | null;
  platform: string;
}

export function resolveApiBaseUrl({ configuredUrl, developmentHost, platform }: ApiUrlOptions) {
  if (configuredUrl?.trim()) return configuredUrl.trim().replace(/\/+$/, '');

  const fallbackHost = platform === 'android' ? '10.0.2.2' : 'localhost';
  // Expo Go's Metro host is the development computer, not the phone's localhost.
  const hostname = developmentHost ? new URL(`http://${developmentHost}`).hostname : fallbackHost;
  const host = platform === 'android' && ['localhost', '127.0.0.1'].includes(hostname) ? fallbackHost : hostname;
  return `http://${host}:8080/api`;
}
