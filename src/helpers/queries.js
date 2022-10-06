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

export const GET_ALL_GIFT_CARDS_QUERY = gql`
    {
        collection(handle: "gift-cards") {
            products(first: 5) {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
        }
    }
`;

export function GET_GIFT_CARD_QUERY(cardProductId) {

    return gql`
       {
            product(id:cardProductId) {
                variants(first:100) {
                    edges {
                        node {
                            id
                            price {
                                amount
                            }
                        }
                    }
                }
            }
        }
    `;
}

export const GET_ALL_GIFT_CARDS_WITH_VARIANTS = gql`
    {
        collection(handle: "gift-cards") {
            products(first: 5) {
                edges {
                    node {
                        id
                        title
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    price {
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

`;