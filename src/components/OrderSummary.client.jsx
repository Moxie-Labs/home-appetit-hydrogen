import React, {useState, useCallback} from 'react';
import editIcon from "../assets/icon-edit-order-summary.png";
import iconPlusAlt from "../assets/icon-plus-alt.png";
import iconMinus from "../assets/icon-minus.png";
import iconTrash from "../assets/icon-trash.png";
import iconTrashWhite from "../assets/icon-trash-white.png"

import { prepModSubTitles } from '../lib/utils';
import { ADDON_ITEMS_STEP, FLEXIBLE_PLAN_NAME, MAIN_ITEMS_STEP, SIDE_ITEMS_STEP, TRADITIONAL_PLAN_NAME, FIRST_PAYMENT_STEP } from '../lib/const';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export default class OrderSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enlarged: false,
            trashIconSource: iconTrash
        }

        this.toggleEnlarge = this.toggleEnlarge.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
        this.switchTrashIcon = this.switchTrashIcon.bind(this);
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

    switchTrashIcon(iconKind) {
        let newIcon;
        if (iconKind === "white")
            newIcon = iconTrashWhite;
        else
            newIcon = iconTrash;

        this.setState({trashIconSource: newIcon});
    }


    orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal){
        
        const { freeQuantityLimit, handleChangeCurrentStep, currentStep, cardStatus } = this.props;

        return (
            <section className="order-summary--enlarged-items">
                <section className="order-summary--items main-items main--items-scheme">
                    <h4>{activeSchemeDisplay}</h4>
                    <section className="order-summary--scheme-details">
                        <ul>
                            <li className="order-summary--item">
                                <span className="order-summary--item-name">{servingCount} {servingCount > 1 ? 'people' : 'person'}</span>
                                <span className="order-summary--item-value">${pricingMultiplier}.00</span>
                            </li>
                        </ul>
                    </section>
                    
                </section>
                
                <section className="order-summary--items main-items">
                    <h4 className="bold">{getQuantityTotal(selectedMainItems)} of {freeQuantityLimit} Entrées { currentStep >= FIRST_PAYMENT_STEP || (Object.keys(mainItemList).length !== 0 && currentStep !== MAIN_ITEMS_STEP && cardStatus === "") ? <span onClick={() => handleChangeCurrentStep(MAIN_ITEMS_STEP)}><img src={editIcon}/></span> : null }</h4>
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
                    <h4 className="bold">{getQuantityTotal(selectedSmallItems)} of {freeQuantityLimit} Small Plates { currentStep >= FIRST_PAYMENT_STEP || (Object.keys(smallItemList).length !== 0 && currentStep !== SIDE_ITEMS_STEP && cardStatus === "") ? <span onClick={() => handleChangeCurrentStep(SIDE_ITEMS_STEP)}><img src={editIcon}/></span> : null}</h4>
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
                    <h4 className="bold">{getQuantityTotal(selectedAddonItems)} Add Ons { currentStep >= FIRST_PAYMENT_STEP || (Object.keys(selectedAddonItems).length !== 0 && currentStep !== ADDON_ITEMS_STEP && cardStatus === "") ? <span onClick={() => handleChangeCurrentStep(ADDON_ITEMS_STEP)}><img src={editIcon}/></span> : null}</h4>
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
        const {currentStep, activeScheme, servingCount, pricingMultiplier, selectedMainItems, selectedMainItemsExtra, selectedSmallItems, selectedSmallItemsExtra, selectedAddonItems, toastMessages, showToast, orderTotal, getQuantityTotal, getPhase, isEditing, emptyCart, removeItem, isAddingExtraItems, cartLinesLength} = this.props;
        const {enlarged} = this.state;

        const mainItemList = selectedMainItems.map((item, i) => {
            return (
                <li key={`main-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name order-summary--item-product">{item.quantity}x {item.choice.title}
                        { activeScheme === FLEXIBLE_PLAN_NAME && !isAddingExtraItems && removeItem !== null && currentStep === MAIN_ITEMS_STEP && <div className='remove-item-icon' onClick={() => removeItem(item, i, 'main')}></div> }
                    </span>
                    
                    { item.selectedMods?.map(mod => {
                        return <div className='order-summary--item-mod'>
                            <span>→ {prepModSubTitles(mod.title)}</span>
                            {parseFloat(mod.priceRange.maxVariantPrice.amount) > 0 && <span className="price--extra-addon">+ {this.calculateItemTotal(mod.priceRange.maxVariantPrice.amount * item.quantity)}</span> } 
                        </div>
                    }) }
                </li>
            );
        });

        const mainItemExtraList = selectedMainItemsExtra.map((item, i) => {
            return (
                <li key={`main-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name order-summary--item-product">{item.quantity}x {item.choice.title}
                        { activeScheme === FLEXIBLE_PLAN_NAME && isAddingExtraItems && removeItem !== null && currentStep === MAIN_ITEMS_STEP && <div className='remove-item-icon' onClick={() => removeItem(item, i, 'mainExtra')}></div> }
                    </span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                    { item.selectedMods?.map(mod => {
                        return <div className='order-summary--item-mod'>
                            <span>→ {prepModSubTitles(mod.title)}</span>
                            {parseFloat(mod.priceRange.maxVariantPrice.amount) > 0 && <span className="price--extra-addon">+ {this.calculateItemTotal(mod.priceRange.maxVariantPrice.amount * item.quantity)}</span> } 
                        </div>
                    }) }
                </li>
            );
        });

        const smallItemList = selectedSmallItems.map((item, i) => {
            return (
                <li key={`small-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name order-summary--item-product">{item.quantity}x {item.choice.title}
                        { activeScheme === FLEXIBLE_PLAN_NAME && !isAddingExtraItems && removeItem !== null && currentStep === SIDE_ITEMS_STEP && <div className='remove-item-icon' onClick={() => removeItem(item, i, 'sides')}></div> }
                    </span>
                    { item.selectedMods?.map(mod => {
                        return <div className='order-summary--item-mod'>
                            <span>→ {prepModSubTitles(mod.title)}</span>
                            {parseFloat(mod.priceRange.maxVariantPrice.amount) > 0 && <span className="price--extra-addon">+ {this.calculateItemTotal(mod.priceRange.maxVariantPrice.amount * item.quantity)}</span> } 
                        </div>
                    }) }
                </li>
            );
        });

        const smallItemExtraList = selectedSmallItemsExtra.map((item, i) => {
            return (
                <li key={`small-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name order-summary--item-product">{item.quantity}x {item.choice.title}
                        { activeScheme === FLEXIBLE_PLAN_NAME && isAddingExtraItems && removeItem !== null && currentStep === SIDE_ITEMS_STEP && <div className='remove-item-icon' onClick={() => removeItem(item, i, 'sidesExtra')}></div> }
                    </span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                    { item.selectedMods?.map(mod => {
                        return <div className='order-summary--item-mod'>
                            <span>→ {prepModSubTitles(mod.title)}</span>
                            {parseFloat(mod.priceRange.maxVariantPrice.amount) > 0 && <span className="price--extra-addon">+ {this.calculateItemTotal(mod.priceRange.maxVariantPrice.amount * item.quantity)}</span> } 
                        </div>
                    }) }
                   
                </li>
            );
        });

        const addonItemList = selectedAddonItems.map((item, i) => {
            return (
                <li key={`addon-item-${i}`} className="order-summary--item">
                    <span className="order-summary--item-name order-summary--item-product">{item.quantity}x {item.choice.title}
                        { activeScheme === FLEXIBLE_PLAN_NAME && removeItem !== null && currentStep === ADDON_ITEMS_STEP && <div className='remove-item-icon' onClick={() => removeItem(item, i, 'addons')}></div> }
                    </span>
                    <span className="price--extra-addon">+ ${item.choice.price * item.quantity}.00</span>
                    { item.selectedMods?.map(mod => {
                        return <div className='order-summary--item-mod'>
                            <span>→ {prepModSubTitles(mod.title)}</span>
                            {parseFloat(mod.priceRange.maxVariantPrice.amount) > 0 && <span className="price--extra-addon">+ {this.calculateItemTotal(mod.priceRange.maxVariantPrice.amount * item.quantity)}</span> } 
                        </div>
                    }) }
                    
                </li>
            );
        });

        if (toastMessages.length > 0 && showToast) {
            this.showToastMessage();
        }

        const activeSchemeDisplay = activeScheme === TRADITIONAL_PLAN_NAME ? 'Classic Plan' : 'Flex Plan';

        let toastItemName = "";
        if (toastMessages.length > 0) {
            toastItemName = toastMessages[0].item.slice(0,25);
            if (toastMessages[0].item.length > 25)
                toastItemName += "...";
        }
        
        const toastCostSection = (activeScheme !== TRADITIONAL_PLAN_NAME || currentStep === 4) ? <span className="text-right pull-right">+ ${toastMessages[0]?.cost.toFixed(2)}</span> : null;

        const summaryHeading = (toastMessages.length > 0 && showToast &&  !enlarged) ? <h3 onClick={() => this.toggleEnlarge()} className={"order-summary__heading order-summary__hidden show-toast"}>{toastItemName}{toastCostSection}</h3> : <h3 onClick={() => this.toggleEnlarge()} className={"order-summary__heading " + (enlarged ? '' : 'order-summary__hidden')}>Order Summary<span className="text-right pull-right"> {enlarged ? '—' : this.calculateItemTotal(orderTotal) + ' '} {enlarged !== true && getPhase !== "payment" && <img src={iconPlusAlt} className="icon-plus-alt" /> }</span></h3>


        return (
            <section className={`order-summary ${isEditing ? 'disabled' : ''}`}>
                <section className="order-summary--inner">

                { getPhase !== "payment" && getPhase !== "confirmation" && summaryHeading }
                
                { enlarged && getPhase === undefined ?
                    <div className='order-summary__body'>
                        <div>
                            {this.orderSummary(activeScheme, activeSchemeDisplay, servingCount, pricingMultiplier, selectedMainItems, mainItemList, mainItemExtraList, selectedSmallItems, smallItemList, smallItemExtraList, addonItemList, selectedAddonItems, orderTotal, getQuantityTotal, emptyCart)}
                        </div>
                        <div className='btn-empty-cart-container'>
                            <button onMouseEnter={() => this.switchTrashIcon("white")} onMouseLeave={() => this.switchTrashIcon("")} className={`btn btn-empty-cart`} disabled={cartLinesLength < 1} onClick={emptyCart}>Clear Cart <img src={this.state.trashIconSource}/></button>
                        </div>
                    </div>
                    :
                    <></>
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