import {Suspense} from 'react';
import {
  CacheNone,
  CacheLong,
  flattenConnection,
  gql,
  Seo,
  useSession,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '../../lib/fragments';
import {getApiErrorMessage} from '../../lib/utils';
import { Layout } from '../../components/Layout.client';
import MyAccount from '../../components/MyAccount.client';
import { Page } from "../../components/Page.client";
import {Header} from '../../components/Header.client';
import {Footer} from '../../components/Footer.client';
import { GET_ZIPCODES_QUERY } from '../../helpers/queries';

export default function Account({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

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

  return (
    <Layout>
      <AuthenticatedAccount
        customer={customer}
        zipcodeArr={zipcodeArr}
        customerAccessToken={customerAccessToken}
      />
    </Layout>
  );
}

function AuthenticatedAccount({
  customer, zipcodeArr, customerAccessToken
}) {
  const orders = flattenConnection(customer?.orders) || [];

  return (
    <>
    <Layout>
      <Suspense>
        <Seo type="noindex" />
      </Suspense>

      <MyAccount 
        customer={customer}
        orders={orders}
        zipcodeArr={zipcodeArr}
        customerAccessToken={customerAccessToken}
      />

    </Layout>
    </>
  );
}

export async function api(request, {session, queryShop}) {
  if (request.method !== 'PATCH' && request.method !== 'DELETE') {
    const response = new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH,DELETE',
      },
    });
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response;
  }

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {email, phone, firstName, lastName, newPassword, acceptsMarketing} = await request.json();

  const customer = {};

  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (firstName) customer.firstName = firstName;
  if (lastName) customer.lastName = lastName;
  if (newPassword) customer.password = newPassword;
  if (acceptsMarketing !== undefined) customer.acceptsMarketing = acceptsMarketing;

  const {data, errors} = await queryShop({
    query: CUSTOMER_UPDATE_MUTATION,
    variables: {
      customer,
      customerAccessToken,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const error = getApiErrorMessage('customerUpdate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  return new Response(null);
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
            subtotalPrice{
              amount
            }
            totalShippingPrice{
              amount
            }
            totalTax{
              amount
            }
            totalPrice{
              amount
            }
            shippingAddress{   
                address1
                address2
                city
                zip
                province
            }
            lineItems(first: 15) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                    price{
                      amount
                    }
                  }
                  title
                  currentQuantity
                  originalTotalPrice{
                    amount
                  }
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

const CUSTOMER_UPDATE_MUTATION = gql`
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $customerAccessToken: String!
  ) {
    customerUpdate(
      customer: $customer
      customerAccessToken: $customerAccessToken
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;