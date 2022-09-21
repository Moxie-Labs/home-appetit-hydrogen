import { Suspense } from "react";

export function Checkbox(props) {

    const { label, checked, onChange } = props;

    return (
        <div className="checkbox-temp">
            <input type="checkbox" checked={checked} onChange={onChange}/><label>{label}</label>
        </div>
    );
}