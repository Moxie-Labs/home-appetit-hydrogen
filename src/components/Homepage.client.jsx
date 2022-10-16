import { Link } from '@shopify/hydrogen';

export default function Homepage(props) {
    const { customerData, customerAccessToken } = props;

    console.log("customerAccessToken", customerAccessToken)

    return (
        <>
            <h1>Home Appetit Hydrogen</h1>
            {  }
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
                { customerData !== null && <li>
                    <Link to="/order">Order (Logged In)</Link>
                    <p>Logged in as: <b>{customerData.customer.email}</b></p>
                    <p>Status: Automatically associates Customers to Order when Token is present (such as now)</p>
                    <hr></hr>
                </li> }
                { customerData === null && <li>
                    <Link to="/order">Order (Guest)</Link>
                    <p>Status: Defaults to Guest When Token is empty (such as now)</p>
                    <hr></hr>
                </li>
                }
                <li>
                    <Link to="/gift-cards">Gift Cards</Link>
                    <p>Status: Awaiting Visual Pass</p>
                    <hr></hr>
                </li>
            </ul>
        </>
    );
}