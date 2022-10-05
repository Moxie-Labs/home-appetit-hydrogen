import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    storeDomain: import.meta.env.VITE_STORE_DOMAIN,
    storefrontToken: import.meta.env.VITE_STORE_TOKEN,
    storefrontApiVersion: '2022-10',
  },
});
