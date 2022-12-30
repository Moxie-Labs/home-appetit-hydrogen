import {
    useShopQuery,
    CacheLong,
    gql,
    useUrl,
    Link,
    Seo,
  } from "@shopify/hydrogen";
  import { Suspense } from "react";
  
  /**
   * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
   */
  export function Layout({ children }) {
    const { pathname } = useUrl();
    const isHome = pathname === "/";
  
    const {
      data: { shop },
    } = useShopQuery({
      query: SHOP_QUERY,
      cache: CacheLong(),
      preload: true,
    });
  
    return (
      <>
        <Suspense>
          <Seo
            type="defaultSeo"
            data={{
              description: shop.description,
            }}
          />
        </Suspense>
        <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
          <main role="main" id="mainContent" className="flex-grow">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </>
    );
  }
  
  const SHOP_QUERY = gql`
    query ShopInfo {
      shop {
        name
        description
      }
    }
  `;
  