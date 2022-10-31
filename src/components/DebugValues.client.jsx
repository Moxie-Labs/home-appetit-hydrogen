import React from 'react';

export default function DebugValues(props) {

    const { isAddingExtraItems, selectedMainItems, selectedMainItemsExtra } = props;

    return (
        <section>
            <h1>Debug Values</h1>

            <p>Selected Plan: {props.activeScheme}</p>

            <p>Serving Count: {props.servingCount}</p>

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
                    
        </section>
    )
}