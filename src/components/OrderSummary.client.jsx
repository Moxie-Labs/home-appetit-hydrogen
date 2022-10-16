import React, {useState, useCallback} from 'react';
import editIcon from "../assets/icon-edit-order-summary.png";
import iconPlusAlt from "../assets/icon-plus-alt.png";
import iconMinus from "../assets/icon-minus.png";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export default class OrderSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enlarged: false
        }

        this.toggleEnlarge = this.toggleEnlarge.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
    }

    calculateItemTotal(price) {
        if (isNaN(parseFloat(price)))
            price = 0.0;
        return formatter.format(price);
    }

    toggleEnlarge() {
        const {enlarged} = this.state;
        this.setState({enlarged: !enlarged})
    }

    showToastMessage() {
    }

    orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal){
        return (
            <section className="order-summary--enlarged-items">
                <section className="order-summary--items main-items main--items-scheme">
                    <h4>{activeSchemeDisplay}</h4>
                    { activeScheme === 'traditional' && <section className="order-summary--scheme-details">
                        <ul>
                            <li className="order-summary--item">
                                <span className="order-summary--item-name">{servingCount} people</span>
                                <span className="order-summary--item-value">${pricingMultiplier}.00</span>
                            </li>
                        </ul>
                    </section> }
                    
                </section>
                
                <section className="order-summary--items main-items">
                    <h4 className="bold">{getQuantityTotal(selectedMainItems)} { activeScheme === 'traditional' && `of 4` } Entrées { Object.keys(mainItemList).length !== 0 && <span><img src={editIcon}/></span> }</h4>
                    <ul>
                        {mainItemList} 
                    </ul>
                    { mainItemExtraList.length > 0 &&  
                        <ul>
                            {mainItemExtraList} 
                        </ul>
                    }
                </section>      

                <section className="order-summary--items small-items">
                    <h4 className="bold">{getQuantityTotal(selectedSmallItems)} { activeScheme === 'traditional' && `of 4` } Small Plates { Object.keys(smallItemList).length !== 0 && <span><img src={editIcon}/></span>}</h4>
                    <ul>
                        {smallItemList}
                    </ul>
                    { smallItemExtraList.length > 0 &&  
                        <ul>
                            {smallItemExtraList} 
                        </ul>
                    }
                </section>     

                <section className="order-summary--items addon-items">
                    <h4 className="bold">{getQuantityTotal(selectedAddonItems)} Add Ons { Object.keys(selectedAddonItems).length !== 0 && <span><img src={editIcon}/></span>}</h4>
                    <ul>
                        {addonItemList}
                    </ul>
                </section>     

                <section className="order-summary--total">
                    <span className="order-summary--item-name">Order Total:</span><span className="order-summary--item-value">{this.calculateItemTotal(orderTotal)}</span>
                </section>
            </section>
        );
    }

    render() {
        const {currentStep, activeScheme, servingCount, pricingMultiplier, selectedMainItems, selectedMainItemsExtra, selectedSmallItems, selectedSmallItemsExtra, selectedAddonItems, toastMessages, showToast, orderTotal, getQuantityTotal, getPhase} = this.props;
        const {enlarged} = this.state;
        console.log(getPhase);

        const mainItemList = selectedMainItems.map((item, i) => {
            return (
                <li key={`main-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name">{item.quantity}x {item.choice.title}</span>
                    { activeScheme === 'flexible' && <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span> }
                </li>
            );
        });

        const mainItemExtraList = selectedMainItemsExtra.map((item, i) => {
            return (
                <li key={`main-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name">{item.quantity}x {item.choice.title}</span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                </li>
            );
        });

        const smallItemList = selectedSmallItems.map((item, i) => {
            return (
                <li key={`small-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name">{item.quantity}x {item.choice.title}</span>
                    { activeScheme === 'flexible' && <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span> }
                </li>
            );
        });

        const smallItemExtraList = selectedSmallItemsExtra.map((item, i) => {
            return (
                <li key={`small-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name">{item.quantity}x {item.choice.title}</span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                </li>
            );
        });

        const addonItemList = selectedAddonItems.map((item, i) => {
            return (
                <li key={`addon-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name">{item.quantity}x {item.choice.title}</span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                </li>
            );
        });

        if (toastMessages.length > 0 && showToast) {
            this.showToastMessage();
        }

        const activeSchemeDisplay = activeScheme === 'traditional' ? 'Traditional Plan' : 'Flexible Plan';

        let toastItemName = "";
        if (toastMessages.length > 0) {
            toastItemName = toastMessages[0].item.slice(0,30);
            if (toastMessages[0].item.length > 30)
                toastItemName += "...";
        }
        
        const toastCostSection = (activeScheme !== 'traditional' || currentStep === 4) ? <span className="text-right pull-right">+ ${toastMessages[0]?.cost.toFixed(2)}</span> : null;

        const summaryHeading = (toastMessages.length > 0 && showToast &&  !enlarged) ? <h3 className={"order-summary__heading order-summary__hidden show-toast"}>{toastItemName}{toastCostSection}</h3> : <h3 className={"order-summary__heading " + (enlarged ? '' : 'order-summary__hidden')}>Order Summary<span className="text-right pull-right"> {enlarged ? '—' : this.calculateItemTotal(orderTotal) + ' '} {enlarged !== true && getPhase !== "payment" && <img src={iconPlusAlt} className="icon-plus-alt" /> }</span></h3>


        return (
            <section className="order-summary">
                <section className="order-summary--inner" onClick={() => this.toggleEnlarge()}>

                { getPhase !== "payment" && getPhase !== "confirmation" && summaryHeading }
                
                { enlarged &&
                    <div>
                    {this.orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal)}
                    </div>
                }

                { getPhase === "payment" && <h3 className="order-summary__heading order-summary__hidden">Order Summary</h3> }
                { getPhase === "payment" && 
                    this.orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal)
                 }

                { getPhase === "confirmation" && <h3 className="order-summary__heading order-summary__hidden">Order Summary</h3> }
                { getPhase === "confirmation" && 
                    this.orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal)
                 }
                </section>
            </section>
        );
    }
}