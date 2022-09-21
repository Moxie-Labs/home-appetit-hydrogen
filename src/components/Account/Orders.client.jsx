export default function Orders(props) {

    const { customer } = props;
    const { orders } = customer;
    const currentOrders = [];
    const pastOrders = [];

    orders.forEach(order => {
        if (order.fulfillmentStatus === "UNFULFILLED")
            currentOrders.push(order);
        else if (order.fulfillmentStatus === "FULFILLED")
            pastOrders.push(order);
    });

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

    const currentOrderList = currentOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a>#{order.orderNumber}</a></td>
            <td>Ordered: {`${order.processedAt.getMonth()+1}/${order.processedAt.getDate()}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${order.totalPriceV2.amount.toFixed(2)}</b></td>
        </tr>);
    });

    const pastOrderList = pastOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a>#{order.orderNumber}</a></td>
            <td>Ordered: {`${order.processedAt.getMonth()+1}/${order.processedAt.getDate()}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${order.totalPriceV2.amount.toFixed(2)}</b></td>
        </tr>);
    });

    return (
        <div className="order-information">

            { currentOrders.length > 0 && 
            <section>
                <h1 className="ha-h5">Current Orders</h1>
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
            

        </div>
    );
}