import { Suspense } from "react";

export function Checkbox({ children }) {

    return (
        <div className="checkbox-temp">
            <Suspense>{children}</Suspense>
        </div>
    );
}