import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery
} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.client';
import { OrderSection } from '../components/OrderSection.client';
import MyAccount from '../components/MyAccount.client';

export default function Order() {
    return (
        <>
        <Suspense>
            <Layout>
                <MyAccount/>
            </Layout>
        </Suspense>
        </>
    );
}