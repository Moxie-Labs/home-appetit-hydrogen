import {Suspense, useCallback, useState} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery
} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.client';
import { OrderSection } from '../components/OrderSection.client';

export default function Order() {
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
                />
            </Layout>
        </Suspense>
        </>
    );
}

 /* GraphQL Values */
 const GET_CATEGORIES_QUERY = gql`
 {
     collections(first: 7) {
         edges {
             node {
                 id
                 title
                 handle
                 products(first: 20) {
                     edges {
                         node {
                             id
                             title
                             description
                             # handle
                             tags
                             images(first: 1) {
                                 edges {
                                     node {
                                         # id
                                         altText
                                         # width
                                         # height
                                         src
                                     }
                                 }
                             }
                             priceRange {
                                 minVariantPrice {
                                     amount
                                 }
                                 maxVariantPrice {
                                     amount
                                 }
                             }
                             # options(first: 100) {
                             #     id
                             #     name
                             #     values
                             # }
                         }
                     }
                 }
             }
         }
     }
 }
`;

const TEST_CONTENT_QUERY = gql`
  {
        collections(first: 7) {
            edges {
                node {
                    id
                    title
                    handle
                    products(first: 20) {
                        edges {
                            node {
                                id
                                title
                                description
                                # handle
                                tags
                                images(first: 1) {
                                    edges {
                                        node {
                                            # id
                                            altText
                                            # width
                                            # height
                                            src
                                        }
                                    }
                                }
                                priceRange {
                                    minVariantPrice {
                                        amount
                                    }
                                    maxVariantPrice {
                                        amount
                                    }
                                }
                                # options(first: 100) {
                                #     id
                                #     name
                                #     values
                                # }
                            }
                        }
                    }
                }
            }
        }
    }
`;