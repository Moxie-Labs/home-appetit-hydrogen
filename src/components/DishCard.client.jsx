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
            isModalShowing: false,
            quantity: props.initialQuantity,
            selected: ['hidden'],
            confirmed: props.confirmed,
            checkedOptions: [
                false, 
                false, 
                false, 
                false
            ],
            optionCost: 0.0
        }

        this.calculateItemTotal = this.calculateItemTotal.bind(this);
        this.setQuantity = this.setQuantity.bind(this);
        this.setIsCardActive = this.setIsCardActive.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCustomize = this.handleCustomize.bind(this);
        this.handleSelected = this.props.handleSelected.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleOptionChoice = this.handleOptionChoice.bind(this);
    }

    setQuantity(quantity) {
        const {maxQuantity, showingExtra} = this.props;
        if (!showingExtra) {
            quantity = Math.max(0, quantity);
            quantity = Math.min(quantity, maxQuantity)                
        }

        this.setState({
            quantity: quantity
        });
    }

    calculateItemTotal() {
        return formatter.format(Math.max(0, (quantity  - freeQuantityLimit)) * price);
    }

    // dishCardBlur(className) {
    //     var elems = document.querySelectorAll(className);
    //     var index = 0, length = elems.length;
    //     for ( ; index < length; index++) {
    //         elems[index].style.transition = "opacity 0.1s linear 0s";
    //         elems[index].style.opacity = 0.5;
    //     }
    // }

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

        // this.dishCardBlur('.dish-card-blur');
        // this.dishCardBlur('.order_prop__subheading');
        // this.dishCardBlur('.order_prop__heading');
    }

    handleConfirm() {
        console.log("confirming...");
        const {choice, handleSelected} = this.props;
        const {quantity} = this.state;
        this.setState({
            confirmed: quantity > 0,
            isCardActive: false
        });

        handleSelected({choice: choice, quantity: quantity});

        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});

        this.dishCardClear('.dish-card-blur');
        this.dishCardClear('.step-active .order_prop__subheading');
        this.dishCardClear('.step-active .order_prop__heading');
        
    }

    handleCustomize() {
        this.handleConfirm();
        this.toggleModal();
    }

    toggleModal() {
        const {isModalShowing} = this.state;
        this.setState({isModalShowing: !isModalShowing});
    }

    handleOptionChoice(option, index) {
        
        const {checkedOptions, optionCost} = this.state;
        let newCheckedOptions = [...checkedOptions];
        let newOptionCost = optionCost;
        newCheckedOptions[index] = !checkedOptions[index];
        if (newCheckedOptions[index] === true) 
            newOptionCost += option.cost;
        else
            newOptionCost -= option.cost;

            console.log("optionCost", option.cost)
        this.setState({
            checkedOptions: newCheckedOptions,
            optionCost: newOptionCost
        })
    }

    render() {
        const {choice, freeQuantityLimit, handleChange, servingCount, maxQuantity, showingExtra, forceDisable} = this.props;
        const {selected, quantity, isCardActive, confirmed, isModalShowing, checkedOptions, optionCost} = this.state;
        const {title, description, price, attributes, imageURL, productOptions} = choice;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const optionsSection = (productOptions === null) ? null : productOptions.map((option, index) => {
            const optionIndex = index;
            const productOption = option;
            return <Checkbox key={index} label={option.name} checked={checkedOptions[index]} onChange={() => this.handleOptionChoice(productOption, optionIndex)}/>;
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
                        <button className="ha-a btn-counter-customize" onClick={() => this.handleCustomize()}>Customize</button>
                    </section>    
                </div>
            </div>
        }
            
            <div>
                <img className="dish-image" src={imageURL} onClick={() => this.setIsCardActive(true)}/>
                { showingExtra && <span className='dishcard-extra-cost'>$12.50</span> }
            </div>

            <section className="card__info-section ha-color-bg-cream-shadow">
                <div onClick={() => this.setIsCardActive(true)}>
                    <h2>{title}</h2>
                    <p className='dish-description'>{description}</p>
                    <p className="card__code">{attributesDisplay}</p>
                    <p className="card__servings-disclaimer">{disclaimerText}</p>
                </div>
                            
                <Modal
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
                </Modal>
                
            </section>

            
        </div>
    )
    }

}