import { Link } from '@shopify/hydrogen';

export default function Homepage(props) {
    return (
        <>
            <h1>Home Appetit Hydrogen</h1>
            <ul>
                <li>
                    <Link to="/account">My Account</Link>
                    <p>Status:</p>
                    <ul>
                        <li>Requires an activated account to login</li>
                        <li>Activation still links to Liquid site on success</li>
                        <li>Gift Card and Payment sections do not have significant API access to function</li>
                    </ul>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/signup">Signup Form</Link>
                    <p>Status: Needs Visual Pass</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/order">Order (Logged In)</Link>
                    <p>Status:</p>
                    <ul>
                        <li>Checkout generated ignore address, delivery, and payment info</li>
                        <li>Issues when removing content added before extra Entrees and Sides</li>
                        <li>Occassional (temporary) crash on load</li>
                        <li>Excessive re-renders</li>
                    </ul>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/order?guest=true">Order (Guest)</Link>
                    <p>Status: Assumes Logged-In User</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/gift-cards">Gift Cards</Link>
                    <p>Status: Awaiting Visual Pass</p>
                    <hr></hr>
                </li>
            </ul>
        </>
    );
}