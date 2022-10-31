import React from 'react';

export default function DebugValues(props) {

    const { isAddingExtraItems, selectedMainItems, selectedMainItemsExtra } = props;

    return (
        <section>
            <h1>Debug Values</h1>

            <p>isAddingExtraItems: { isAddingExtraItems ? 'true' : 'false' } </p>

            { selectedMainItems !== undefined && 
                <div>
                    <h2>Selected Main Items</h2>
                    <ul>
                        {selectedMainItems.map(item => {
                            return <li>{item.quantity}x {item.choice.title}</li>
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
                const {product, variant} = line.merchandise;
                return <li>{line.quantity}x {product.title}</li>
            })}
            </ul>
                    
        </section>
    )
}