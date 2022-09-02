import { Suspense } from "react";

export function LayoutSection({ children }) {

    return (
        <div className="layout-section">
            <Suspense>{children}</Suspense>
        </div>
    );
  }