import React from 'react';
import quantityPlus from "../assets/quantity-plus.png";
import quantityMinus from "../assets/quantity-minus.png";
import { Checkbox } from './Checkbox.client';
import Modal from 'react-modal/lib/components/Modal';

export default class DishCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCardActive: false,
            isModModalShowing: false,
            quantity: props.initialQuantity,
            selected: ['hidden'],
            confirmed: props.confirmed,
            checkedOptions: [
                false, 
                false, 
                false, 
                false
            ],
            optionCost: 0.0,
            selectedMods: []
        }

        this.calculateItemTotal = this.calculateItemTotal.bind(this);
        this.setQuantity = this.setQuantity.bind(this);
        this.setIsCardActive = this.setIsCardActive.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCustomize = this.handleCustomize.bind(this);
        this.handleSelected = this.props.handleSelected.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleOptionChoice = this.handleOptionChoice.bind(this);
        this.handleMod = this.props.handleMod.bind(this);
    }

    setQuantity(quantity) {
        const { maxQuantity, showingExtra, freeQuantityLimit, quantityTotal, initialQuantity } = this.props;
        const { quantity:currentQuantity } = this.state;

        // if: decrementing, then: just check if above 0
        if (quantity < currentQuantity)
            quantity = Math.max(0, quantity);
        
        else if (quantity > (initialQuantity + maxQuantity) ) {
            quantity = currentQuantity;
        }
            
        
        else
            if (!showingExtra)
                quantity = Math.min(quantity, freeQuantityLimit);

        this.setState({
            quantity: quantity
        });
    }

    calculateItemTotal() {
        return formatter.format(Math.max(0, (quantity  - freeQuantityLimit)) * price);
    }

    dishCardClear(className) {
        var elems = document.querySelectorAll(className);
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
            elems[index].style.opacity = 1;
        }
    }

    setIsCardActive(isCardActive) {
        console.log("activating");
        if (!this.isCardActive) {
            this.setState({
                isCardActive: true,
                confirmed: false
            });
        }
    }

    handleConfirm() {
        console.log("confirming...");
        const {choice, handleSelected} = this.props;
        const {quantity, selectedMods} = this.state;
        this.setState({
            confirmed: quantity > 0,
            isCardActive: false,
            isModModalShowing: false
        });

        handleSelected({choice: choice, quantity: quantity, selectedMods: selectedMods});

        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});

        this.dishCardClear('.dish-card-blur');
        this.dishCardClear('.step-active .order_prop__subheading');
        this.dishCardClear('.step-active .order_prop__heading');
        
    }

    handleCustomize() {
        // this.handleConfirm();
        this.toggleModal();
    }

    toggleModal() {
        const {isModModalShowing} = this.state;
        this.setState({isModModalShowing: !isModModalShowing});
    }

    handleOptionChoice(mod) {

        const { selectedMods } = this.state;
        if (this.isModSelected(mod.id)) {
            const modIndex = this.findModIndex(mod.id);
            let newSelectedMods = selectedMods;
            newSelectedMods.splice(modIndex, 1);
            this.setState({selectedMods: [...newSelectedMods]})
        }
        else
            this.setState({selectedMods: [...selectedMods, mod]});
    }

    prepModSubTitles(title) {
        if (title.includes("(Sub) "))
            return title.split("(Sub) ")[1];
        else if (title.includes("(Mod) "))
            return title.split("(Mod) ")[1];
        else
            return title;
    }

    isModSelected(modId) {
        return this.findModIndex(modId) !== -1;
    }

    findModIndex(modId) {
        const { selectedMods } = this.state;

        let retval = -1;
        selectedMods.map((mod, index) => {
            if (mod.id === modId)
                retval = index;
        });

        return retval;
    }

    calcuculateModTotalCost() {
        const { selectedMods, quantity } = this.state;
        let totalCost = 0.0;
        selectedMods.map(mod => {
            // TODO: support cost when on Flex plan
            totalCost += parseFloat(mod.priceRange.maxVariantPrice.amount * quantity);
        });

        return totalCost;
    }

    render() {
        const {choice, freeQuantityLimit, handleChange, servingCount, maxQuantity, showingExtra, forceDisable, forceHidePrice} = this.props;
        const {selected, quantity, isCardActive, confirmed, isModModalShowing, checkedOptions, optionCost, selectedMods} = this.state;
        const {title, description, price, attributes, imageURL, productOptions, modifications, substitutions} = choice;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const modifiersSection = modifications === null ? null : modifications.map((mod, index) => {
            return <Checkbox key={index} label={`${this.prepModSubTitles(mod.title)} (${mod.priceRange.maxVariantPrice.amount > 0.0 ? formatter.format(mod.priceRange.maxVariantPrice.amount) : ''})`} checked={this.isModSelected(mod.id)} onChange={() => this.handleOptionChoice(mod, index)}/>;
        });

        const substitutionSection = substitutions === null ? null : substitutions.map((sub, index) => {
            console.log(`sub: ${sub}, sub.maxVariantPrice: ${sub.maxVariantPrice}`)
            return <Checkbox key={index} label={`${this.prepModSubTitles(sub.title)} (${sub.priceRange.maxVariantPrice.amount > 0.0 ? formatter.format(sub.priceRange.maxVariantPrice.amount) : ''})`} checked={this.isModSelected(sub.id)} onChange={() => this.handleOptionChoice(sub, index)}/>;
        });

        let attributesDisplay = '';
        
        attributes.forEach(attr => {
            attributesDisplay += `[${attr}]  `;
        });

        const peoplePlural = servingCount > 1 ? 'people' : 'person';
        const disclaimerText =  isCardActive ? `*Each added dish serves ${servingCount} ${peoplePlural}` : `Serves ${servingCount} ${peoplePlural}`;

        const optionCostText = optionCost > 0 ? `+${formatter.format(optionCost)} customizations` : null;

    

    return (
        <div className={`dish-card${isCardActive ? ' active ' : ' '}${confirmed ? ' confirmed' : ''} ${forceDisable ? 'disabled' : ''}`}>
            {!isCardActive && confirmed && 
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
                        <img className="card__quantity-img minus" src={quantityMinus} onClick={() => this.setQuantity(quantity-1)}/>
                        <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                        <img className="card__quantity-img plus" src={quantityPlus} onClick={() => this.setQuantity(quantity+1)}/>
                    </section>

                    <section className="card__actions">
                        <button className="btn btn-primary-small btn-counter-confirm" onClick={() => this.handleConfirm()}>Confirm</button>
                        <button className={`ha-a btn-counter-customize ${ substitutions.length + modifications.length > 0 ? 'enabled' : 'disabled' }`} onClick={() => this.handleCustomize()}>Customize</button>
                    </section>    
                </div>
            </div>
        }
            
            <div>
                <img className="dish-image" src={imageURL} onClick={() => this.setIsCardActive(true)}/>
                { showingExtra && !forceHidePrice && <span className='dishcard-extra-cost'>{formatter.format(choice.price)}</span> }
            </div>

            <section className="card__info-section ha-color-bg-cream-shadow">
                <div onClick={() => this.setIsCardActive(true)}>
                    <h2>{title}</h2>
                    <p className='dish-description'>{description}</p>
                    <p className="card__code">{attributesDisplay}</p>
                    <p className="card__servings-disclaimer">{disclaimerText}</p>
                </div>

                <Modal
                    isOpen={isModModalShowing}
                    onClose={this.toggleModModal}
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
                                    <img className="card__quantity-img minus" src={quantityMinus} onClick={() => this.setQuantity(quantity-1)}/>
                                    <span className={`card__quantity-count${quantity < 1 ? ' zero' : ''}`}>{quantity}</span>
                                    <img className="card__quantity-img plus" src={quantityPlus} onClick={() => this.setQuantity(quantity+1)}/>
                                </section>
                            </div>
                        </div>

                        <div className='modal--flexible-inner'>
                            <p>*Customizations will be applied to all portions of this dish. For more individualized customizations, please check out our Flex option.</p>

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
                            <button className="btn btn-primary-small btn-counter-confirm" onClick={() => this.handleConfirm()}>Confirm</button>
                            <p className='modal--flexible-price'><strong>+{formatter.format(this.calcuculateModTotalCost())}</strong> Customizations</p>
                        </section>    
                    </div>
                    </div>
                    
                </Modal>
                            
                {/* <Modal
                    isOpen={isModalShowing}
                    onClose={this.toggleModal}
                    className="modal--flexible-confirmaton"
                >
                    <div className='modal--flexible-inner'>
                        <h2 className='ha-h4'>Change order type?</h2>
                        <h4 className='subheading'>Quis eu rhoncus, vulputate cursus esdun.</h4>
                        <p className='ha-body'>Esit est velit lore varius vel, ornare id aliquet sit. Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam es. Digs nissim sit est velit lore varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam each.</p>
                        <section className="card__actions">
                            <button className="btn btn-primary-small btn-counter-confirm">Switch to flex plan</button>
                            <button className="btn ha-a btn-modal-cancel">Cancel</button>
                        </section>   
                    </div>
                </Modal> */}
                
            </section>

            
        </div>
    )
    }

}