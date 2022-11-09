
import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";
export default function Orders(props) {

    const [showModal, setShowModal] = useState(false);
    const { orders, customer } = props;
    const { payments, addresses } = customer;
    const currentOrders = [];
    const pastOrders = [];
    let orderID;

    orders.forEach(order => {
        if (order.fulfillmentStatus === "UNFULFILLED")
            currentOrders.push(order);
        else if (order.fulfillmentStatus === "FULFILLED")
            pastOrders.push(order);
    });

    const handleModal = (event) => {
        orderID = event.currentTarget.textContent.replace("#", "").toString();
        getOrderDate(orderID);
        getOrderTotalDetails(orderID);
        getOrderItems(orderID);
        getshippingAddress(orderID);

        setShowModal(true);
      }

    const getOrderStatus = status => {
        if (status === "UNFULFILLED") 
            return "Order Placed";
        else if (status === "IN_PROGRESS")
            return "In Progress";
        else if (status === "FULFILLED")
            return "Delivered";
        else if (status === "ON_HOLD")
            return "On Hold";
    }

    function convertMonth(date){
        return new Date(date).getMonth();
    }

    function convertDate(date){
        return new Date(date).getDate();
    }

    const currentOrderList = currentOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a className="orders--order-number" onClick={handleViewOrder}>#{order.orderNumber}</a></td>
            <td>Ordered: {`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${parseFloat(order.currentTotalPrice.amount).toFixed(2)}</b></td>
        </tr>);
    });

    const pastOrderList = pastOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a className="orders--order-number" onClick={handleModal}>#{order.orderNumber}</a></td>
            <td>Ordered: {`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${parseFloat(order.currentTotalPrice.amount).toFixed(2)}</b></td>
        </tr>);
    });

    function getFormattedDate(date) {
        let formattedDate = new Date(date);
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];

        let year = formattedDate.getFullYear();
        let month = monthNames[(1 + formattedDate.getMonth()).toString().padStart(2, '0')];
        let day = formattedDate.getDate().toString().padStart(2, '0');

      
        return month + ' ' + day + ', ' + year;
    }

    const getOrderDate = (orderID) => {
        let orderDate = "";
        pastOrders.forEach(order => {
            if (order.orderNumber == orderID){
                orderDate = order.processedAt;
            }
        });

        return getFormattedDate(orderDate);
    }

    const getOrderTotalDetails = (orderID) => {
        const orderTotalDetails = pastOrders.map((order, i) => {
            if (order.orderNumber == orderID){
                return (
                    <div className="table-row-total">
                        <div className="table-column">
                            <div>Subtotal</div>
                            <div>Shipping (Economy)</div>
                            <div>Tax (Pennsylvania State Tax 6.0%)</div>
                            <div>TOTAL</div>
                        </div>
                        <div className="table-column">
                            <div>${order.subtotalPrice.amount}</div>
                            <div>${order.totalShippingPrice.amount}</div>
                            <div>${order.totalTax.amount}</div>
                            <div>${order.totalPrice.amount}</div>
                        </div>
                    </div>
                );
            }
        });

        return orderTotalDetails;
    }

    const getOrderItems = (orderID) => {
        let orderItemsArray = [];
        pastOrders.map((order, i) => {
            if (order.orderNumber == orderID){
                orderItemsArray.push(order.lineItems);
            }
        });
        
        const orderItems = orderItemsArray.map((order, i) => {
            return (
            <div key={i}>
                {order.edges.map(items => 
                <div className="table-row">
                    <div>{items.node.title}</div>
                    <div>{items.node.currentQuantity}</div>
                    <div>${items.node.variant.price.amount}</div>
                    <div>${items.node.originalTotalPrice.amount}</div>
                </div>
                )}
            </div>
           );
        });

        return orderItems;
    }
    
    const getshippingAddress = (orderID) => {
        const orderShippingAddress = pastOrders.map((order, i) => {
            if (order.orderNumber == orderID){
                return (
                    <div key={i}>
                        <p><b>Fulfillment Status: {order.fulfillmentStatus}</b></p>
                        <p>{order.shippingAddress.address1}</p>
                        {order.shippingAddress.address2 !== "" && <p>{order.shippingAddress.address2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                    </div>
                );
            }
        });

        return orderShippingAddress;
    }

    return (
        
        <div className="order-information">
            { pastOrders.length == 0 && currentOrders.length == 0 &&
                <div className="order__no-history">
                    <h3 className="ha-h3 no-margin">No Order history</h3>
                    <p className="ha-body no-margin">Check back after you’ve placed your next order!</p>
                    <br />
                    <a href="/order" className="btn-order-cta text-uppercase">Order now</a>
                </div>
            }

            <h1 className="ha-h5">Current Orders</h1>       
            { currentOrders.length > 0 && 
            <section>
                
                <table className="order-table">
                    {currentOrderList}
                </table>    
            </section>
            
            }

            <div className="line-separator"></div>

            { pastOrders.length > 0 && 
            <section>
                <h1 className="ha-h5">Past Orders</h1>
                <table className="order-table">
                    {pastOrderList}
                </table>
            </section>
            }

            <Modal
            isOpen={showModal}
            className='order-details-modal'
            >
                <div className="order-details-wrapper">
                    <div className="details--column">
                        <h1>Order #{orderID}</h1>
                        <p>Placed on {getOrderDate()}</p>
                        <div className="product-table">
                            <div className="table-header">
                                <div className="table--title">PRODUCT</div>
                                <div className="table--title">QUANTITY</div>
                                <div className="table--title">PRICE</div>
                                <div className="table--title">TOTAL</div>
                            </div> 
                            {getOrderItems()}
                            {getOrderTotalDetails()}
                        </div>
                    </div>
                    <div className="details--column">
                        <div className="address-container">
                            <h2>Billing Address</h2>           
                            <p>{addresses.edges[0].node.address1}</p>
                            {addresses.edges[0].node.address2 !== "" && <p>{addresses.edges[0].node.address2}</p>}
                            <p>{addresses.edges[0].node.city}, {addresses.edges[0].node.province} {addresses.edges[0].node.zip}</p>
                        </div>
                        <div className="address-container">
                            <h2>Shipping Address</h2>
                            {getshippingAddress()}
                        </div>
                    </div>
                </div>
            </Modal>
            

        </div>


        
    );
}