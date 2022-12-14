import {Suspense} from 'react';
import {useShopQuery, CacheLong, CacheNone, Seo, gql, HydrogenRequest} from '@shopify/hydrogen';

import {AccountLoginForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';
import { GET_ORDER_WINDOW_DAYS_QUERY } from '../../helpers/queries';
import { logToConsole } from '../../helpers/logger';
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

  let jsonBody = await request.text();
  let redirect = false;
  let strPath = "/";

  // try: logging in using JSON notation; catch: if the request is form-data
  try {
    logToConsole("Attempting login using JSON...");
    jsonBody = JSON.parse(jsonBody);
  } catch (e) {
    logToConsole("received form-data.  Converting...");
    let strArr = jsonBody;

    if (strArr.includes("pathname=")) {
      strArr = strArr.split("&pathname=");
      strPath = strArr[1];
      strArr = strArr[0];
      strPath = strPath.split("&recaptcha")[0];
      strPath = decodeURIComponent(strPath);
    }



    strArr = strArr.split("&customer%5Bpassword%5D=");
    if (strArr === null) 
      return new Response(`Invalid input request`);

    let strEmail = strArr[0];
    let strPass = strArr[1];

    strEmail = strEmail.split("&customer%5Bemail%5D=")[1];
    strEmail = decodeURIComponent(strEmail);

    strPass = strPass.split("&recaptcha-v3")[0];
    if (strPass.includes("&opt-in"))
      strPass = strPass.split("&opt-in")[0];
    strPass = decodeURIComponent(strPass);

    jsonBody = {
        email: strEmail,
        password: strPass
    }

    redirect = true;
  }

  if (!jsonBody.email || !jsonBody.password) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400},
    );
  }

  const { data: windowData } = await queryShop({
    query: GET_ORDER_WINDOW_DAYS_QUERY,
    cache: CacheNone()  
  });

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

    let redirectDest = `https://${import.meta.env.VITE_STORE_DOMAIN}${strPath}`;
    if (strPath.includes('referrals'))
      redirectDest = `${import.meta.env.VITE_ORDERING_SITE}/account#referrals`;

    const today = new Date();
    if (redirect) {
     
      // find latest active menu and associated window
      windowData.collections.edges.map(edge => {
        if (redirectDest !== '/order') {
          const menu = edge.node;
          const startDate = new Date(menu.orderWindowOpen?.value);
          const endDate = new Date(menu.orderWindowClosed?.value);
  
          if (startDate === null || endDate === null) ;
          else if (today > endDate) ;
          else if (today <= endDate && today >= startDate)
            redirectDest = '/order';
        }
      });

      const response = new Response(null, {
        status: 301,
        headers: {
          Location: redirectDest
        },
      });

      response.headers.append("Access-Control-Allow-Origin", "*");
      return response;
    }
      
    else {
      const response = new Response(null, {
        status: 200,
      });

      response.headers.append("Access-Control-Allow-Origin", "*");
      return response;
    }
    
  } else {
    return new Response(
      JSON.stringify({
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
      }),
      {status: 401},
    );
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
