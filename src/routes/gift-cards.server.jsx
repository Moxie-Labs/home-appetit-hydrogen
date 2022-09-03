import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery
} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.server';
import { GiftCardCalculator } from '../components/GiftCardCalculator.client';

export default function GiftCards() {

  return (
    <Layout>
      <Suspense>
        <GiftCardCalculator />
      </Suspense>
    </Layout>
  );
}