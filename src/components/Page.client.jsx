import { Suspense } from "react";
import { Header } from './Header.client';

export function Page({children}) {

    return (
        <div>
        {/* <Header /> */}
        <div className="page">
            <Suspense>{children}</Suspense>
        </div>
        </div>
    );
  }