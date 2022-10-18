import {Suspense} from 'react';
import {useShopQuery, CacheLong, CacheNone, Seo, gql, HydrogenRequest} from '@shopify/hydrogen';

import {AccountLoginForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';
// import {Layout} from '~/components/index.server';

export default function Login({response}) {
  response.cache(CacheNone());

  const {
    data: {
      shop: {name},
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Login'}} />
      </Suspense>
      <AccountLoginForm shopName={name} />
    </Layout>
  );
}

const SHOP_QUERY = gql`
  query shopInfo {
    shop {
      name
    }
  }
`;

export async function api(request, {session, queryShop}) {
  if (!session) {
    return new Response('Session storage not available.', {status: 400});
  }

  let jsonBody;

  return new Response(`request.body JSON: ${request.json()}, Text: ${request.text()}`);

  // try: logging in using JSON notation; catch: if the request is form-data
  try {
    console.log("Attempting login using JSON...");
    jsonBody = await request.json();
  } catch (e) {
    console.log("received form-data.  Converting...");
    let strArr = String(request.body).replace(/\s/g, "").split(";");
    if (strArr === null) 
      return new Response(`Invalid input request`);

    let strEmail = strArr[1];
    let strPass = strArr[2];

    strEmail = strEmail.split("name=\"customer[email]\"")[1];
    strEmail = strEmail.split("-")[0];

    strPass = strPass.split("name=\"customer[password]\"")[1];
    strPass = strPass.split("-")[0];

    jsonBody = {
        email: strEmail,
        password: strPass
    }
  }

  if (!jsonBody.email || !jsonBody.password) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400},
    );
  }

  const {data, errors} = await queryShop({
    query: LOGIN_MUTATION,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    await session.set(
      'customerAccessToken',
      data.customerAccessTokenCreate.customerAccessToken.accessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
      }),
      {status: 401},
    );
  }

  
}

const LOGIN_MUTATION = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;
