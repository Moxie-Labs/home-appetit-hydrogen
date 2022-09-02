import { Suspense } from "react";

export function ButtonGroup({ children }) {

    return (
        <section className="button-group">
            <Suspense>{children}</Suspense>
        </section>
    );
  }