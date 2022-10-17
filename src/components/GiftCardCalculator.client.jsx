import React, {useCallback, useState, useRef } from 'react';
import Modal from 'react-modal/lib/components/Modal';
import { Page } from "./Page.client";
import { Header } from "./Header.client";
import { Footer } from "./Footer.client";
import gcImg from "../assets/giftcard-img.png";


const PREMIUM_ZIPCODES = [];
const PREMIUM_RATE = 50;
const REGULAR_RATE = 50;

export function GiftCardCalculator(props) {

    const [activeCalculator, setActiveCalculator] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [numberOfWeeks, setNumberOfWeeks] = useState("");
    const [zipcode, setZipcode] = useState("");

    const {handleAddGift} = props;


    const node = useRef(null);

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
        handleAddGift;
        dismissModals();
    }

    const activator = <a href="#" className='ha-a' onClick={toggleModal}>use our gift card calculator</a>;

    const suggestedAmountText = isFormReady() ? `$${calculateSuggestedAmount()}` : "Enter fields for suggested amount";

    const addButtonText = isFormReady() ? `Add $${calculateSuggestedAmount()}` : "Add";

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
                    <div className="gc-row">
                        <div className="gc-col">
                            <div className="gc-col-item">
                                <h5 className="ha-h5">Check Gift card Balance</h5>
                            </div>
                            <div className="gc-col-item form-balance">
                                <label htmlFor="code-balance">Check Balance:</label>
                                <input type="text" placeholder='Enter code' />
                                <span> <button type='submit' className='btn btn-primary-small'>SUBMIT</button></span>
                                <div className="gc-row">
                                    <div className="gc-col gc-balance">
                                        <div className="gc-col-item">
                                            <p className='no-margin'>Gift Card Balance</p>
                                        </div>
                                        <div className="gc-col-item">
                                            <strong>$150.00</strong>
                                        </div>
                                    </div>
                                </div>
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
                    <h1 className='ha-h4 text-center '>Calculate Gift Amount</h1>

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
                        <button className={`btn btn-primary-small btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={isFormReady} onClick={onAddGift}>
                            {addButtonText} 
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                    </div>

                </Modal>
                <Footer />
        </Page>        
    );
}