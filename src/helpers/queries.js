import {
    gql
  } from '@shopify/hydrogen';

export const GET_BASE_COLLECTIONS_QUERY = gql`
    {
        collections(first:10, reverse:true, query:"*green OR *entrees OR *add-on") {
            edges {
                node {
                    id
                    handle
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

export const GET_MENUS_QUERY = gql`
    {
        collections(first:4, reverse:true, query:"*menu") {
            edges {
            node {
                id
                handle
                endDate: metafield(namespace: "custom", key: "end_date") {
                    value
                    }
                    startDate: metafield(namespace: "custom", key: "start_date") {
                    value
                    }
                    products(first: 50) {
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
                        menuCategories: metafield(
                            namespace: "custom"
                            key: "menu_categories"
                        ) {
                            value
                        }
                        modifications: metafield(namespace: "custom", key: "modification") {
                            value
                        }
                        substitutions: metafield(namespace: "custom", key: "substitutions") {
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

export const GET_MOD_COLLECTIONS_QUERY = gql`
     {
        collections(first: 20, reverse: true, query: "*sub OR *mod OR *custom") {
            edges {
            node {
                id
                handle
                products(first: 50) {
                edges {
                    node {
                    id
                    title
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