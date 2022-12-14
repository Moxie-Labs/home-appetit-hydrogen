import React, { useEffect, useState } from 'react';
import quantityPlus from "../assets/quantity-plus.png";
import quantityMinus from "../assets/quantity-minus.png";
import iconCloseBtn from "../assets/icon-close-btn.png";
import { Checkbox } from './Checkbox.client';
import Modal from 'react-modal/lib/components/Modal';
import { FLEXIBLE_PLAN_NAME, TRADITIONAL_PLAN_NAME } from '../lib/const';
import { logToConsole } from '../helpers/logger';

export default function DishCard(props) {

    const [isCardActive, setIsCardActive] = useState(false);
    const [isModModalShowing, setIsModModalShowing] = useState(false);
    const [quantity, setQuantity] = useState(props.initialQuantity);
    const [selected, setSelected] = useState(['hidden']);
    const [confirmed, setConfirmed] = useState(props.confirmed);
    const [checkedOptions, setCheckedOptions] = useState([
        false, 
        false, 
        false, 
        false
    ]);
    const [optionCost, setOptionCost] = useState(0.0);
    const [selectedMods, setSelectedMods] = useState([]);
    const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
    const [savedState, setSavedState] = useState({ quantity: props.initialQuantity, selectedMods:[] });

    useEffect(() => {
        setQuantity(props.initialQuantity);
    },[props.initialQuantity])

    const updateQuantity = newQuantity => {
        const { maxQuantity, showingExtra, freeQuantityLimit, quantityTotal, initialQuantity, activeScheme } = props;
        const currentQuantity = quantity;

        // if: decrementing, then: just check if above 0
        if (newQuantity < currentQuantity)
            newQuantity = Math.max(0, newQuantity);
        
        else if (newQuantity > (initialQuantity + maxQuantity) ) {
            newQuantity = currentQuantity;
        }
            
        
        else if (!showingExtra)
            if (activeScheme === TRADITIONAL_PLAN_NAME) 
                newQuantity = Math.min(newQuantity, freeQuantityLimit);
            else    
                newQuantity = Math.min(newQuantity, maxQuantity);

        setQuantity(newQuantity);
        setHasBeenUpdated(true);
    }

    const calculateItemTotal = () => {
        return formatter.format(Math.max(0, (quantity  - freeQuantityLimit)) * price);
    }

    const dishCardClear = className => {
        var elems = document.querySelectorAll(className);
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
            elems[index].style.opacity = 1;
        }
    }

    const updateIsCardActive = cardActive => {
        if (!isCardActive)
            props.setCardStatus(" disabled");

        setIsCardActive(cardActive);
        setConfirmed(!cardActive);
        
        // resets quantity for Flex plan adds
        if (activeScheme === FLEXIBLE_PLAN_NAME)
            setQuantity(cardActive ? 0 : initialQuantity);
    }

    const handleConfirm = () => {
        logToConsole("confirming...");
        props.setCardStatus("");
        const {choice, handleSelected, activeScheme} = props;

        savedState.quantity = quantity;
        savedState.selectedMods = [...selectedMods];
        
        setConfirmed(quantity > 0);
        updateIsCardActive(false);
        setIsModModalShowing(false);
        updateQuantity(activeScheme === TRADITIONAL_PLAN_NAME ? quantity : 0);
        setSelectedMods(activeScheme === TRADITIONAL_PLAN_NAME ? selectedMods : []);
        setSavedState(savedState);

        handleSelected({choice: choice, quantity: quantity, selectedMods: selectedMods});

        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});

        dishCardClear('.dish-card-blur');
        dishCardClear('.step-active .order_prop__subheading');
        dishCardClear('.step-active .order_prop__heading');
        
    }

    const handleCancel = () => {
        const { initialQuantity, setCardStatus } = props;
        setCardStatus("");
        updateQuantity(initialQuantity);
        updateIsCardActive(false);
        setConfirmed(initialQuantity > 0);
        setIsCardActive(false);
        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});
    }

    const handleCustomize = () => {
        toggleModal();
    }

    const toggleModal = () => {
        setIsModModalShowing(!isModModalShowing);
    }

    const handleOptionChoice = mod => {
        if (isModSelected(mod.id)) {
            const modIndex = findModIndex(mod.id);
            let newSelectedMods = selectedMods;
            newSelectedMods.splice(modIndex, 1);
            setSelectedMods([...newSelectedMods]);
        }
        else
            setSelectedMods([...selectedMods, mod]);

        setHasBeenUpdated(true);
    }

    const prepModSubTitles = title => {
        const formattedTitle = title.toLowerCase();
        if (formattedTitle.includes("(sub) "))
            return title.substring(6);
        else if (formattedTitle.includes("(mod) "))
            return title.substring(6);
        else
            return title;
    }

    const isModSelected = modId => {
        return findModIndex(modId) !== -1;
    }

    const findModIndex = modId => {
        let retval = -1;
        selectedMods.map((mod, index) => {
            if (mod.id === modId)
                retval = index;
        });

        return retval;
    }

    const calcuculateModTotalCost = () => {
        let totalCost = 0.0;
        selectedMods.map(mod => {
            totalCost += parseFloat(mod.priceRange.maxVariantPrice.amount * quantity);
        });

        return totalCost;
    }

    const handleChangePlan = () => {
        setIsModModalShowing(false);
        setIsCardActive(false);
        props.handleChangePlan();
    }

    const getCurrentState = () => {
        return {
            quantity: quantity,
            selectedMods: selectedMods
        };
    }

        const {choice, freeQuantityLimit, handleChange, servingCount, maxQuantity, showingExtra, forceDisable, forceHidePrice, activeScheme, initialQuantity, cardStatus} = props;
        const {title, description, price, attributes, imageURL, productOptions, modifications, substitutions, contains} = choice;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const modifiersSection = modifications === null ? null : modifications.map((mod, index) => {
            return <Checkbox key={index} label={`${prepModSubTitles(mod.title)}`} price={`${parseFloat(mod.priceRange.maxVariantPrice.amount) > 0.0 ? formatter.format(mod.priceRange.maxVariantPrice.amount) : ''}`} checked={isModSelected(mod.id)} handleClick={() => handleOptionChoice(mod, index)}/>;
        });

        const substitutionSection = substitutions === null ? null : substitutions.map((sub, index) => {
            logToConsole(`sub: ${sub}, sub.maxVariantPrice: ${sub.maxVariantPrice}`)
            return <Checkbox key={index} label={prepModSubTitles(sub.title)} price={`${parseFloat(sub.priceRange.maxVariantPrice.amount) > 0.0 ? formatter.format(sub.priceRange.maxVariantPrice.amount) : ''}`} checked={isModSelected(sub.id)} handleClick={() => handleOptionChoice(sub, index)}/>;
        });

        let attributesDisplay = '';
        
        attributesDisplay = attributes.join(" ??? ");

        const peoplePlural = servingCount > 1 ? 'people' : 'person';
        const disclaimerText =  isCardActive ? `*Each added dish serves ${servingCount} ${peoplePlural}` : `Serves ${servingCount} ${peoplePlural}`;

        const optionCostText = optionCost > 0 ? `+${formatter.format(optionCost)} customizations` : null;

        const finalCardStatus = forceDisable ? " disabled" : cardStatus;

        const disableConfirm = () => {
            const currentState = getCurrentState();
            if (activeScheme === FLEXIBLE_PLAN_NAME && quantity < 1)
                return true;
            else if (JSON.stringify(savedState) === JSON.stringify(currentState))
                return true;
            else if (currentState.quantity === 0 && savedState.quantity === 0)
                return true;
            else
                return false;
        }

    return (
        <div className={`dish-card${isCardActive ? ' active' : (finalCardStatus)}${confirmed ? ' confirmed' : ''}`}>
            {!isCardActive && (initialQuantity + quantity > 0) && <p className={`card__quantity-badge${quantity > 9 ? ' double-digit' : ''}`}>{quantity}</p>}

            {isCardActive && !confirmed &&
            <div>
                <div className="card__overlay"></div>
                <div className="card__quantity-wrapper">
                    <img className='btn-close-dish-card-active' src={iconCloseBtn} width="24" onClick={() => handleCancel()}/>
                    <div className="card__quantity-inner-container">
                        <h2 className="card__quantity-title">{title}</h2>
                        {contains?.length > 0 && <p className='card__quantity-contains'><strong>Contains:</strong> peanut, sesame, cashew, seafood  </p>} 
                        <p className='card__quantity-serving'><strong>Serves:</strong> {servingCount} {servingCount > 1 ? 'people' : 'person'}</p>
                        {attributes.length > 0 && <p className="card__code"><strong>Preferences: </strong>{attributesDisplay}</p>}
                    </div>

                    <div className="card__quantity-field-wrapper">
                        <section className="card__quantity-section">
                            <img className={`card__quantity-img minus${quantity < 1 ? ' disabled' : ''}`} src={quantityMinus} onClick={() => updateQuantity(quantity-1)}/>
                            <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                            <img className="card__quantity-img plus" src={quantityPlus} onClick={() => updateQuantity(quantity+1)}/>
                        </section>

                        <section className="card__actions">
                            <button className="btn btn-primary-small btn-counter-confirm" disabled={disableConfirm()} onClick={() => handleConfirm()}>{activeScheme === TRADITIONAL_PLAN_NAME ? 'Confirm' : 'Add'}</button>
                            <button className={`ha-a btn-counter-customize ${ substitutions.length + modifications.length > 0 ? 'enabled' : 'disabled' }`} onClick={() => handleCustomize()}>Customize</button>
                        </section>
                        <section className="card__actions cancel">
                            <button className="ha-a btn-counter-customize cancel enabled" onClick={() => handleCancel()}>Cancel</button>
                        </section>     
                    </div>
                </div>
                </div>
            }
                
                <div>
                    <img className="dish-image" src={imageURL} onClick={() => updateIsCardActive(true)}/>
                    { showingExtra && !forceHidePrice && <span className='dishcard-extra-cost'>{formatter.format(choice.price)}</span> }
                </div>

                <section className="card__info-section ha-color-bg-cream-shadow">
                    <div onClick={() => updateIsCardActive(true)}>
                        <div className='cart-text-elements'>
                            <h2>{title}</h2>
                            <p className='dish-description'>{description}</p>
                        </div>
                        <div className='cart-meta-elements'>
                            <p className="card__code">{attributesDisplay}</p>
                            <p className="card__servings-disclaimer">{disclaimerText}</p>
                        </div>
                        
                    </div>

                    <Modal
                        isOpen={isModModalShowing}
                        onRequestClose={() => toggleModal()}
                        className="modal--flexible-confirmaton"
                    >
                        <div className="card__quantity-wrapper wrapper-modal">
                            <div className="card__quantity-inner-wrapper">
                                <div className="card__quantity-inner-container">
                                    <h2 className="card__quantity-title">{title}</h2>
                                    {/* start placeholder */}
                                    <p className='card__quantity-subtitle'>{description}</p>
                                    <br></br>
                                    { contains?.length > 0 && <p className='card__quantity-contains'><strong>Contains:</strong> {contains}</p> }
                                    <p className='card__quantity-serving'><strong>Serves:</strong> {servingCount} {servingCount > 1 ? 'people' : 'person'}</p>
                                    {/* end placeholder */}
                                    {attributes.length > 0 && <p className="card__code"><strong>Preferences: </strong>{attributesDisplay}</p>}
                                </div>

                                <div className="card__quantity-field-wrapper">
                                    <section className="card__quantity-section">
                                        <img className={`card__quantity-img minus${quantity < 1 ? ' disabled' : ''}`} src={quantityMinus} onClick={() => updateQuantity(quantity-1)}/>
                                        <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                                        <img className="card__quantity-img plus" src={quantityPlus} onClick={() => updateQuantity(quantity+1)}/>
                                    </section>
                                </div>
                                <img className='btn-close-dish-card-modal' src={iconCloseBtn} width="24" onClick={() => toggleModal()}/>
                            </div>

                            <div className='modal--flexible-inner'>
                                { activeScheme === TRADITIONAL_PLAN_NAME && 
                                    <p>*Customizations will be applied to all portions of this dish. For more individualized customizations, please check out our <span className='underline clickable' onClick={() => handleChangePlan()}>Flex option</span>.</p>
                                }


                                { activeScheme === FLEXIBLE_PLAN_NAME && 
                                    <p>*Customizations will not be applied to portions already in the cart. For customizations across all portions, please check out our <span className='underline clickable' onClick={() => handleChangePlan()}>Classic option</span>.</p>
                                }

                            {substitutions?.length > 0 && <div className="modal--flexible-container">
                                <h4 className='modal--flexible-heading'>Substitutions</h4>
                                <div className="modal--flexible-checkbox-wrapper">
                                    {substitutionSection}
                                </div>
                            </div>}

                            {modifications?.length > 0 && <div className="modal--flexible-container">
                                <h4 className='modal--flexible-heading'>Customizations</h4>
                                <div className="modal--flexible-checkbox-wrapper">
                                    {modifiersSection}
                                </div>
                            </div>}

                            <section className="card__actions">
                                <button className="btn btn-primary-small btn-counter-confirm" disabled={disableConfirm()} onClick={() => handleConfirm()}>{activeScheme === TRADITIONAL_PLAN_NAME ? 'Confirm' : 'Add'}</button>
                                <p className='modal--flexible-price'>+{formatter.format(calcuculateModTotalCost())} Customizations</p>
                            </section>    
                        </div>
                        </div>
                        
                    </Modal>
                    
                </section>

                
            </div>
        )
    }

