const isProd = import.meta.env.MODE === 'production';
const baseURL = isProd ? '/api' : 'http://localhost:3000';
const imageBaseURL = isProd ? '' : 'http://localhost:3000';

interface AppConfigType {
  baseURL: string;
  mode: string;
  toApiUrl: (url?: string) => string;
  toServerImage: (src?: string) => string;
}

export const AppConfig: AppConfigType = {
  baseURL,
  mode: import.meta.env.MODE,
  toApiUrl: (url?: string) => {
    return `${baseURL}${url && typeof url === 'string' && url.startsWith('/') ? url : `/${url || ''}`}`;
  },
  toServerImage: (src?: string) =>
    `${imageBaseURL}${src && typeof src === 'string' && src.startsWith('/') ? src : `/${src || ''}`}`,
};
