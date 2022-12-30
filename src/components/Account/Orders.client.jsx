
import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { logToConsole } from "../../helpers/logger";
export default function Orders(props) {

    const [showModal, setShowModal] = useState(false);
    const [modalOrder, setModalOrder] = useState(null);
    const { orders, customer } = props;
    const { payments, addresses } = customer;
    const currentOrders = [];
    const pastOrders = [];
    let orderID;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    orders.forEach(order => {
        if (order.fulfillmentStatus === "UNFULFILLED")
            currentOrders.push(order);
        else if (order.fulfillmentStatus === "FULFILLED")
            pastOrders.push(order);
    });

    const handleModal = order => {
        logToConsole("Changing modalOrder to: ", order)
        setModalOrder(order);
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
            <td><a className="orders--order-number" onClick={() => handleModal(order)}>#{order.orderNumber}</a></td>
            <td><span className="desktop-only">Ordered: </span>{`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>{formatter.format(parseFloat(order.currentTotalPrice.amount))}</b></td>
        </tr>);
    });

    const pastOrderList = pastOrders.map((order, i) => {
        logToConsole("pastOrderList Order:", order);
        return (<tr key={i}>
            <td><a className="orders--order-number" onClick={() => handleModal(order)}>#{order.orderNumber}</a></td>
            <td><span className="desktop-only">Ordered: </span>{`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>{formatter.format(order.currentTotalPrice.amount)}</b></td>
        </tr>);
    });

    function getFormattedDate(date) {
        let formattedDate = new Date(date);
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];

        let year = formattedDate.getFullYear();
        let month = monthNames[(formattedDate.getMonth()).toString().padStart(2, '0')];
        let day = formattedDate.getDate().toString().padStart(2, '0');

      
        return month + ' ' + day + ', ' + year;
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
                            <div>{formatter.format(order.totalShippingPrice.amount)}</div>
                            <div>${order.totalTax.amount}</div>
                            <div>${order.totalPrice.amount}</div>
                        </div>
                    </div>
                );
            }
        });

        return orderTotalDetails;
    }

    const getOrderItems = () => {
        return modalOrder.lineItems.edges.map(edge => {
            const {node:item} = edge;
            return (
                <div key={item.id} className="table-row">
                    <div>{item.title}</div>
                    <div>{item.currentQuantity}</div>
                    <div>{parseFloat(item.variant?.price.amount) > 0 ? formatter.format(item.variant?.price.amount) : "Included"}</div>
                    <div>{parseFloat(item.variant?.price.amount) > 0 ? formatter.format(item.originalTotalPrice.amount) : "Included"}</div>
                </div>
           );
        });
    }
    
    const getShippingAddress = () => {
        return (
            <div>
                <p>{modalOrder.shippingAddress.address1}</p>
                {modalOrder.shippingAddress.address2 !== "" && !modalOrder.shippingAddress.address2.includes("null") && modalOrder.shippingAddress.address2 !== null && <p>{modalOrder.shippingAddress.address2}</p>}
                <p>{modalOrder.shippingAddress.city}, {modalOrder.shippingAddress.province} {modalOrder.shippingAddress.zip}</p>
            </div>
        );
    }

    return (
        
        <div className="order-information">
            { pastOrders.length == 0 && currentOrders.length == 0 &&
                <div className="order__no-history">
                    <h3 className="ha-h3 no-margin">No Order History</h3>
                    <p className="ha-body no-margin order__no-history--subtitle">Check back after you’ve placed your next order!</p>
                    <br />
                    <a href="/order" className="btn-order-cta text-uppercase">Order now</a>
                </div>
            }

            { currentOrders.length > 0 && <h1 className="ha-h5">Current Orders</h1> }    
            { currentOrders.length > 0 && 
            <section>
                
                <table className="order-table">
                    {currentOrderList}
                </table>    
            </section>
            
            }

            { currentOrders.length > 0 && <div className="line-separator"></div> }

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
                onRequestClose={() => setShowModal(false)}
                className='order-details-modal'
            >
                { modalOrder !== null &&  
                    <div className="order-details-wrapper">
                        <button className="prev-order-modal--exit" onClick={() => setShowModal(false)}></button>
                        <div className="details--column items">
                            <h1>Order #{modalOrder.orderNumber}</h1>
                            <h2>Status: {getOrderStatus(modalOrder.fulfillmentStatus)}</h2>
                            <p>Placed on {getFormattedDate(modalOrder.processedAt)}</p>
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
                        <div className="details--column addresses">
                            <div className="address-container">
                                <h2>Billing Address</h2>           
                                <p>{addresses.edges[0].node.address1}</p>
                                {addresses.edges[0].node.address2 !== "" && addresses.edges[0].node.address2 !== null && !addresses.edges[0].node.address2.includes("null") && <p>{addresses.edges[0].node.address2}</p>}
                                <p>{addresses.edges[0].node.city}, {addresses.edges[0].node.province} {addresses.edges[0].node.zip}</p>
                            </div>
                            <div className="address-container">
                                <h2>Shipping Address</h2>
                                {getShippingAddress()}
                            </div>
                        </div>
                    </div>
                }
                
            </Modal>
            

        </div>


        
    );
}