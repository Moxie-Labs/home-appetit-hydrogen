import {Suspense} from 'react';
import {CacheNone, Seo, gql} from '@shopify/hydrogen';

import {AccountCreateForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';
import {getApiErrorMessage} from '~/lib/utils';
import { callLoginApi } from '../../components/Account/AccountLoginForm.client';
import { LOGIN_MUTATION } from './login.server';

export default function Register({response}) {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Register'}} />
      </Suspense>
      <AccountCreateForm />
    </Layout>
  );
}

export async function api(request, {session, queryShop}) {

  if (!session) {
    return new Response('Session storage not available.', {status: 400});
  }

  let jsonBody = await request.text();

  let redirect = false;

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

    let strEmailAndNames = strArr[0];
    let strPass = strArr[1];

    strEmailAndNames = strEmailAndNames.split("&customer%5Bemail%5D=");
    let strNames = strEmailAndNames[0];
    let strEmail = strEmailAndNames[1];
    strEmail = decodeURIComponent(strEmail);

    strPass = strPass.split("&recaptcha-v3")[0];
    strPass = decodeURIComponent(strPass);

    strNames = strNames.split("&customer%5Blast_name%5D=");
    let strFirst = strNames[0];
    let strLast = strNames[1];

    strFirst = strFirst.split("&customer%5Bfirst_name%5D=")[1];

    jsonBody = {
        email: strEmail,
        password: strPass,
        firstName: strFirst,
        lastName: strLast
    }

    return new Response(JSON.stringify(jsonBody), {status: 200});

    redirect = true;
  }

  if (!jsonBody.email || !jsonBody.password) {
    return new Response(
      JSON.stringify({error: 'Email and password are required'}),
      {status: 400},
    );
  }

  const {data, errors} = await queryShop({
    query: CUSTOMER_CREATE_MUTATION,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
        firstName: jsonBody.firstName,
        lastName: jsonBody.lastName,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const errorMessage = getApiErrorMessage('customerCreate', data, errors);

  if (
    !errorMessage &&
    data &&
    data.customerCreate &&
    data.customerCreate.customer &&
    data.customerCreate.customer.id
  ) {

    if (redirect) {
      let redirectDest = '/account';

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
            status: 301,
            headers: {Location: redirectDest},
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
    else {
      return new Response(null, {
        status: 200,
      });
    }
    
  } else {
    return new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      {status: 401},
    );
  }

}

const CUSTOMER_CREATE_MUTATION = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;