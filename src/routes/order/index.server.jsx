import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useSession
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_CATEGORIES_QUERY } from '../../helpers/queries';

export default function Order() {

    const { customerAccessToken } = useSession();

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
                    isGuest={customerAccessToken === null}
                />
            </Layout>
        </Suspense>
        </>
    );
}