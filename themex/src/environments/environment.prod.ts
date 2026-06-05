const isBrowser = typeof window !== 'undefined';
let apiBase = 'https://api.azonno.com';

if (isBrowser) {
  if ((window as any).__env?.apiBaseLink) {
    apiBase = (window as any).__env.apiBaseLink;
  } else {
    let hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (hostname.startsWith('www.')) {
        hostname = hostname.replace('www.', '');
      }
      apiBase = `${window.location.protocol}//api.${hostname}`;
    }
  }
} else {
  apiBase = process.env['API_BASE_LINK'] || 'https://api.azonno.com';
}

export const environment = {
  production: true,
  apiBaseLink: apiBase,
  ftpBaseLink: apiBase,
  ftpPrefixPath: `${apiBase}/api/upload/images`,
  ftpPrefix: '',
  userBaseUrl: '/my-account',
  userLoginUrl: 'login',
  storageSecret: 'SOFT_ECOM_2021_IT_1998',
  VERSION: 1,
};
