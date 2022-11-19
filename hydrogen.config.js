import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    defaultCountryCode: 'US',
    defaultLanguageCode: 'EN',
    storeDomain: import.meta.env.VITE_STORE_DOMAIN,
    storefrontToken: import.meta.env.VITE_STORE_TOKEN,
    storefrontApiVersion: '2022-10',
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'Lax',
    domain: '.homeappetitphilly.com',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
