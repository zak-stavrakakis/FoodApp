const baseURL =
  import.meta.env.MODE !== 'production' ? 'http://localhost:3000' : '/api';

export const AppConfig = {
  baseURL,
  mode: import.meta.env.MODE,
  toApiUrl: (url) => {
    return `${baseURL}${url && typeof url === 'string' && url.startsWith('/') ? url : `/${url || ''}`}`;
  },
  toServerImage: (src) =>
    `${baseURL}${src && typeof src === 'string' && src.startsWith('/') ? src : `/${src || ''}`}`,
};
