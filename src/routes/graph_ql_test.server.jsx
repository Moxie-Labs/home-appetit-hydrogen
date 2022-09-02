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

// import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
// import {getHeroPlaceholder} from '~/lib/placeholders';
// import {FeaturedCollections, Hero} from '~/components';
// import {Layout, ProductSwimlane} from '~/components/index.server';

export default function GraphQLTest() {
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
  const {
    data: {
      collections: {edges: collections},
    },
  } = useShopQuery({
    query: TEST_CONTENT_QUERY,
    cache: CacheLong(),
    preload: true,
  });

    const collectionList = collections.map((collection, i) => {
        console.log(`collection ${collection.node.handle}`, collection.node)
        return <li key={i}>{collection.node.handle}</li>
    })

  return (
    <>
      <h1>Loaded!</h1>
      {collectionList}
    </>
  );
}

/**
 * The homepage content query includes a request for custom metafields inside the alias
 * `heroBanners`. The template loads placeholder content if these metafields don't
 * exist. Define the following five custom metafields on your Shopify store to override placeholders:
 * - hero.title             Single line text
 * - hero.byline            Single line text
 * - hero.cta               Single line text
 * - hero.spread            File
 * - hero.spread_seconary   File
 *
 * @see https://help.shopify.com/manual/metafields/metafield-definitions/creating-custom-metafield-definitions
 * @see https://github.com/Shopify/hydrogen/discussions/1790
 */

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

const HOMEPAGE_SEO_QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
