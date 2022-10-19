export default function Orders(props) {

    const { orders } = props;
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

    function convertMonth(date){
        return new Date(date).getMonth();
    }

    function convertDate(date){
        return new Date(date).getDate();
    }

    const currentOrderList = currentOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a>#{order.orderNumber}</a></td>
            <td>Ordered: {`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${parseFloat(order.currentTotalPrice.amount).toFixed(2)}</b></td>
        </tr>);
    });

    const pastOrderList = pastOrders.map((order, i) => {
        return (<tr key={i}>
            <td><a>#{order.orderNumber}</a></td>
            <td>Ordered: {`${convertMonth(order.processedAt)+1}/${convertDate(order.processedAt)}`}</td>
            <td>{getOrderStatus(order.fulfillmentStatus)}</td>
            <td><b>${parseFloat(order.currentTotalPrice.amount).toFixed(2)}</b></td>
        </tr>);
    });

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