import {Suspense} from 'react';
import {
  flattenConnection,
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useSession,
  CacheNone,
} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.server';
import { GiftCardCalculator } from '../components/GiftCard/GiftCardCalculator.client';
import { GET_ALL_GIFT_CARDS_WITH_VARIANTS, GET_ZIPCODES_QUERY } from '../helpers/queries';
import { PRODUCT_CARD_FRAGMENT } from '../lib/fragments';

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

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  let customer = null;

  if (customerAccessToken) {
    const {data:customerData} = useShopQuery({
      query: CUSTOMER_QUERY,
      variables: {
        customerAccessToken,
        language: languageCode,
        country: countryCode,
      },
      cache: CacheNone(),
    });
  
    customer = customerData.customer;
  }
  

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
          email={customer === null ? null : customer.email}
        />
      </Suspense>
    </Layout>
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
            subtotalPrice{
              amount
            }
            totalShippingPrice{
              amount
            }
            totalTax{
              amount
            }
            totalPrice{
              amount
            }
            shippingAddress{   
                address1
                address2
                city
                zip
                province
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
                    price{
                      amount
                    }
                  }
                  title
                  currentQuantity
                  originalTotalPrice{
                    amount
                  }
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