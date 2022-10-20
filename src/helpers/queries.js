import {
    gql
  } from '@shopify/hydrogen';

export const GET_CATEGORIES_QUERY = gql`
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

export const GET_LATEST_MENU_QUERY = gql`
{
    collection(handle: "menu_07-18-2022") {
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