import React, {useCallback, useState, useRef, useEffect } from 'react';
import { useCart } from '@shopify/hydrogen';
import Modal from 'react-modal/lib/components/Modal';
import { Page } from '../Page.client';
import { Header } from '../Header.client';
import { Footer } from '../Footer.client';
import gcImg from "../../assets/giftcard-img.png";
import gcImgMobile from "../../assets/giftcard-img-mobile.png";
import { getPlaceholderBlogImage } from '../../lib/placeholders';
import { logToConsole } from '../../helpers/logger';
import { Radio } from '../Radio.client';


const PREMIUM_ZIPCODES = [];
const PREMIUM_RATE = 50;
const REGULAR_RATE = 50;
const marketingSite = `https://${import.meta.env.VITE_STORE_DOMAIN}/`;

export function GiftCardCalculator(props) {

    const [activeCalculator, setActiveCalculator] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [numberOfWeeks, setNumberOfWeeks] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [email, setEmail] = useState("");
    const [useMyEmail, setUseMyEmail] = useState(false);
    const [giftCardAmount, setGiftCardAmount] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [hasAddedCard, setHasAddedCard] = useState(false);
    const [isOrderCleared, setIsOrderCleared] = useState(false);
    const [message, setMessage] = useState("");

    const node = useRef(null);

    const customerEmail = props.email === null ? "" : props.email;

    let { checkoutUrl, linesAdd, linesRemove, lines: cartLines, status:cartStatus, noteUpdate } = useCart();

    useEffect(() => {  
        if (cartLines.length > 0 && !hasAddedCard && cartStatus == 'idle') {
            const linesToRemove = [];
            cartLines.map(line => {
                linesToRemove.push(line.id);
            });

            setTimeout(() => {
                linesRemove(linesToRemove);
            }, 3000);  
        } else {
            if (hasAddedCard && cartLines.length > 0) {
                proceedToCheckout();
            }
        }
        
    }, [cartLines]);

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
        return (giftCardAmount >= 25 && giftCardAmount <= 1000);
    }   

    const isModalFormReady = () => {
        return (numberOfWeeks.length > 0 && zipcode.length === 5);
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

    const attemptCheckout = () => {

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        } else {
            if (giftCardAmount >= 25)  {

                let cardProductIndex;
                if (giftCardAmount < 126) {
                    cardProductIndex = 0;
                } else if (giftCardAmount < 226) {
                    cardProductIndex = 1;
                } else if (giftCardAmount < 326) {
                    cardProductIndex = 2;
                } else if (giftCardAmount < 426) {
                    cardProductIndex = 3;
                } else if (giftCardAmount < 526) {
                    cardProductIndex = 4;
                } else if (giftCardAmount < 626) {
                    cardProductIndex = 5;
                } else if (giftCardAmount < 726) {
                    cardProductIndex = 6;
                } else if (giftCardAmount < 826) {
                    cardProductIndex = 7;
                } else if (giftCardAmount < 926) {
                    cardProductIndex = 8;
                } else {
                    cardProductIndex = 9;
                }
        
                const offset = giftCardAmount < 126 ? 25 : 26;
    
                let amountStr = String(giftCardAmount - offset);
                if (amountStr.length > 2)
                    amountStr = amountStr.slice(-2);
                const cardVariantIndex = (parseInt(amountStr));
        
                const cardProduct = props.giftCards[cardProductIndex];
                const variant = cardProduct.variants.edges[cardVariantIndex].node;
        
                setHasAddedCard(true);
                
                noteUpdate(message);

                setTimeout(() => {
                    linesAdd({
                        merchandiseId: variant.id,
                        quantity: 1
                    });
                }, 1000);
        
            }
        }
       
    }

    const onConfirmCalculatedAmount = amount => {
        setGiftCardAmount(amount);
        dismissModals();
    }

    const onGiftCardAmountChange = amount => {
        if (amount.length < 1)
            amount = 0;
        setGiftCardAmount(parseInt(amount));
    }


    const activator = <a href="#" className='ha-a' onClick={toggleModal}>use our gift card calculator</a>;

    const suggestedAmountText = () => {
        if (zipcode.length >= 5 && !isZipcodePermitted())
            return "Zipcode outside delivery range.";
        else if (isModalFormReady())
            return `$${calculateSuggestedAmount()}`;
        else
            return "Enter fields for suggested amount";
    }

    const addButtonText = isModalFormReady() ? `Purchase $${calculateSuggestedAmount()}` : "Purchase";

    const isZipcodePermitted = () => {
        if (zipcode.length < 5) 
            return null;
        else   
            return (props.zipcodeArr.find(e => e.includes(zipcode)) !== undefined)
    }

    const validateForm = () => {
        logToConsole("validateForm...")
        const newFormErrors = {};

        if (giftCardAmount < 25)
            newFormErrors.giftCardAmount = "Amount must be at least $25.";
        if (giftCardAmount > 1000)
            newFormErrors.giftCardAmount = "Amount cannot be over $1000.";
        if (firstName.length < 1)
            newFormErrors.firstName = "Please enter First Name.";
        if (lastName.length < 1)
            newFormErrors.lastName = "Please enter Last Name."
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) && !useMyEmail)
            newFormErrors.email = "Please enter a valid Email Address."
        if (zipcode.length < 5)
            newFormErrors.zipcode = "Please enter a valid ZIP code."
        else if (!isZipcodePermitted())
            newFormErrors.zipcode = "This ZIP code is not in our delivery zone."
        
        return newFormErrors;

    }

    const servingOptions = [
        { label: '1 Person', value: 1 },
        { label: '2 People', value: 2 },
        { label: '3 People', value: 3 },
        { label: '4 People', value: 4 },
        { label: '5 People', value: 5 }
    ];

    const proceedToCheckout = () => {
        logToConsole("Waiting...")
        if (checkoutUrl === undefined) 
            setTimeout(() => {
                proceedToCheckout();
            }, 1000);
        else  {
            logToConsole("done");

            

            setTimeout(() => {
                const {defaultAddress} = props;
                if (defaultAddress === null)
                    window.location.href = `${checkoutUrl}?checkout[email]=${useMyEmail ? customerEmail : email}`;
                else 
                    window.location.href = `${checkoutUrl}?checkout[email]=${useMyEmail ? customerEmail : email}
                    &checkout[billing_address][first_name]=${defaultAddress.firstName}
                    &checkout[billing_address][last_name]=${defaultAddress.lastName}
                    &checkout[billing_address][address1]=${defaultAddress.address1}
                    &checkout[billing_address][address2]=${defaultAddress.address2 === null ? "" : defaultAddress.address2}
                    &checkout[billing_address][city]=${defaultAddress.city}
                    &checkout[billing_address][province]=${defaultAddress.deliveryState}
                    &checkout[billing_address][country]=${defaultAddress.country}
                    &checkout[billing_address][zip]=${defaultAddress.zip}`;
            }, 2000);
        }   
    }

    const blogArea = props.blogPosts.map(post => {
        let imageUrl;
        let imageAlt;
        if (post.image === null) {
            imageUrl = getPlaceholderBlogImage();
            imageAlt = "Home Appetit Blog"
        } else {
            imageUrl = post.image.url;
            imageAlt = post.image.alt;
        }
        return <article className='blog-post'>
            <a href={post.onlineStoreUrl}>
                <div className='blog-post_image' style={{background: `url('${imageUrl}')`}}></div>
                {/* <img className='blog-post_image' src={imageUrl} alt={imageAlt}></img> */}
                <div className='blog-post_text'>
                    <h2 className='blog-post_title'>{post.title}</h2>
                </div>
            </a>
        </article>
    });

    return (
        <div id="container--gift-card">
            <Page>
                <Header customerAccessToken={props.customerAccessToken} />

            <div className="gc-wrapper gc-wrapper--hero">
                <div className="gc-item-column gc-item-column_image">
                    <img className='desktop-only' src={gcImg} />
                    <img className='mobile-only' src={gcImgMobile} />
                </div>
                <div className="gc-item-column form-column">
                    <h2 className='ha-h2 no-margin no-padding'>Home Appétit Gift Card</h2>
                    
                    <p className='gc-subtitle ha-body gc-text--gift-card-info'>Purchase a gift card for any amount or use our calculator below to determine the ideal gift. <u>Note: All gift cards are digital.</u></p>
                    <div className="gc-row">
                        <div className="gc-col">
                            <div className="gc-col-item">
                                <label htmlFor="gc-amount">Gift card amount:</label>
                                <input className={formErrors.giftCardAmount !== undefined ? 'input-error' : ''} type="number" min={25} value={giftCardAmount} onChange={e => onGiftCardAmountChange(e.target.value)} placeholder={`From $25 to $1000`} />
                                {formErrors.giftCardAmount !== undefined ? <p className='form-errors-gc'>{formErrors.giftCardAmount}</p> : <p className='form-errors-gc form-errors-gc--empty'></p>}
                            </div>
                            <div className="gc-col-item container--calculator-activator">
                                {activator}
                            </div>
                        </div>
                    </div>
                    <div className="gc-row">
                        
                        <div className="gc-col-item">
                            <label htmlFor="receipient-form">Recipient’s Information:</label>
                            <div className="gc-row">
                                <div className="gc-col">
                                    <div className="gc-col-item">
                                        <input className={formErrors.firstName !== undefined ? 'input-error' : ''} type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='First Name*' />
                                        {formErrors.firstName !== undefined ? <p className='form-errors-gc'>{formErrors.firstName}</p> : <p className='form-errors-gc form-errors-gc--empty'></p>}
                                    </div>
                                    <div className="gc-col-item">
                                        <input className={formErrors.lastName !== undefined ? 'input-error' : ''} type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder='Last Name*' />
                                        {formErrors.lastName !== undefined ? <p className='form-errors-gc'>{formErrors.lastName}</p> : <p className='form-errors-gc form-errors-gc--empty'></p>}
                                    </div>
                                    <div className="gc-col-item">
                                        <input className={formErrors.zipcode !== undefined ? 'input-error' : ''} type="text" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder='ZIP Code*'/>
                                        {formErrors.zipcode !== undefined ? <p className='form-errors-gc'>{formErrors.zipcode}</p> : <p className='form-errors-gc form-errors-gc--empty'></p>}
                                    </div>
                                </div>
                            </div>
                            <div className="gc-row">
                                <textarea name="message" id="" width="100%" rows="10" value={message} onChange={e => setMessage(e.target.value)} placeholder='Enter a custom message to be included with gift email.'></textarea>
                            </div>
                            <div className="gc-row gc-row--email">
                                <label htmlFor="email-method">
                                    Email Method:
                                </label>
                                <div className="gc-col gc-col-method">
                                    <div className="gc-col-item">
                                        <Radio name="method" handleClick={() => setUseMyEmail(false)} isChecked={!useMyEmail} label={"Send to recipient’s email"}/>
                                    </div>
                                    <div className="gc-col-item">
                                        <Radio name="method" handleClick={() => setUseMyEmail(true)} isChecked={useMyEmail} label={"Send to your email"}/>
                                    </div>
                                </div>
                                <div className="gc-row gc-method-field">
                                    <input className={formErrors.email !== undefined ? 'input-error' : ''} type="text" value={useMyEmail && customerEmail.length > 0 ? customerEmail : email} disabled={useMyEmail && customerEmail.length > 0} onChange={e => setEmail(e.target.value)} placeholder='Email Address*' />
                                    {formErrors.email !== undefined ? <p className='form-errors-gc'>{formErrors.email}</p> : <p className='form-errors-gc form-errors-gc--empty'></p>}
                                </div>
                                <div className="gc-row">
                                    <button className={`btn btn-primary-small ${isFormReady() ? '' : 'disabled'}`} onClick={() => attemptCheckout()}>Purchase Card</button>
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
                                    <p className='ha-body'>A digital gift card—along with your note and instructions to purchase meals. Prefer to send the gift card yourself? Put your own address in the email field and you can forward along the card. PS: Gift cards never expire. Questions? <a className='uppercase underline link' href={`${marketingSite}pages/contact-1`}>Contact us here</a>.</p>
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
                                    <p className='ha-body'>Our deliveries start at $100 a person (only $50 for each additional person), which includes enough selections for 4-6 meals per person. Consider adding a little something extra, so the recipient can try a few of our sweets, salads and soups—and don’t forget that delivery costs $5 in Philadelphia and $15 for the suburbs. Still have questions? Use our gift card calculator above or <a className='uppercase underline link' href={`${marketingSite}pages/contact-1`}>Contact us here</a>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                <section className='blog-post-section'>
                    <h1 className='blog-post-section_title'>The Latest from<span className='mobile-only'><br></br></span> H.A.’s HQ</h1>
                    <div className='blog-post-section_posts'>
                        {blogArea}
                    </div>
                    <div className='blog-post-section_link'>
                        <a className='btn btn-tertiary-small' style={{paddingLeft: '4em', paddingRight: '4em', fontSize: 14}} href={`${marketingSite}blogs/blog`}>View All</a>
                    </div>
                </section>

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
                        <div className='calculator-field'>
                            <label># of Weeks:</label>
                            <input type='text' placeholder='(up to 8)' onKeyPress={(e) => !/[1-8]/.test(e.key) && e.preventDefault()} maxLength={1} value={numberOfWeeks} onChange={(e) => setNumberOfWeeks(e.target.value)} />
                        </div>
                        <div className='calculator-field'>
                            <label>ZIP Code:</label>
                            <input type='text' placeholder='Enter ZIP' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                        </div>
                    </div>

                    <p className='gift-card-calculator--amount text-center'>{suggestedAmountText()}</p>

                    <div className="text-center gift-card-control">
                        <button className={`btn btn-primary-small btn-confirm btn-modal${isModalFormReady() && isZipcodePermitted() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={!isModalFormReady} onClick={() => onConfirmCalculatedAmount(calculateSuggestedAmount())}>
                            {addButtonText}
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                    </div>

                    </Modal>

                    { cartLines.length > 0 && <button className={`btn btn-secondary btn-modal`} onClick={() => onAddGift()}>
                        Checkout
                    </button>}

                    <Footer />
            </Page>        
        </div>
    );
}