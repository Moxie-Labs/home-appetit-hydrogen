import { Suspense } from 'react';
import { CacheNone, Seo } from '@shopify/hydrogen';

import { AccountCreateForm } from '../../components/Account/index';
import { Layout } from '../../components/Layout.client';

export default function ZipcodeCheck() {

  // const {
  //   data: zipcodeData,
  // } = useShopQuery({
  //   query: GET_ZIPCODES_QUERY,
  //   cache: CacheLong(),
  //   preload: true,
  // });

  // Code for checking is the zip code present in delivery zone by creating an array of zipcodes available

  // const { inrangeZipcodes } = zipcodeData.page;
  // const validZipcodes = JSON.parse(inrangeZipcodes.value)
  // let zipcodeArr = [];
  // validZipcodes.forEach(validCode => {
  //   zipcodeArr.push(validCode.zip_code);
  // });

  // const zipcodeCheck = zipcodeArr.find(e => e.includes(zipcode));

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{ title: 'Register' }} />
      </Suspense>
      <AccountCreateForm />
    </Layout>
  );
}

export async function api(request, { queryShop }) {
  const jsonBody = await request.json();

  if (!jsonBody.zipcode) {
    return new Response(
      JSON.stringify({ error: 'Zipcode are required' }),
      { status: 400 },
    );
  }

  const { data, errors } = await queryShop({
    query: ZIPCODE_CHECK_MUTATION,
    variables: {
      input: {
        zipcode: jsonBody.zipcode,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const errorMessage = getApiErrorMessage('zipcodeCheck', data, errors);

  if (
    !errorMessage &&
    data &&
    data.zipcodeCheck
  ) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      { status: 401 },
    );
  }
}

const ZIPCODE_CHECK_MUTATION = gql``;
