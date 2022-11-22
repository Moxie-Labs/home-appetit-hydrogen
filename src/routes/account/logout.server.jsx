export async function api(request, {session}) {

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  await session.set('customerAccessToken', '');

  // if: logging out from Hydrogen
  if (request.method === 'POST') {
    return new Response();

    // else: logging out from Marketing
  } else {
    return new Response("EENT", {status: 200});
    // const response = new Response(null, {
    //   status: 301,
    //   headers: {
    //     Location: `https://${import.meta.env.VITE_STORE_DOMAIN}/`
    //   },
    // });
  
    // response.headers.append("Access-Control-Allow-Origin", "*");
    // return response;
  }

}