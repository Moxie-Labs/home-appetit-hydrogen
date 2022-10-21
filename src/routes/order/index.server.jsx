import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  CacheNone
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_CATEGORIES_QUERY, GET_LATEST_MENU_QUERY } from '../../helpers/queries';

export default function Order() {
    const {
        data: collectionData,
      } = useShopQuery({
        query: GET_CATEGORIES_QUERY,
        cache: CacheNone(),
        preload: true,
      });

      const {
        data: menuData
      } = useShopQuery({
        query: GET_LATEST_MENU_QUERY,
        cache: CacheLong(),
        preload: true
      });

      let collectionsById = [];
      let collectionsByHandle = [];
      collectionData.collections.edges.forEach(collection => {
        collectionsByHandle[collection.node.handle] = collection.node;
        collectionsById.push(collection.node);
      });
  
      const allEntreeProducts = collectionsByHandle['entrees'].products.edges;
      const allGreensProducts = collectionsByHandle["greens-grains-small-plates"].products.edges;
      const allAddonsProducts = collectionsByHandle['add-ons'].products.edges;

      let entreeProducts = [];
      let greensProducts = [];
      let addonProducts = [];

      menuData.collection.products.edges.map(menuItem => {
        allEntreeProducts.forEach(collItem => {
          if (collItem.node.id === menuItem.node.id)
            entreeProducts.push(collItem);
        });
        allGreensProducts.forEach(collItem => {
          if (collItem.node.id === menuItem.node.id)
            greensProducts.push(collItem);
        });
        allAddonsProducts.forEach(collItem => {
          if (collItem.node.id === menuItem.node.id)
            addonProducts.push(collItem);
        });
      });
      
    return (
        <>
        <Suspense>
            <Layout>
                <OrderSection
                  collectionData={collectionData}
                  collectionsById={collectionsById}
                  entreeProducts={entreeProducts}
                  greensProducts={greensProducts}
                  addonProducts={addonProducts}
                />
            </Layout>
        </Suspense>
        </>
    );
}