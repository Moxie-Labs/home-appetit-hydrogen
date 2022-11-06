import React, { useEffect, useState } from 'react';
import quantityPlus from "../assets/quantity-plus.png";
import quantityMinus from "../assets/quantity-minus.png";
import { Checkbox } from './Checkbox.client';
import Modal from 'react-modal/lib/components/Modal';
import { FLEXIBLE_PLAN_NAME, TRADITIONAL_PLAN_NAME } from '../lib/const';

export default function DishCardFunc(props) {

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

    useEffect(() => {
        setQuantity(props.initialQuantity);
    },[props.initialQuantity])

    const updateQuantity = quantity => {
        const { maxQuantity, showingExtra, freeQuantityLimit, quantityTotal, initialQuantity } = props;
        const currentQuantity = quantity;

        // if: decrementing, then: just check if above 0
        if (quantity < currentQuantity)
            quantity = Math.max(0, quantity);
        
        else if (quantity > (initialQuantity + maxQuantity) ) {
            quantity = currentQuantity;
        }
            
        
        else
            if (!showingExtra)
                quantity = Math.min(quantity, freeQuantityLimit);

        setQuantity(quantity);
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
        setIsCardActive(cardActive);
        setConfirmed(!cardActive);

        // resets quantity for Flex plan adds
        if (activeScheme === FLEXIBLE_PLAN_NAME)
            setQuantity(cardActive ? 0 : initialQuantity);
    }

    const handleConfirm = () => {
        console.log("confirming...");
        const {choice, handleSelected, activeScheme} = props;
        
        setConfirmed(quantity > 0),
        updateIsCardActive(false),
        setIsModModalShowing(false),
        updateQuantity(activeScheme === 'traditional' ? quantity : 0),
        setSelectedMods(activeScheme === 'traditional' ? selectedMods : []);

        handleSelected({choice: choice, quantity: quantity, selectedMods: selectedMods});

        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});

        dishCardClear('.dish-card-blur');
        dishCardClear('.step-active .order_prop__subheading');
        dishCardClear('.step-active .order_prop__heading');
        
    }

    const handleCancel = () => {
        const { initialQuantity } = props;
        updateQuantity(initialQuantity);
        updateIsCardActive(false);
        setConfirmed(initialQuantity > 0)
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
        props.handleChangePlan();
    }

        const {choice, freeQuantityLimit, handleChange, servingCount, maxQuantity, showingExtra, forceDisable, forceHidePrice, activeScheme, initialQuantity} = props;
        const {title, description, price, attributes, imageURL, productOptions, modifications, substitutions} = choice;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const modifiersSection = modifications === null ? null : modifications.map((mod, index) => {
            return <Checkbox key={index} label={`${prepModSubTitles(mod.title)} ${mod.priceRange.maxVariantPrice.amount > 0.0 ? formatter.format(mod.priceRange.maxVariantPrice.amount) : ''}`} checked={isModSelected(mod.id)} onChange={() => handleOptionChoice(mod, index)}/>;
        });

        const substitutionSection = substitutions === null ? null : substitutions.map((sub, index) => {
            console.log(`sub: ${sub}, sub.maxVariantPrice: ${sub.maxVariantPrice}`)
            return <Checkbox key={index} label={prepModSubTitles(sub.title)} price={`${sub.priceRange.maxVariantPrice.amount > 0.0 ? formatter.format(sub.priceRange.maxVariantPrice.amount) : ''}`} checked={isModSelected(sub.id)} onChange={() => handleOptionChoice(sub, index)}/>;
        });

        let attributesDisplay = '';
        
        attributes.forEach(attr => {
            attributesDisplay += `[${attr}]  `;
        });

        const peoplePlural = servingCount > 1 ? 'people' : 'person';
        const disclaimerText =  isCardActive ? `*Each added dish serves ${servingCount} ${peoplePlural}` : `Serves ${servingCount} ${peoplePlural}`;

        const optionCostText = optionCost > 0 ? `+${formatter.format(optionCost)} customizations` : null;

    

    return (
        <div className={`dish-card${isCardActive ? ' active' :''}${confirmed ? ' confirmed' : ''} ${forceDisable ? 'disabled' : ''}`}>
            {!isCardActive && confirmed && (initialQuantity + quantity > 0) &&
                <p className="card__quantity-badge">{quantity}</p>
            }

            {isCardActive && !confirmed &&
                <div className="card__quantity-wrapper">
                    <div className="card__quantity-inner-container">
                        <h2 className="card__quantity-title">{title}</h2>
                        {/* start placeholder */}
                        <p className='card__quantity-contains'><strong>Contains:</strong> peanut, sesame, cashew, seafood  </p>
                        <p className='card__quantity-serving'><strong>Serves:</strong> 3 people </p>
                        {/* end placeholder */}
                        <p className="card__code"><strong>Preferences: </strong>{attributesDisplay}</p>
                    </div>

                    <div className="card__quantity-field-wrapper">
                        <section className="card__quantity-section">
                            <img className="card__quantity-img minus" src={quantityMinus} onClick={() => updateQuantity(quantity-1)}/>
                            <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                            <img className="card__quantity-img plus" src={quantityPlus} onClick={() => updateQuantity(quantity+1)}/>
                        </section>

                        <section className="card__actions">
                            <button className="btn btn-primary-small btn-counter-confirm" onClick={() => handleConfirm()}>Confirm</button>
                            <button className={`ha-a btn-counter-customize ${ substitutions.length + modifications.length > 0 ? 'enabled' : 'disabled' }`} onClick={() => handleCustomize()}>Customize</button>
                        </section>
                        <section className="card__actions">
                            <button className="ha-a btn-counter-customize enabled" onClick={() => handleCancel()}>Cancel</button>
                        </section>     
                    </div>
                </div>
            }
                
                <div>
                    <img className="dish-image" src={imageURL} onClick={() => updateIsCardActive(true)}/>
                    { showingExtra && !forceHidePrice && <span className='dishcard-extra-cost'>{formatter.format(choice.price)}</span> }
                </div>

                <section className="card__info-section ha-color-bg-cream-shadow">
                    <div onClick={() => updateIsCardActive(true)}>
                        <h2>{title}</h2>
                        <p className='dish-description'>{description}</p>
                        <p className="card__code">{attributesDisplay}</p>
                        <p className="card__servings-disclaimer">{disclaimerText}</p>
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
                                    <p className='card__quantity-subtitle'>urna fermentum, sed id dolor ac donec egestas ut sted es</p>
                                    <br></br>
                                    <p className='card__quantity-contains'><strong>Contains:</strong> peanut, sesame, cashew, seafood  </p>
                                    <p className='card__quantity-serving'><strong>Serves:</strong> 3 people </p>
                                    {/* end placeholder */}
                                    <p className="card__code"><strong>Preferences: </strong>{attributesDisplay}</p>
                                </div>

                                <div className="card__quantity-field-wrapper">
                                    <section className="card__quantity-section">
                                        <img className="card__quantity-img minus" src={quantityMinus} onClick={() => updateQuantity(quantity-1)}/>
                                        <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                                        <img className="card__quantity-img plus" src={quantityPlus} onClick={() => updateQuantity(quantity+1)}/>
                                    </section>
                                </div>
                            </div>

                            <div className='modal--flexible-inner'>
                                { activeScheme === 'traditional' && 
                                    <p>*Customizations will be applied to all portions of this dish. For more individualized customizations, please check out our <span className='underline clickable' onClick={() => handleChangePlan()}>Flex</span> option.</p>
                                }


                                { activeScheme === 'flexible' && 
                                    <p>*Customizations will not be applied to portions already in the cart. For customizations across all portions, please check out our <span className='underline clickable' onClick={() => handleChangePlan()}>Traditional</span> option.</p>
                                }

                            <div className="modal--flexible-container">
                                <h4 className='modal--flexible-heading'>Substitutions</h4>
                                <div className="modal--flexible-checkbox-wrapper">
                                    {substitutionSection}
                                </div>
                            </div>

                            <div className="modal--flexible-container">
                            <h4 className='modal--flexible-heading'>Customizations</h4>
                            <div className="modal--flexible-checkbox-wrapper">
                                {modifiersSection}
                            </div>
                            </div>

                            <section className="card__actions">
                                <button className="btn btn-primary-small btn-counter-confirm" onClick={() => handleConfirm()}>Confirm</button>
                                <p className='modal--flexible-price'><strong>+{formatter.format(calcuculateModTotalCost())}</strong> Customizations</p>
                            </section>    
                        </div>
                        </div>
                        
                    </Modal>
                    
                </section>

                
            </div>
        )
    }

