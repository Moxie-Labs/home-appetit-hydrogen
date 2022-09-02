import { Suspense } from "react";

export function Modal({ children }) {

    return (
        <div className="modal-temp">
            <Suspense>{children}</Suspense>
        </div>
    );
}