import {Suspense} from 'react';
import {
  flattenConnection,
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery
} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.server';
import { GiftCardCalculator } from '../components/GiftCard/GiftCardCalculator.client';
import { GET_ALL_GIFT_CARDS_WITH_VARIANTS, GET_ZIPCODES_QUERY } from '../helpers/queries';

export default function GiftCards() {
  const {
    data: giftCardData,
  } = useShopQuery({
    query: GET_ALL_GIFT_CARDS_WITH_VARIANTS,
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

  const giftCards = flattenConnection(giftCardData.collection.products)

  return (
    <Layout>
      <Suspense>
        <GiftCardCalculator 
          giftCards={giftCards}
          zipcodeArr={zipcodeArr}
        />
      </Suspense>
    </Layout>
  );
}