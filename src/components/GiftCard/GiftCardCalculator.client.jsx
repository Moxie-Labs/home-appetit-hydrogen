import React, {useCallback, useState, useRef } from 'react';
import { useCart } from '@shopify/hydrogen';
import Modal from 'react-modal/lib/components/Modal';

const PREMIUM_ZIPCODES = [];
const PREMIUM_RATE = 50;
const REGULAR_RATE = 50;

export function GiftCardCalculator(props) {

    const [activeCalculator, setActiveCalculator] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [numberOfWeeks, setNumberOfWeeks] = useState("");
    const [zipcode, setZipcode] = useState("");

    const node = useRef(null);


    const { id: cartId, cartCreate, checkoutUrl, status: cartStatus, linesAdd, linesRemove, lines: cartLines, cartAttributesUpdate, buyerIdentityUpdate } = useCart();

    const handleFocus = useCallback(() => {
        if (node.current == null) {
        return;
        }
        node.current.input.select();
        document.execCommand("copy");
    }, []);

    const toggleModal = useCallback(() => {
        setActiveCalculator(true)
    }, []);

    const dismissModals = () => {
        setActiveCalculator(false);
    };

    const isFormReady = () => {
        return (numberOfPeople.length > 0 && numberOfWeeks.length > 0 && zipcode.length === 5);
    }

    const calculateSuggestedAmount = () => {
        return ((getZipcodeRate() * numberOfPeople) + getZipcodeRate()) * numberOfWeeks;
    }

    const getZipcodeRate = () => {
        if (PREMIUM_ZIPCODES.includes(zipcode)) {
            return PREMIUM_RATE;
        }
        else {
            return REGULAR_RATE;
        }
    }

    const onAddGift = () => {

        console.log("On Add Gift")

        let cardProductIndex;
        if (calculateSuggestedAmount() < 125) {
            cardProductIndex = 0;
        } else if (calculateSuggestedAmount() < 224) {
            cardProductIndex = 1;
        } else if (calculateSuggestedAmount() < 324) {
            cardProductIndex = 2;
        } else if (calculateSuggestedAmount() < 424) {
            cardProductIndex = 3;
        } else {
            cardProductIndex = 5;
        }

        const cardVariantIndex = (calculateSuggestedAmount() - 25 - (cardProductIndex * 100));

        const cardProduct = giftCards[cardProductIndex];
        const variant = cardProduct.variants.edges[cardVariantIndex].node;
        
        linesAdd({
            merchandiseId: variant.id,
            quantity: 1
        });


        dismissModals();

    }

    const onCheckout = () => {
        window.location.href = checkoutUrl;
    }

    const activator = <button onClick={toggleModal} value={'Open Calculator'}>Open Calculator</button>;

    const suggestedAmountText = isFormReady() ? `$${calculateSuggestedAmount()}` : "Enter fields for suggested amount";

    const addButtonText = isFormReady() ? `Purchase $${calculateSuggestedAmount()}` : "Purchase";

    const { giftCards } = props;

    return (
        <section>
            {activator}
            <Modal
                activator={activator}
                isOpen={activeCalculator}
                onRequestClose={dismissModals}
                className="modal--gift-card"
                >
                    <h1 className='title'>Calculate Gift Amount</h1>

                    <div className='calculator-wrapper'>
                        <div className='calculator-field'>
                            <label># of People:</label>
                            <input type='number' placeholder='Enter amount' value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} min={1} max={5}/>
                        </div>
                        <div className='calculator-field'>
                            <label># of Weeks:</label>
                            <input type='number' placeholder='Enter amount' value={numberOfWeeks} onChange={(e) => setNumberOfWeeks(e.target.value)} min={1} max={8}/>
                        </div>
                        <div className='calculator-field'>
                            <label>ZIP Code:</label>
                            <input type='number' placeholder='Enter ZIP' value={zipcode} onChange={(e) => setZipcode(e.target.value)} maxLength={5} min={0} max={99999}/>
                        </div>
                    </div>

                    <p className='gift-card-calculator--amount text-center'>{suggestedAmountText}</p>

                    <div className="text-center gift-card-control">
                        <button className={`btn btn-primary-small btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={!isFormReady} onClick={() => onAddGift()}>
                            {addButtonText} 
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                    </div>

                </Modal>

                { cartLines.length > 0 && <button className={`btn btn-secondary btn-modal`} onClick={() => onCheckout()}>
                    Checkout
                </button>}

        </section>        
    );
}