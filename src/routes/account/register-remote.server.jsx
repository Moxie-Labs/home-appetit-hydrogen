import {Suspense} from 'react';
import {CacheNone, Seo, gql} from '@shopify/hydrogen';

import {AccountCreateForm} from '../../components/Account';
import { Layout } from '../../components/Layout.client';
import {getApiErrorMessage} from '~/lib/utils';
import { callLoginApi } from '../../components/Account/AccountLoginForm.client';
import { LOGIN_MUTATION } from './login.server';
import { setDefaultAddress } from './address/[addressId].server';

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

  strFirst = decodeURIComponent(strFirst.split("customer%5Bfirst_name%5D=")[1]);
  let strCustomer = strLast.split("&customer");
  let strAddress = strLast[1];
  strLast = strCustomer[0];

  strFirst = strFirst.replace(/\+/g, ' ');

  let address = decodeURIComponent(strCustomer[1].split("address1%5D=")[1]);
  address = address.replace(/\+/g, ' ');
  let address2 = decodeURIComponent(strCustomer[2].split("address2%5D=")[1]);
  address2 = address2.replace(/\+/g, ' ');
  let city = decodeURIComponent(strCustomer[3].split("city%5D=")[1]);
  city = city.replace(/\+/g, ' ');
  let state = decodeURIComponent(strCustomer[4].split("state%5D=")[1]);
  state = state.replace(/\+/g, ' ');
  let zip = strCustomer[5].split("zip%5D=")[1];
  let phone = `+1${strCustomer[6].split("phone%5D=")[1]}`;

  jsonBody = {
    email: strEmail,
    password: strPass,
    firstName: strFirst,
    lastName: strLast,
    address1: address,
    address2: address2,
    city: city,
    state: state,
    country: "United States",
    zip: zip,
    phone: phone
  }

  return new Response(Object.values(jsonBody), {status: 200});

  redirect = true;

  if (!jsonBody.email || !jsonBody.password) {
    const response = new Response(
      JSON.stringify({error: 'Email and password are required'}),
      {status: 400},
    );
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response; 
  }

  const {data, errors} = await queryShop({
    query: CUSTOMER_CREATE_MUTATION,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
        firstName: jsonBody.firstName,
        lastName: jsonBody.lastName,
        phone: jsonBody.phone,
        acceptsMarketing: true
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

      const {data:loginData, errors} = await queryShop({
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


      if (loginData?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {

        await session.set(
          'customerAccessToken',
          loginData.customerAccessTokenCreate.customerAccessToken.accessToken,
        );        

        const customerAccessToken = loginData.customerAccessTokenCreate.customerAccessToken.accessToken;

        // set first/default Address
        const {
          firstName,
          lastName,
          company,
          address1,
          address2,
          country,
          state:province,
          city,
          zip,
          phone
        } = jsonBody;
      
        const address = {};
      
        if (firstName) address.firstName = firstName;
        if (lastName) address.lastName = lastName;
        if (company) address.company = company;
        if (address1) address.address1 = address1;
        if (address2) address.address2 = address2;
        if (country) address.country = "United States";
        if (province) address.province = province;
        if (city) address.city = city;
        if (zip) address.zip = zip;
        if (phone) address.phone = phone;
      
        const {data, errors} = await queryShop({
          query: CREATE_ADDRESS_MUTATION,
          variables: {
            address,
            customerAccessToken,
          },
          // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
          cache: CacheNone(),
        });
      
        const error = getApiErrorMessage('customerAddressCreate', data, errors);
      
        if (error) return new Response(JSON.stringify({error}), {status: 400});
      
        const {data: defaultDataResponse, errors:addrErrors} = await setDefaultAddress(
          queryShop,
          data.customerAddressCreate.customerAddress.id,
          customerAccessToken,
        );

        const addrError = getApiErrorMessage(
          'customerDefaultAddressUpdate',
          defaultDataResponse,
          errors,
        );

        if (error) return new Response(JSON.stringify({addrError}), {status: 400});
  
        const response = new Response(null, {
          status: 200
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
        response.headers.append("Access-Control-Allow-Origin", "*");
        return response; 
      }

    }
    else {
      const response = new Response(null, {
        status: 200,
      });

      response.headers.append("Access-Control-Allow-Origin", "*");
      return response; 
    }
    
  } else {
    const response = new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      {status: 401},
    );
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response; 
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

const CREATE_ADDRESS_MUTATION = gql`
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
  ) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
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