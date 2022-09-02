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

export default function ModalTest() {
    useServerAnalytics({
      shopify: {
        pageType: ShopifyAnalyticsConstants.pageType.home,
      },
    });
  
    return (
      <Layout>
        <Suspense>
          <TestContent />
        </Suspense>
      </Layout>
    );
  }

function TestContent() {
  
    return (
      <>
        <h1>Loaded!</h1>
        {collectionList}
      </>
    );
  }