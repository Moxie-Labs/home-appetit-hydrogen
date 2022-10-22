import {
    gql
  } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '../lib/fragments';

export const GET_CATEGORIES_QUERY = gql`
 {
     collections(first: 20) {
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
                             tags
                             images(first: 1) {
                                 edges {
                                     node {
                                         altText
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
                            variants(first: 2) {
                                edges {
                                    node {
                                        id
                                        title
                                        priceV2 {
                                            amount
                                        } 
                                    }
                                }
                            }
                            modifications:metafield(namespace:"custom", key:"modification") {
                                value
                            }
                            substitutions:metafield(namespace:"custom", key:"substitutions") {
                                value
                            }
                         }
                     }
                 }
             }
         }
     }
 }
`;

export function GET_CHECKOUT_MUTATION(lineItemsInput) {
    return gql`
        mutation {
            checkoutCreate(
                input: {
                    lineItems: ${lineItemsInput}
                }
            ) {
                checkout {
                    id
                    webUrl
                }
            }
            }
    `;
}

export const GET_ZIPCODES_QUERY = gql`
   {
    page(handle:"order-now") {
        handle
        inrangeZipcodes:metafield(namespace:"custom", key:"in_range_zipcodes") {
        value
        }
    }
}
`;
export const CUSTOMER_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CustomerDetails(
    $customerAccessToken: String!
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

export const GET_ORDER_WINDOW_DAYS_QUERY = gql`
{
	collections(first:5, reverse: true) {
        edges {
            node {
                title
                orderWindowOpen:metafield(namespace:"custom", key:"start_date") {
                    value
                }
                orderWindowClosed:metafield(namespace:"custom", key:"end_date") {
                    value
                }
            }
        }
  }
}`;
export const GET_LATEST_MENU_QUERY = gql`
{
    collection(handle: "menu_10-17-2022") {
        products(first: 50) {
            edges {
                node {
                    id
                }
            }
        }
    }
}
`;
