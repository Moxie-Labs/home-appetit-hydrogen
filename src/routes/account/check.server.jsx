import {Suspense} from 'react';
import {useShopQuery, CacheLong, CacheNone, Seo, gql} from '@shopify/hydrogen';

import {AccountLoginForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';

export default function Check({response}) {
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

  let jsonBody = await request.text();
  // try: logging in using JSON notation; catch: if the request is form-data
  try {
    console.log("Attempting login using JSON...");
    jsonBody = JSON.parse(jsonBody);
  } catch (e) {
    console.log("received form-data.  Converting...");
    let strArr = jsonBody;
    strArr = strArr.split("&customer%5Bpassword%5D=");
    if (strArr === null) 
      return new Response(`Invalid input request`);

    let strEmail = strArr[0];
    let strPass = strArr[1];

    strEmail = strEmail.split("&customer%5Bemail%5D=")[1];
    strEmail = decodeURIComponent(strEmail);

    strPass = strPass.split("&recaptcha-v3")[0];
    strPass = decodeURIComponent(strPass);

    jsonBody = {
        email: strEmail,
        password: strPass
    }
  }

  if (!jsonBody.email || !jsonBody.password) {
    const response = new Response(
        JSON.stringify({error: 'Incorrect email or password.'}),
        {status: 400},
    );
    response.headers.append("Access-Control-Allow-Origin", ".homeappetitphilly.com");
    return response; 
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

    const response = new Response(null, {
        status: 200,
    });
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response;
    
  } else {
    const response = new Response(
        JSON.stringify({
            error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
        }),
        {status: 401},
    );

    response.headers.append("Access-Control-Allow-Origin", ".homeappetitphilly.com");
    return response;
  }

  
}

export const LOGIN_MUTATION = gql`
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
