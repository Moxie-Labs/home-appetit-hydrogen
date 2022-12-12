import { Suspense } from "react";

export function Page({ children }, props) {

    return (
        <div id={`${props.id}`} className="page">
            <Suspense>{children}</Suspense>
        </div>
    );
  }