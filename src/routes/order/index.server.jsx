import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  CacheNone,
  flattenConnection
} from '@shopify/hydrogen';
import { Layout } from '../../components/Layout.client';
import { OrderSection } from '../../components/OrderSection.client';
import { GET_BASE_COLLECTIONS_QUERY, GET_MENUS_QUERY, GET_MOD_COLLECTIONS_QUERY } from '../../helpers/queries';

export default function Order({response}) {
    const {
        data: collectionData,
      } = useShopQuery({
        query: GET_BASE_COLLECTIONS_QUERY,
        cache: CacheLong(),
        preload: true,
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