import { Suspense } from "react";

export function Layout({ children }) {

    return (
        <main role="main" id="mainContent" className="layout flex-grow">
            <Suspense>{children}</Suspense>
        </main>
    );
  }