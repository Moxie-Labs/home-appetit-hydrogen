import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useRouteParams
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

      const { zipcode: userZipcode } = useRouteParams();
      const { inrangeZipcodes } = zipcodeData.page;
      const validZipcodes = JSON.parse(inrangeZipcodes.value)

      const getZipcodeType = () => {
        let retval = null;

        validZipcodes.forEach(validCode => {
          if (retval === null) {
            if (validCode.zip_code === userZipcode) {
              if (validCode.area === "1") {
                retval = "normal";
              }
              else if (validCode.area === "2") {
                retval = "extended";
              }
            }
          }
        });
        return (retval === null ? "invalid" : retval);
      }

    return (
        <>
        <Suspense>
            <Layout>
                <OrderSection
                    collectionData={collectionData}
                    zipcodeType={getZipcodeType()}
                    userZipcode={userZipcode}
                />
            </Layout>
        </Suspense>
        </>
    );
}