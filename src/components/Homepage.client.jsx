import { Link } from '@shopify/hydrogen';

export default function Homepage(props) {
    return (
        <>
            <h1>Home Appetit Hydrogen</h1>
            <ul>
                <li>
                    <Link to="/account">My Account</Link>
                    <p>Status: Needs Styling</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/signup">Signup Form</Link>
                    <p>Status: Needs Visual Pass</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/order">Order (Logged In)</Link>
                    <p>Status: Cannot Generate Checkout from Cart</p>
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