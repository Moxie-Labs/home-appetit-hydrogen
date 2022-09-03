import React, {useCallback, useRef, useState} from 'react';
import map from "../assets/map.png";
import iconVisa from "../assets/visa-icon.png";
import iconPlus from "../assets/icon-plus-alt.png";
import iconCheckLight from "../assets/icon-check-light.png";
import Modal from 'react-modal/lib/components/Modal';
import { TextField } from './TextField.client';

export default function PaymentInfo(props) {

    const {
        isGuest,
        cardNumber, 
        expiration, 
        securityCode, 
        zipcode, 
        sameAsBilling,
        creditCards,
        giftCards,
        handleCardNumberChange, 
        handleExpirationChange, 
        handleSecurityCodeChange, 
        handleZipcodeChange, 
        handleSameAsBilling,
        handleContinue,
        handleCancel,
        handleFirstNameChange, 
        handleLastNameChange, 
        handleEmailChange, 
        handlePhoneNumberChange, 
        handleAddressChange, 
        handleAddress2Change, 
        handleCityChange, 
        handleBillingZipcodeChange, 
        handleStateChange,
        handleGiftCardTrigger,
        handleReferralTrigger,
        handlePromoTrigger,
        handleCreditCardsChange,
        handleGiftCardsChange,
        step,
        currentStep,
        firstName,
        lastName, 
        emailAddress, 
        phoneNumber, 
        address, 
        address2, 
        city, 
        deliveryState,
        billingZipcode,
        giftCardTriggered,
        promoTriggered,
        referralTriggered
    } = props;

    const node = useRef(null);

    const listOfStates = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

    // TEMP VALUES
    const CUSTOMER = {
        firstName: "Jon Paul",
        lastName: "Simonelli",
        email: "jpsimonelli@moxielabs.co",
        phone: "123 456 7890"
    };
    
    const ORDER = {
        cancelReason: null,
        currentSubtotalPrice: 100,
        edited: false,
        email: "jpsimonelli@moxielabs.co",
        financialStatus: "PENDING",
        fulfillmentStatus: "OPEN",
        metaFields: [
            { orderType: "traditional" }
        ],
        totalPriceV2: 100
    }
    
    const CHECKOUT = {
        id: "C432233",
        appliedGiftCards: [],
        email: "jpsimonelli@moxielabs.co",
        order: ORDER,
        ready: true,
        subtotalPriceV2: 100,
        totalPriceV2: 100
    }
    
    const CHECKOUT_GIFTS = {
        id: "C432233",
        appliedGiftCards: [
            {
                amountUsed: 25,
                balance: 0,
                lastCharacters: "m8vdr"
            }
        ],
        email: "jpsimonelli@moxielabs.co",
        order: ORDER,
        ready: true,
        subtotalPriceV2: 100,
        totalPriceV2: 100
    }

    const GIFT_CARD = {
        amountUsed: 25,
        balance: 0,
        lastCharacters: "m8vdr"
    }

        
    const CREDIT_CARD = {
        brand: "Visa",
        expiryMonth: "11",
        expiryYear: "25",
        firstDigits: "4111",
        lastDigits: "1113",
        lastName: "Simonelli",
        maskedNumber: "**** 1113"
    }
    
    const PAYMENT = {
        id: "P122443",
        amountV2: 100,
        billingAddress: {
            address1: "121 Mayberry Road",
            address2: "",
            city: "Catawissa",
            firstName: "Jon Paul",
            lastName: "Simonelli",
            state: "Pennsylvania",
            phone: "123 456 7890"
        },
        creditCard: CREDIT_CARD,
        ready: true,
        test: true
    
    }

    // END TEMP VALUES


    const [activeCardModal, setActiveCardModal] = useState(false);
    const [modalCreditCardNumber, setModalCreditCardNumber] = useState("");
    const [modalNameOnCard, setModalNameOnCard] = useState("");
    const [modalExpiryDate, setModalExpiryDate] = useState("");
    const [modalCvv, setModalCvv] = useState("");
    const [modalAddress, setModalAddress] = useState("");
    const [modalAddress2, setModalAddress2] = useState("");
    const [modalCity, setModalCity] = useState("");
    const [modalState, setModalState] = useState("");
    const [modalZip, setModalZip] = useState("");
    const [giftCardInput, setGiftCardInput] = useState("");

    const stateOptions = listOfStates.map((state) => {
        return <option value={state}>{state}</option>
    });

    const onCardNumberChange = (event) => {
        handleCardNumberChange(event.target.value);
    }
    
    const onExpirationChange = (event) => {
        handleExpirationChange(event.target.value);
    }

    const onSecurityCodeChange = (event) => {
        handleSecurityCodeChange(event.target.value);
    }

    const onZipcodeChange = (event) => {
        handleZipcodeChange(event.target.value);
    }

    const onSameAsBilling = (value) => {
        handleSameAsBilling(value);
    }

    // Billing Address helpers
    const onFirstNameChange = (event) => {
        handleFirstNameChange(event.target.value);
    }
    
    const onLastNameChange = (event) => {
        handleLastNameChange(event.target.value);
    }

    const onEmailChange = (event) => {
        handleEmailChange(event.target.value);
    }

    const onPhoneNumberChange = (event) => {
        handlePhoneNumberChange(event.target.value);
    }

    const onAddressChange = (event) => {
        handleAddressChange(event.target.value);
    }

    const onAddress2Change = (event) => {
        handleAddress2Change(event.target.value);
    }

    const onCityChange = (event) => {
        handleCityChange(event.target.value);
    }

    const onDeliveryStateChange = (event) => {
        handleStateChange(event.target.value);
    }

    const onBillingZipcodeChange = (event) => {
        handleBillingZipcodeChange(event.target.value);
    }

    const onSubmitCard = () => {

        let mutation = {};
        mutation.call = `mutation checkoutCompleteWithTokenizedPaymentV3($checkoutId: ID!, $payment: TokenizedPaymentInputV3!) {
            checkoutCompleteWithTokenizedPaymentV3(checkoutId: $checkoutId, payment: $payment) {
              checkout {
                id: "C432233",
                appliedGiftCards: [],
                email: "jpsimonelli@moxielabs.co",
                order: ORDER,
                ready: true,
                subtotalPriceV2: 100,
                totalPriceV2: 100
              }
              checkoutUserErrors {}
              payment {
                id: "P122443",
                amountV2: 100,
                billingAddress: {
                    address1: "121 Mayberry Road",
                    address2: "",
                    city: "Catawissa",
                    firstName: "Jon Paul",
                    lastName: "Simonelli",
                    state: "Pennsylvania",
                    phone: "123 456 7890"
                },
                creditCard: CREDIT_CARD,
                ready: true,
                test: true
              }
            }
          }`;

          mutation.resp = {
            customer: CUSTOMER,
            checkout: CHECKOUT,
            order: ORDER,
            payment: PAYMENT
          }

        setTimeout(() => {
            console.log("mutation", mutation);

            handleCreditCardsChange([CREDIT_CARD, ...creditCards])
            
            dismissModals();
        }, 1000)

    }

    const onGiftCardSubmit = () => {
        let mutation = {};
        mutation.call = `mutation checkoutCompleteWithTokenizedPaymentV3($checkoutId: ID!, $payment: TokenizedPaymentInputV3!) {
            checkoutCompleteWithTokenizedPaymentV3(checkoutId: $checkoutId, payment: $payment) {
              checkout {
                id: "C432233",
                appliedGiftCards: [{
                    amountUsed: 25,
                    balance: 25,
                    lastCharacters: "m8vdr"
                }],
                email: "jpsimonelli@moxielabs.co",
                order: ORDER,
                ready: true,
                subtotalPriceV2: 100,
                totalPriceV2: 100
              }
              checkoutUserErrors {}
              payment {
                id: "P122443",
                amountV2: 100,
                billingAddress: {
                    address1: "121 Mayberry Road",
                    address2: "",
                    city: "Catawissa",
                    firstName: "Jon Paul",
                    lastName: "Simonelli",
                    state: "Pennsylvania",
                    phone: "123 456 7890"
                },
                creditCard: CREDIT_CARD,
                ready: true,
                test: true
              }
            }
          }`;

          mutation.resp = {
            customer: CUSTOMER,
            checkout: CHECKOUT_GIFTS,
            order: ORDER,
            payment: PAYMENT
          }

        setTimeout(() => {
            console.log("mutation", mutation);

            handleGiftCardsChange([GIFT_CARD, ...giftCards])

            setGiftCardInput("");
            
            dismissModals();
        }, 1000)
   
    }

    const dismissModals = () => {
        setActiveCardModal(false);
    }

    const handleFocus = useCallback(() => {
        if (node.current == null) {
          return;
        }
        node.current.input.select();
        document.execCommand("copy");
    }, []);

    let paymentInfoSection; 
    
    if (isGuest) { paymentInfoSection = <div className="checkout-section checkout--payment-info">
            <h2 className="heading order_prop__heading ha-h3">Payment Information</h2>

            { currentStep === step && 
                <div>
                    <section className="checkout-subsection checkout--paymentinfo-top">
                        <h3 className="subheading">Credit Card Information</h3>
                        <input className="order_textfield" type="text" name="CardNumber" value={cardNumber} onChange={onCardNumberChange} placeholder={"Card Number (Required)"}/>
                        <input className="order_textfield" type="text" name="lastname" value={expiration} onChange={onExpirationChange} placeholder={"Expiration (Required)"}/>
                        <input className="order_textfield" type="text" name="email" value={securityCode} onChange={onSecurityCodeChange} placeholder={"Security Code (Required)"}/>
                        <input className="order_textfield" type="phone" name="phone" value={zipcode} onChange={onZipcodeChange} placeholder={"ZIP code (Required)"}/>
                    </section>

                    <section className="checkout-subsection checkout--paymentinfo-top">
                        <h3 className="subheading">Billing Address</h3>
                        <label>
                            <input type="radio" name="same-as-billing" value={true} checked={sameAsBilling} onChange={() => onSameAsBilling(true)}/>
                            Same as delivery address
                        </label>
                        
                        <label>
                            <input type="radio" name="same-as-billing" value={false} checked={!sameAsBilling} onChange={() => onSameAsBilling(false)}/>
                            Different address
                        </label>
                    </section>

                    { !sameAsBilling && 
                        <div>
                            <section className="checkout-subsection checkout--deliveryinfo-top">
                                <h3 className="subheading">Billing Information</h3>
                                <input className="order_textfield" type="text" name="firstname" value={firstName} onChange={onFirstNameChange} placeholder={"First Name (Required)"}/>
                                <input className="order_textfield" type="text" name="lastname" value={lastName} onChange={onLastNameChange} placeholder={"Last Name (Required)"}/>
                                <input className="order_textfield" type="text" name="email" value={emailAddress} onChange={onEmailChange} placeholder={"Email Address (Required)"}/>
                                <input className="order_textfield" type="phone" name="phone" value={phoneNumber} onChange={onPhoneNumberChange} placeholder={"Phone Number (Required)"}/>
                            </section>

                            <section className="checkout-subsection checkout--deliveryinfo-top">
                                <h3 className="subheading">Confirm Your Billing Address</h3>
                                <input className="order_textfield" type="text" name="address" value={address} onChange={onAddressChange} placeholder={"Address (Required)"}/>
                                <input className="order_textfield" type="text" name="address2" value={address2} onChange={onAddress2Change} placeholder={"Address 2"}/>
                                <input className="order_textfield" type="text" name="email" value={city} onChange={onCityChange} placeholder={"City (Required)"}/>
                                <select className="order_delivery__dropdown order_select dropdown_state" value={deliveryState} onChange={onDeliveryStateChange}>
                                    {stateOptions}
                                </select>
                                <input className="order_textfield textfield-zip" type="number" name="zipcode" maxLength={5} value={billingZipcode} onChange={onBillingZipcodeChange} placeholder={"ZIP Code (Required)"}/>
                            </section>
                        </div>
                    }
                    

                    {/* <section className="checkout--paymentinfo-image">
                        <img className="img img-map" src={map.src} />
                    </section> */}


                    <section className="actions checkout--paymentinfo-actions">
                        <button className="btn btn-confirm btn-app" onClick={handleContinue}>
                            Continue
                        </button>

                        <button className="btn btn-primary btn-app" onClick={handleCancel}>
                            Cancel
                        </button>
                    </section>
                </div>

            }

            <hr></hr>
            
            
        </div>;
    }

    else {
        const creditCardOptions = creditCards.map((card) => {
            const brand = card.brand;
            const maskedNumber = card.maskedNumber;
            return <option>{brand} {maskedNumber} Exp: {card.expiryMonth}/{card.expiryYear}</option>;
        })

        const giftCardsUsed = giftCards.map(card => {
            return <p><span className="text-left">Gift Card ****{card.lastCharacters}</span><span className="pull-right">${card.amountUsed}.00</span></p>
        });

        paymentInfoSection = <div className="checkout-section checkout--payment-info checkout--payment-info--logged-in">
            <select className="order_payment-method__dropdown left">
                {creditCardOptions}
            </select>

            <p className="btn-add-new underline">
                <span><img src={iconPlus.src} className="icon-span" width="17"/></span><a onClick={() => setActiveCardModal(true)}> Add New Payment</a>
            </p>

            <div className={`payment-method-trigger payment-method--giftcards top${giftCardTriggered ? ' triggered' : ''}`} onClick={handleGiftCardTrigger}>
                { !giftCardTriggered && 
                 <div>
                    <span><img src={iconPlus.src} className="icon-span" width="17"/></span>
                    <span className="text-right btn-add-new">Add Gift Card</span>
                 </div> 
                } 

                { giftCardTriggered && 
                <div>
                   <span><img src={iconCheckLight.src} className="icon-span" width="17"/></span>
                   <span className="text-right btn-add-new gc-title-triggered">Add Gift Card</span>
                </div>
                } 

                { giftCardTriggered && !giftCardsUsed &&
                <div>
                   <span><img src={iconCheckLight.src} className="icon-span" width="17"/></span>
                   <span className="text-right btn-add-new gc-title-triggered">Add Gift Card</span>
                </div>
                } 

                { giftCardsUsed }
                { giftCardTriggered && 
                    <div className="payment-gc-field">
                        <TextField type="text" placeholder="Enter code" value={giftCardInput} onChange={(giftCardInput) => {setGiftCardInput(giftCardInput)}}/><button onClick={() => onGiftCardSubmit()}>Add</button>
                    </div>
                }
            </div>

            <div className={`payment-method-trigger payment-method--giftcards center${promoTriggered ? ' triggered' : ''}`} onClick={handlePromoTrigger}>
            
            { !promoTriggered &&
            <div>
              <span><img src={iconPlus.src} className="icon-span" width="17"/></span><span className="text-right btn-add-new">Add Promo Code</span>
            </div>
            }

            { promoTriggered &&
                <div>
                    <span><img src={iconCheckLight.src} className="icon-span" width="17"/></span><span className="text-right btn-add-new gc-title-triggered">Add Promo Code</span>
                </div>
            }
                
            { promoTriggered && 
                <div className="payment-gc-field">
                    {/* <input type="text" className="payment-promotion_textbox"/><button>Add</button> */}
                    <TextField/><button>Add</button>
                </div>
            }
            </div>

            <div className={`payment-method-trigger payment-method--giftcards bottom${referralTriggered ? ' triggered' : ''}`} onClick={handleReferralTrigger}>
            { !referralTriggered &&
                <div>
                     <span><img src={iconPlus.src} className="icon-span" width="17"/></span><span className="text-right btn-add-new">Use Referral Credit</span>
                </div>
            }

            { referralTriggered &&
                <div>
                    <span><img src={iconCheckLight.src} className="icon-span" width="17"/></span><span className="text-right btn-add-new gc-title-triggered">Use Referral Credit</span>
                </div>
            }
                { referralTriggered && 
                    <div className="payment-gc-field">
                         <TextField/><button>Add</button>
                    </div>
                }
            </div>
            
            <Modal
                isOpen={activeCardModal}
                onRequestClose={dismissModals}
                className="Polaris-Modal-Dialog__Modal"
            >
                <div className="add-payment-modal-container">
                <section className="modal--create-inner">            
                    <div className="padding-20v">
                        <h2 className="modal-heading text-center ha-h4">Add New Payment</h2>
                    </div>
                    <TextField
                        ref={node}
                        label="Card Number"
                        type="text"
                        onFocus={handleFocus}
                        value={modalCreditCardNumber}
                        placeholder={"Enter card number"}
                        maxLength={16}
                        onChange={(modalCreditCardNumber) => {setModalCreditCardNumber(modalCreditCardNumber)}}
                        autoComplete="off"
                    />
                    
                    <TextField
                        ref={node}
                        label="Name on Card"
                        type="text"
                        onFocus={handleFocus}
                        value={modalNameOnCard}
                        placeholder={"Enter name on card"}
                        maxLength={75}
                        onChange={(modalNameOnCard) => {setModalNameOnCard(modalNameOnCard)}}
                        autoComplete="off"
                    />
                    
                    <div className="payment-modal-field-col">
                    <TextField
                        ref={node}
                        label="Expiration Date"
                        type="text"
                        onFocus={handleFocus}
                        value={modalExpiryDate}
                        placeholder={"MM/YY"}
                        maxLength={5}
                        onChange={(modalExpiryDate) => {setModalExpiryDate(modalExpiryDate)}}
                        autoComplete="off"
                    />
                
                    <TextField
                        ref={node}
                        label="Security Code"
                        type="text"
                        onFocus={handleFocus}
                        value={modalCvv}
                        placeholder={"Enter security code"}
                        maxLength={4}
                        onChange={(modalCvv) => {setModalCvv(modalCvv)}}
                        autoComplete="off"
                    />
                
                    </div>

                    {/* <div className="padding-20v">
                        <h2 className="modal-heading text-left">Billing Address</h2>
                    </div> */}

                    <TextField
                        ref={node}
                        label="Billing Address:"
                        type="text"
                        onFocus={handleFocus}
                        value={modalAddress}
                        placeholder={"Enter address"}
                        maxLength={75}
                        onChange={(modalAddress) => {setModalAddress(modalAddress)}}
                        autoComplete="off"
                    />
                    
                    <TextField
                        ref={node}
                        label="Address 2:"
                        type="text"
                        onFocus={handleFocus}
                        value={modalAddress2}
                        placeholder={"Enter address"}
                        maxLength={75}
                        onChange={(modalAddress2) => {setModalAddress2(modalAddress2)}}
                        autoComplete="off"
                    />
                    <div className="payment-modal-field-col">
                    
                    <TextField
                        ref={node}
                        label="City:"
                        type="text"
                        onFocus={handleFocus}
                        value={modalCity}
                        placeholder={"Default state..."}
                        maxLength={50}
                        onChange={(modalCity) => {setModalCity(modalCity)}}
                        autoComplete="off"
                    />
                    
                    <div className="add-payment-state-field">
                        <label>State: </label>
                        <select className="order_delivery__dropdown order_select dropdown_state" value={deliveryState} onChange={onDeliveryStateChange}>
                            {stateOptions}
                        </select>
                    </div>
                    <TextField
                        ref={node}
                        label="ZIP:"
                        type="text"
                        onFocus={handleFocus}
                        value={modalZip}
                        placeholder={"Enter ZIP"}
                        maxLength={5}
                        onChange={(modalZip) => {setModalZip(modalZip)}}
                        autoComplete="off"
                    />
                    
                    </div>

                </section>
                <div className="text-center">
                    <button className={`btn btn-confirm btn-modal btn-app btn-primary-small`} primary onClick={onSubmitCard}>
                        Add Payment
                    </button>
                    {/* <button className={`btn btn-disabled btn-modal btn-app`} secondary onClick={onSubmitCard}>
                        Cancel
                    </button> */}
                </div>
                </div>
            </Modal>

            {/* Placeholder for submit */}
            <div className="place-order-container">
            <hr />
                <button className="btn btn-primary-small btn-place-order" onClick={handleContinue}>
                    PLACE ORDER
                </button>
            </div>

        </div>
    }


    return paymentInfoSection;
}

// qh67whqyk6qm8vdr