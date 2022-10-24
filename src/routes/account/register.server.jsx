import {Suspense} from 'react';
import {CacheNone, Seo, gql} from '@shopify/hydrogen';

import {AccountCreateForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';
import {getApiErrorMessage} from '~/lib/utils';

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

export async function api(request, {queryShop}) {
  // return new Response(request.text(), {status: 200});
  // const jsonBody = await request.json();

  let jsonBody = await request.text();

  return new Response(jsonBody, {status: 200});
  // let redirect = false;

  // // try: logging in using JSON notation; catch: if the request is form-data
  // try {
  //   console.log("Attempting login using JSON...");
  //   jsonBody = JSON.parse(jsonBody);
  // } catch (e) {
  //   console.log("received form-data.  Converting...");
  //   let strArr = jsonBody;
  //   strArr = strArr.split("&customer%5Bpassword%5D=");
  //   if (strArr === null) 
  //     return new Response(`Invalid input request`);

  //   let strEmail = strArr[0];
  //   let strPass = strArr[1];

  //   strEmail = strEmail.split("&customer%5Bemail%5D=")[1];
  //   strEmail = decodeURIComponent(strEmail);

  //   strPass = strPass.split("&recaptcha-v3")[0];
  //   strPass = decodeURIComponent(strPass);

  //   jsonBody = {
  //       email: strEmail,
  //       password: strPass
  //   }

  //   redirect = true;
  // }

  // if (!jsonBody.email || !jsonBody.password) {
  //   return new Response(
  //     JSON.stringify({error: 'Email and password are required'}),
  //     {status: 400},
  //   );
  // }

  // const {data, errors} = await queryShop({
  //   query: CUSTOMER_CREATE_MUTATION,
  //   variables: {
  //     input: {
  //       email: jsonBody.email,
  //       password: jsonBody.password,
  //       firstName: jsonBody.firstName,
  //       lastName: jsonBody.lastName,
  //     },
  //   },
  //   // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
  //   cache: CacheNone(),
  // });

  // const errorMessage = getApiErrorMessage('customerCreate', data, errors);

  // if (
  //   !errorMessage &&
  //   data &&
  //   data.customerCreate &&
  //   data.customerCreate.customer &&
  //   data.customerCreate.customer.id
  // ) {
  //   return new Response(null, {
  //     status: 200,
  //   });
  // } else {
  //   return new Response(
  //     JSON.stringify({
  //       error: errorMessage ?? 'Unknown error',
  //     }),
  //     {status: 401},
  //   );
  // }
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
