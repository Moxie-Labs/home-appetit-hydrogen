import React from 'react';

export default function DebugValues(props) {

    const { isAddingExtraItems, selectedMainItems, selectedMainItemsExtra } = props;

    return (
        <section>
            <h1>Debug Values</h1>

            <p>Current Step: {props.currentStep}</p>

            <p>Selected Plan: {props.activeScheme}</p>

            <p>Serving Count: {props.servingCount}</p>

            <p>isAddingExtraItems: { isAddingExtraItems ? 'true' : 'false' } </p>

            { selectedMainItems !== undefined && 
                <div>
                    <h2>Selected Main Items</h2>
                    <ul>
                        {selectedMainItems.map(item => {
                            console.log("debug::item", item);
                            return <li>{item.quantity}x {item.choice.title} ({item.selectedVariantId})</li>
                        })}
                    </ul>
                </div>
            }

            { selectedMainItemsExtra !== undefined && 
                <div>
                    <h2>Selected Main Items Extra</h2>
                    <ul>
                        {selectedMainItemsExtra.map(item => {
                            return <li>{item.quantity}x {item.choice.title}</li>
                        })}
                    </ul>
                </div>
            }

            <h2>Static Items</h2>
            {props.traditionalPlanItem.variants.edges.map(edge => {
                return <li>{edge.node.id}</li>
            
            })}

            <h2>Pricing</h2>
            <p>{props.activeScheme} Plan Price: ${props.planPrice}</p>

            <h2>Cart</h2>
            <ul>
            {props.cartLines.map(line => {
                const {id, product, variant} = line.merchandise;
                return <li>{line.quantity}x {product.title}({id})</li>
            })}
            </ul>

            <p><a href={props.checkoutUrl} target="_blank">Checkout URL</a></p>

            <p>CartID: {props.cartId}</p>

            <p>userAddedItem: {props.userAddedItem ? 'true' : 'false'}</p>
                    
        </section>
    )
}