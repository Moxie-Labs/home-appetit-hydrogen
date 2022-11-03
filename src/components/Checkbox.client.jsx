import { Suspense } from "react";

export function Checkbox(props) {

    const { label, checked, onChange, price } = props;

    return (
        <div className="checkbox-temp">
            <input className='checkbox' type="checkbox" checked={checked} onChange={onChange}/><label>{label}</label> <strong>{price}</strong>
        </div>
    );
}