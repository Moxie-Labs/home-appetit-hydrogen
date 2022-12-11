import { Suspense } from "react";

export function Page(props, { children }) {

    return (
        <div id={`${props.id}`} className="page">
            <Suspense>{children}</Suspense>
        </div>
    );
  }