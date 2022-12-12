import { Suspense } from "react";

export function Page({children}) {

    return (
        <div className="page">
            <Suspense>{children}</Suspense>
        </div>
    );
  }