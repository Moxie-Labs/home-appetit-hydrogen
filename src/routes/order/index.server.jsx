import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  CacheNone,
  flattenConnection,
  useSession,
  gql
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_BASE_COLLECTIONS_QUERY, GET_MENUS_QUERY, GET_MOD_COLLECTIONS_QUERY, GET_ZIPCODES_QUERY, GET_CATEGORIES_QUERY } from '../../helpers/queries';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export default function Order({response}) {

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
        query: GET_BASE_COLLECTIONS_QUERY,
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

      const {
        data: menuData
      } = useShopQuery({
        query: GET_MENUS_QUERY,
        cache: CacheLong(),
        preload: true
      });

      const {
        data: modData
      } = useShopQuery({
        query: GET_MOD_COLLECTIONS_QUERY,
        cache: CacheLong(),
        preload: true
      })

      // get latest Menu
      let latestMenu = null;
      const today = new Date();
      const recentMenus = flattenConnection(menuData.collections) || [];
      recentMenus.map(menu => {
        if (latestMenu === null) {
          if (menu.startDate != null && menu.endDate != null) {
            const startDate = new Date(menu.startDate?.value);
            let endDate = new Date(menu.endDate?.value);
            endDate.setDate(endDate.getDate() + 1);
            if (today <= endDate && today >= startDate)
              latestMenu = menu;
          }
        }
      });

      if (latestMenu === null)
        return response.redirect(`https://${import.meta.env.VITE_STORE_DOMAIN}/pages/order-now`);

      let collectionsById = [];
      let collectionIdByHandle = [];
      collectionData.collections.edges.forEach(collection => {
        collectionIdByHandle[collection.node.handle] = collection.node.id;
        collectionsById.push(collection.node);
      });

      modData.collections.edges.forEach(collection => {
        collectionsById.push(collection.node);
      });

      let entreeProducts = [];
      let greensProducts = [];
      let addonProducts = [];

      latestMenu.products.edges.map(item => {
        const menuItem = item.node;
        if (menuItem.menuCategories !== null) {
          const menuCategories = JSON.parse(menuItem.menuCategories?.value);
          menuCategories.map(catId => {
            if (catId === collectionIdByHandle['entrees'])
              entreeProducts.push(item);
            if (catId === collectionIdByHandle['greens-grains-small-plates'])
              greensProducts.push(item);
            if (catId === collectionIdByHandle['add-ons'])
              addonProducts.push(item);
          });
        } 
      });
      
    return (
        <>
        <Suspense>
            <Layout>
                <OrderSection
                  collectionData={collectionData}
                  zipcodeData={null}
                  zipcodeArr={zipcodeArr}
                  collectionsById={collectionsById}
                  entreeProducts={entreeProducts}
                  greensProducts={greensProducts}
                  addonProducts={addonProducts}
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