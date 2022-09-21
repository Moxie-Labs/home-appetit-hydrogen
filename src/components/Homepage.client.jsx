import { Link } from '@shopify/hydrogen';

export default function Homepage(props) {
    return (
        <>
            <h1>Home Appetit Hydrogen</h1>
            <ul>
                <li>
                    <a style={{opacity: 0.6}}>My Account</a>
                    <p>Status: Awaiting Code Merge</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/signup">Signup Form</Link>
                    <p>Status: Needs Visual Pass</p>
                    <hr></hr>
                </li>
                <li>
                    <Link to="/order">Order (Logged In)</Link>
                    <p>Status: Known Bugs</p>
                    <ul>
                        <li>[Generated Checkout] Ignores Delivery/Payment Information</li>
                        <li>[Generated Checkout] Persists Until Browser Cache is Cleared</li>
                        <li>[Generated Checkout] Ice Cannot Be Added</li>
                        <li>[Generated Checkout] Items Cannot Have Their Quantities Updated</li>
                        <li>[Order Page] Extra Modal is Temporarily Disabled</li>
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