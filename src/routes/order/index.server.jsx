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
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_CATEGORIES_QUERY } from '../../helpers/queries';

export default function Order() {
    const {
        data: collectionData,
      } = useShopQuery({
        query: GET_CATEGORIES_QUERY,
        cache: CacheLong(),
        preload: true,
      });

    return (
        <>
        <Suspense>
            <Layout>
                <OrderSection
                    collectionData={collectionData}
                />
            </Layout>
        </Suspense>
        </>
    );
}