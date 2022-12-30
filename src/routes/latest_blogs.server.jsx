import {Suspense} from 'react';
import {CacheLong, CacheNone, flattenConnection} from '@shopify/hydrogen';
import { Layout } from '../components/Layout.client';
import { GET_LATEST_BLOG_POSTS } from '../helpers/queries';

export default function GetBlogs({response}) {
    response.cache(CacheNone());
    return (
    <Layout>
        <Suspense>
            <h1>This is an API endpoint and returns no HTML data.</h1>
        </Suspense>
    </Layout>
    );
}


export async function api(request, {session, queryShop}) {

    if (!session) {
        return new Response('Session storage not available.', {status: 400});
    }

    const {data:blogData} = await queryShop({
        query: GET_LATEST_BLOG_POSTS,
        cache: CacheLong(),
        preload: true
    });

    const blogPosts = flattenConnection(blogData.blog.articles) || [];

    const response = new Response(JSON.stringify(blogPosts), { status: 200 });
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response;
}