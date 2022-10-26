import Homepage from "../components/Homepage.client";
import { useSession, useShopQuery, useLocalization, CacheNone, gql } from "@shopify/hydrogen";
import { PRODUCT_CARD_FRAGMENT } from "../lib/fragments";

export default function Index() {
  const { customerAccessToken } = useSession();
  let customerData = null;

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  if (customerAccessToken != null) {
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
    

  return (
    <div>
      <Homepage
        customerAccessToken={customerAccessToken? customerAccessToken : null}
        customerData={customerData? customerData : null}
      />
    </div>
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