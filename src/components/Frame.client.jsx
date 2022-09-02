import { Suspense } from "react";

export function Frame({ children }) {

    return (
        <section className="frame">
            <Suspense>{children}</Suspense>
        </section>
    );
  }