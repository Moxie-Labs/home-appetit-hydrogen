import React, {useCallback, useState, useRef } from 'react';
import { useCart } from '@shopify/hydrogen';
import Modal from 'react-modal/lib/components/Modal';
import { Page } from '../Page.client';
import { Header } from '../Header.client';
import { Footer } from '../Footer.client';
import gcImg from "../../assets/giftcard-img.png";


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

    const activator = <a href="#" className='ha-a' onClick={toggleModal}>use our gift card calculator</a>;

    const suggestedAmountText = isFormReady() ? `$${calculateSuggestedAmount()}` : "Enter fields for suggested amount";

    const addButtonText = isFormReady() ? `Purchase $${calculateSuggestedAmount()}` : "Purchase";

    const { giftCards } = props;

    const servingOptions = [
        { label: '1 Person', value: 1 },
        { label: '2 People', value: 2 },
        { label: '3 People', value: 3 },
        { label: '4 People', value: 4 },
        { label: '5 People', value: 5 }
    ];

    return (
        <Page>
            <Header />
            <div className="gc-wrapper">
                <div className="gc-item-column">
                    <img src={gcImg} />
                </div>
                <div className="gc-item-column form-column">
                    <h2 className='ha-h2 no-margin no-padding'>Home Appétit Gift Card</h2>
                    <p className='gc-subtitle ha-body'>Purchase a gift card for any amount or use our calculator below to determine the ideal gift. Note: All gift cards are digit</p>
                    <div className="gc-row">
                        <div className="gc-col">
                            <div className="gc-col-item">
                                <label htmlFor="gc-amount">Gift card amount:</label>
                                <input type="text" />
                            </div>
                            <div className="gc-col-item">
                                {activator}
                            </div>
                        </div>
                    </div>
                    <div className="gc-row">
                        
                        <div className="gc-col-item">
                            <form action="">
                            <label htmlFor="receipient-form">Recipient’s Information:</label>
                            <div className="gc-row">
                                <div className="gc-col">
                                    <div className="gc-col-item"><input type="text" placeholder='First Name*' /></div>
                                    <div className="gc-col-item"><input type="text" placeholder='Last Name*' /></div>
                                    <div className="gc-col-item"><input type="text" placeholder='Zip Code*' /></div>
                                </div>
                            </div>
                            <div className="gc-row">
                                <textarea name="message" id="" width="100%" rows="10" placeholder='Enter a custom message to be included with gift'></textarea>
                            </div>
                            <div className="gc-row">
                                <label htmlFor="email-method">
                                    Email Method:
                                </label>
                                <div className="gc-col gc-col-method">
                                    <div className="gc-col-item">
                                    <label htmlFor="method">
                                        <input type="radio" name="method" />
                                        Send to recipient’s email:</label>
                                    </div>
                                    <div className="gc-col-item">
                                    <label htmlFor="method">
                                        <input type="radio" name="method" />
                                       Send to your email:</label>
                                    </div>
                                </div>
                                <div className="gc-row gc-method-field">
                                    <input type="text" disabled placeholder='Email Address*' />
                                </div>
                                <div className="gc-row">
                                    <button className='btn btn-primary-small'>Add To cart</button>
                                </div>
                            </div>
                            </form>
                        </div>
                        
                    </div>
                    <div className="gc-row">
                        <div className="gc-col">
                            <div className="line-separator"></div>
                        </div>
                    </div>
                    <div className="gc-row faq-row">
                        <div className="gc-col">
                            <div className="gc-col-item">
                                <h5 className="ha-h5">What will your recipient get?</h5>
                            </div>
                            <div className="gc-col-item para-col">
                                <p className='ha-body'>A digital gift card—along with your note and instructions to purchase meals. Prefer to send the gift card yourself? Put your own address in the email field and you can forward along the card. PS: Gift cards never expire. Questions? Contact us here.</p>
                            </div>
                        </div>
                    </div>
                    <div className="gc-row">
                        <div className="gc-col">
                            <div className="line-separator"></div>
                        </div>
                    </div>
                    <div className="gc-row faq-row">
                        <div className="gc-col">
                            <div className="gc-col-item">
                                <h5 className="ha-h5">What gift card amount should you buy?</h5>
                            </div>
                            <div className="gc-col-item para-col">
                                <p className='ha-body'>Our deliveries start at $100 a person (only $50 for each additional person), which includes enough selections for 4-6 meals per person. Consider adding a little something extra, so the recipient can try a few of our sweets, salads and soups—and don’t forget that delivery costs $5 in Philadelphia and $15 for the suburbs. Still have questions? Use our gift card calculator above or Contact us here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                        <select className='calculator-select' value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)}>
                            {servingOptions.map(option => {
                                return (
                                    <option value={option.value}>{option.label}</option>
                                )
                            })}
                        </select>
                    </div>

                    <p className='gift-card-calculator--amount text-center'>{suggestedAmountText}</p>

                    <div className="text-center gift-card-control">
                        <button className={`btn btn-primary-small btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={!isFormReady} onClick={() => onAddGift()}>
                            {addButtonText} 
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                        <div className='calculator-field'>
                            <label># of Weeks:</label>
                            <input type='text' placeholder='Enter Weeks (max 8)' onKeyPress={(e) => !/[1-8]/.test(e.key) && e.preventDefault()} maxLength={1} value={numberOfWeeks} onChange={(e) => setNumberOfWeeks(e.target.value)} />
                        </div>
                        <div className='calculator-field'>
                            <label>ZIP Code:</label>
                            <input type='text' placeholder='Enter ZIP' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                        </div>
                    </div>

                    <p className='gift-card-calculator--amount text-center'>{suggestedAmountText}</p>

                    <div className="text-center gift-card-control">
                        <button className={`btn btn-primary-small btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={isFormReady} onClick={onAddGift}>
                            {addButtonText}
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                    </div>
                    </div>

                </Modal>

                { cartLines.length > 0 && <button className={`btn btn-secondary btn-modal`} onClick={() => onCheckout()}>
                    Checkout
                </button>}

                <Footer />
        </Page>        
    );
}