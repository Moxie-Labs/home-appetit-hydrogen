import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_CATEGORIES_QUERY, GET_ZIPCODES_QUERY } from '../../helpers/queries';

export default function Order() {
    const {
        data: collectionData,
      } = useShopQuery({
        query: GET_CATEGORIES_QUERY,
        cache: CacheLong(),
        preload: true,
      });

      const {
        data: zipcodeData,
      } = useShopQuery({
        query: GET_ZIPCODES_QUERY,
        cache: CacheLong(),
        preload: true,
      });

      const { inrangeZipcodes } = zipcodeData.page;
      const validZipcodes = JSON.parse(inrangeZipcodes.value)
      let zipcodeArr = [];
      validZipcodes.forEach(validCode => {
        zipcodeArr.push(validCode.zip_code);
      });

    return (
        <>
        <Suspense>
            <Layout>
                <OrderSection
                    collectionData={collectionData}
                    zipcodeData={null}
                    zipcodeArr={zipcodeArr}
                />
            </Layout>
        </Suspense>
        </>
    );
}