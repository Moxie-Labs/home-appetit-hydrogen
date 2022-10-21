import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  CacheNone,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useSession,
  gql
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_CATEGORIES_QUERY } from '../../helpers/queries';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export default function Order() {

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

    const { customerAccessToken } = useSession();
    let customerData = null;

    if (customerAccessToken != null && customerAccessToken != '') {
      const {data} = useShopQuery({
        query: CUSTOMER_QUERY,
        variables: {
          customerAccessToken,
          language: languageCode,
          country: countryCode,
        },
        cache: CacheNone(),
      });
      customerData = data;
    }

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
                    customerData={customerData}
                    isGuest={customerData == null}
                />
            </Layout>
        </Suspense>
        </>
    );
}

const CUSTOMER_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      acceptsMarketing
      defaultAddress {
        id
        formatted
      }
      addresses(first: 10) {
        edges {
          node {
            id
            name
            firstName
            lastName
            company
            address1
            address2
            country
            province
            provinceCode
            city
            zip
            phone
          }
        }
      }
      orders(first: 100, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;