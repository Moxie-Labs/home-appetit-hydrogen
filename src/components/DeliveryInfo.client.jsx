// import { Card, Heading, Page, ChoiceList, Select, Subheading, Stepper, TextField, Checkbox } from "@shopify/polaris";
import React, {useCallback, useState} from 'react';
import map from "../assets/map.png";
import iconEdit from "../assets/icon-edit.png";
import plusIcon from "../assets/icon-plus-alt.png";
import { Checkbox } from './Checkbox.client';
import { useRenderServerComponents } from '~/lib/utils';
import { Radio } from './Radio.client';

export default function DeliveryInfo(props) {

    const {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        address,
        address2,
        city,
        deliveryState,
        zipcode,
        zipcodeCheck,
        instructions,
        extraIce,
        isGift,
        giftMessage,
        agreeToTerms,
        receiveTexts,
        handleFirstNameChange,
        handleLastNameChange,
        handleEmailChange,
        handlePhoneNumberChange,
        handleAddressChange,
        handleAddress2Change,
        handleCityChange,
        handleZipcodeChange,
        handleStateChange,
        handleInstructionChange,
        handleExtraIce,
        handleIsGift,
        handleGiftMessage,
        handleAgreeToTerms,
        handleReceiveTexts,
        handleContinue,
        handleCancel,
        step,
        currentStep,
        isGuest,
        isEditing,
        setIsEditing,
        autocompleteFunc,
        addresses
    } = props;

    const renderServerComponents = useRenderServerComponents();

    const [validationErrors, setValidationErrors] = useState({});
    const [newAddress, setNewAddress] = useState(false);
    const [addressId, setAddressId] = useState();

    const listOfStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    const stateOptions = listOfStates.map((state, i) => {
        return <option key={i} value={state}>{state}</option>
    });

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

    const formattedPhoneNumber = number => {
        if (number === null || number.length < 1)
            return null;

        let match = number.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match && number.length > 9) {
            let intlCode = '+1';
            return [intlCode, match[1], match[2], match[3]].join('')
        } else {
            return number;
        }
    }

    const displayPhoneNumber = number => {
        let cleaned = ('' + number).replace(/\D/g, '');
        
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
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

    const onZipcodeChange = (event) => {
        handleZipcodeChange(event.target.value);
    }

    const onInstructionChange = (event) => {
        handleInstructionChange(event.target.value);
    }

    function handleAddAddress(newAddress) {
        const {
            id,
            firstName,
            lastName,
            phone,
            address1,
            address2,
            country,
            province,
            city,
            zip,
        } = newAddress;

        callAddAddressApi({
            id,
            firstName,
            lastName,
            phone,
            address1,
            address2,
            country,
            province,
            city,
            zip,
        });

        renderServerComponents();
    }

    const onClickContinue = (event) => {
        const errors = getFormErrors();
        if (Object.keys(errors).length === 0) {
            setIsEditing(false);
            setValidationErrors({});
            if (addresses.length > 1){
                handleAddAddress({
                    id: addressId,
                    firstName: firstName,
                    lastName: lastName,
                    email: emailAddress,
                    phone: phoneNumber,
                    address1: address,
                    address2: address2,
                    city: city,
                    province: deliveryState,
                    country: 'United States',
                    zip: zipcode,
                });
            }
            handleContinue;
        } else {
            setValidationErrors(errors);
        }
    }

    const onClickSubmit = (event) => {
        const errors = getFormErrors();
        if (Object.keys(errors).length === 0) {
            setIsEditing(false);
            setNewAddress(false);
            setValidationErrors({});    
            handleAddAddress({
                firstName: firstName,
                lastName: lastName,
                email: emailAddress,
                phone: phoneNumber,
                address1: address,
                address2: address2,
                city: city,
                province: deliveryState,
                country: 'United States',
                zip: zipcode,
            });
        } else {
            setValidationErrors(errors);
        }
    }

    const onClickCancel = () => {
            setIsEditing(false);
            setNewAddress(false);
            setValidationErrors({});
            handleAddressChange(addresses[0].address1);
            handleAddress2Change(addresses[0].address2);
            handleCityChange(addresses[0].city);
            handleStateChange(addresses[0].province);
            handleZipcodeChange(addresses[0].zip);
        }

    const getFormErrors = () => {
        const errors = {};
        if (firstName.length < 3)
            errors.firstName = "Please enter a valid First Name.";
        if (firstName.length < 1)
            errors.firstName = "Please enter First Name."
        if (lastName.length < 3)
            errors.lastName = "Please enter a valid Last Name.";
        if (lastName.length < 1)
            errors.lastName = "Please enter Last Name."
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)))
            errors.emailAddress = "Please enter a valid Email Address.";
        if (emailAddress.length < 1)
            errors.emailAddress = "Please enter Email Address."
        if (phoneNumber.length < 10)
            errors.phoneNumber = "Please enter a valid Phone Number.";
        if (phoneNumber.length < 1)
            errors.phoneNumber = "Please enter Phone number."
        if (address.length < 5)
            errors.address = "Please enter a valid Address.";
        if (address.length < 1)
            errors.address = "Please enter Address."
        if (city.length < 3)
            errors.city = "Please enter a valid City.";
        if (city.length < 1)
            errors.city = "Please enter City."
        if (deliveryState === "")
            errors.deliveryState = "Please choose a State.";
        if (deliveryState.length < 1)
            errors.deliveryState = "Please choose a State."
        if (zipcode.length < 5)
            errors.zipcode = "Please enter a valid Zip Code.";
        if (zipcode.length < 1)
            errors.zipcode = "Please enter ZIP code."
        if (zipcodeCheck === undefined)
            errors.zipcode = "This ZIP code is not in our delivery zone.";

        return errors;

    }

    const errorList = Object.values(validationErrors).map((error, i) => {
        return <li key={i}>{error}</li>;
    });

    const addressSelection = index => {
        setAddressId(addresses[index].id)
        handleAddressChange(addresses[index].address1);
        handleAddress2Change(addresses[index].address2);
        handleCityChange(addresses[index].city);
        handleStateChange(addresses[index].province);
        handleZipcodeChange(addresses[index].zip);
     };

    const onClickAddNew = () => {
        setIsEditing(true);
        setNewAddress(true);
        handleAddressChange('');
        handleAddress2Change('');
        handleCityChange('');
        handleStateChange('');
        handleZipcodeChange('');
    }

    
    return (
        <div className={`checkout-section checkout--delivery-info ${currentStep === step ? '' : 'disabled'}`}>
            { currentStep === step && !isEditing &&
                <div>
                    <section className="checkout--deliveryinfo-top">
                        <h3 className="subheading ha-h3">Contact & Delivery Information { currentStep !== step && <span onClick={() => setIsEditing(true)}> <img src={iconEdit} width={65} className="iconEdit" /></span>}</h3>
                        <div className="contact-info">
                            <p>{firstName} {lastName}</p>
                            <p>{displayPhoneNumber(phoneNumber)}</p>
                            {
                            addresses.length > 1 ? 
                            addresses.map((addr, index) => {
                                    return <div key={addr.id} className="contact-info">
                                                <Radio name="address" handleClick={() => addressSelection(index)} isChecked={addr.id === addressId} label={`${addr.address1} ${(addr.address2 !== "" && addr.address2 !== null) ? addr.address2 : ''} ${addr.city}, ${addr.provinceCode} ${addr.zip}`}/>
                                            </div>      
                                        })
                            :
                            <div>
                                <p>{emailAddress}</p>
                                { address.length > 0 && <p>{address}, {deliveryState} {zipcode}</p> }
                            </div>
                            }
                        </div>
                        {isGuest ? <></> : <button className="btn btn-default" onClick={onClickAddNew}><img className='img-add-address' src={plusIcon}/>Add New Address</button>}
                    </section>

                    <label className="delivery-window_label">Delivery Instructions</label>
                    <section className="checkout--deliveryinfo-top">
                        <textarea className="order_textarea" name="instructions" value={instructions} onChange={onInstructionChange} placeholder={"Enter instructions for finding or delivering to your location"} rows="6"></textarea>
                    </section>

                    {/* OPTION PLACEHOLDER */}
                    <div className="contact-option">
                        <Checkbox
                            label="Include extra ice"
                            price="$5.00"
                            checked={extraIce}
                            handleClick={() => handleExtraIce(!extraIce)}
                        />
                        <Checkbox
                            label="This order is a gift"
                            price=""
                            checked={isGift}
                            handleClick={() => handleIsGift(!isGift)}
                        />

                        { isGift &&
                            <section className="checkout--deliveryinfo-top">
                                <label className='delivery-window_label'>Gift Message
                                        <textarea className="order_textarea" type="textarea" name="gift_note" value={giftMessage} onChange={e => handleGiftMessage(e.target.value)} placeholder={"Gift Message (optional)"} rows="6"></textarea>
                                </label> 
                            </section>
                        }
                    </div>

                </div>
            }

            { currentStep === step && isEditing &&
                <div>
                    <section className="checkout--deliveryinfo-top">
                        <h3 className="subheading ha-h3">Contact & Delivery Information</h3>
                        <h3 className="subheading ha-h5">CONTACT INFORMATION</h3>
                        <div className="checkout--form-container">
                            <div className="checkout--form-field-col">
                                <label>First Name:
                                    <input className={`order_textfield${validationErrors.firstName !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[A-Za-z'-]/.test(e.key) && e.preventDefault()} type="text" name="firstname" value={firstName} onChange={onFirstNameChange} placeholder={"First Name (Required)"}/>
                                    {validationErrors.firstName !== undefined ? <p className='form-errors'>{validationErrors.firstName}</p> : <p className='form-errors'></p>}
                                </label>
                                <label>Last Name:
                                    <input className={`order_textfield${validationErrors.lastName !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[A-Za-z'-]/.test(e.key) && e.preventDefault()} type="text" name="lastname" value={lastName} onChange={onLastNameChange} placeholder={"Last Name (Required)"}/>
                                    {validationErrors.lastName !== undefined ? <p className='form-errors'>{validationErrors.lastName}</p> : <p className='form-errors'></p>}
                                </label>
                            </div>

                            <div className="checkout--form-field-col">
                                <label>Email:
                                    <input className={`order_textfield${validationErrors.emailAddress !== undefined ? ' input-error' : ''}`} type="text" name="email" value={emailAddress} onChange={onEmailChange} placeholder={"Email Address (Required)"}/>
                                    {validationErrors.emailAddress !== undefined ? <p className='form-errors'>{validationErrors.emailAddress}</p> : <p className='form-errors'></p>}
                                </label>

                                <label>Phone Number:
                                    <input className={`order_textfield${validationErrors.phoneNumber !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxlength="12" type="phone" name="phone" value={formattedPhoneNumber(phoneNumber)} onChange={onPhoneNumberChange} placeholder={"Phone Number (Required)"}/>
                                    {validationErrors.phoneNumber !== undefined ? <p className='form-errors'>{validationErrors.phoneNumber}</p> : <p className='form-errors'></p>}
                                </label>
                            </div>
                        </div>

                        <div className="contact-option">
                            <Checkbox
                                label="I agree to laoreet aliquet proin mattis quis ut nulls lac us vitae orci quis varius laspe."
                                checked={agreeToTerms}
                                handleClick={() => handleAgreeToTerms(!agreeToTerms)}
                            />
                            <Checkbox
                                label="Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius denutp."
                                checked={receiveTexts}
                                handleClick={() => handleReceiveTexts(!receiveTexts)}
                            />
                        </div>
                    </section>

                    <section className="checkout--deliveryinfo-top">
                        <h3 className="subheading ha-h5">DELIVERY ADDRESS</h3>

                        <div className="checkout--form-container">
                            <div className="checkout--form-field-col">
                                <label>Address:
                                    <input id='autocomplete' className={`order_textfield${validationErrors.address !== undefined ? ' input-error' : ''}`} type="text" name="address" value={address} onChange={onAddressChange} onFocus={autocompleteFunc} placeholder={"Address (Required)"}/>
                                    {validationErrors.address !== undefined ? <p className='form-errors'>{validationErrors.address}</p> : <p className='form-errors'></p>}
                                </label>

                                <label>Address 2:
                                    <input className="order_textfield" type="text" name="address2" value={address2} onChange={onAddress2Change} placeholder={"Address 2"}/>
                                </label>
                            </div>

                            <div className="checkout--form-field-col">
                                <label>City:
                                    <input className={`order_textfield${validationErrors.city !== undefined ? ' input-error' : ''}`} type="text" name="city" value={city} onChange={onCityChange} placeholder={"City (Required)"}/>
                                    {validationErrors.city !== undefined ? <p className='form-errors'>{validationErrors.city}</p> : <p className='form-errors'></p>}
                                </label>

                                <label>State:
                                    <select className={`order_delivery__dropdown order_select dropdown_state${validationErrors.deliveryState !== undefined ? ' input-error' : ''}`} value={deliveryState} onChange={onDeliveryStateChange}>
                                        <option value="" disabled selected>Select State</option>
                                        {stateOptions}
                                    </select>
                                    {validationErrors.deliveryState !== undefined ? <p className='form-errors'>{validationErrors.deliveryState}</p> : <p className='form-errors'></p>}
                                </label>
                            </div>
                        </div>

                        <div className="checkout--form-container">
                            <div className="checkout--form-field-col">
                                <label>ZIP:
                                    <input className={`order_textfield textfield_zip${validationErrors.zipcode !== undefined ? ' input-error' : ''}`} type="text" name="zipcode" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={zipcode} onChange={onZipcodeChange} placeholder={"ZIP Code (Required)"}/>
                                    {validationErrors.zipcode !== undefined ? <p className='form-errors'>{validationErrors.zipcode}</p> : <p className='form-errors'></p>}
                                </label>
                            </div>
                        </div>

                        <label>Delivery instructions
                            <textarea className="order_textarea" type="textarea" name="instructions" value={instructions} onChange={onInstructionChange} placeholder={"Delivery Instructions"} rows="6"></textarea>
                        </label>

                        <div className="contact-option edit-state">
                            <Checkbox
                                label="Include extra ice $5.00"
                                checked={extraIce}
                                handleClick={() => handleExtraIce(!extraIce)}
                            />
                            <Checkbox
                                label="This order is a gift"
                                checked={isGift}
                                handleClick={() => handleIsGift(!isGift)}
                            />

                            { isGift &&
                                <section className="checkout--deliveryinfo-top">
                                    <label className='delivery-window_label'>Gift Message
                                            <textarea className="order_textarea" type="textarea" name="gift_note" value={giftMessage} onChange={e => handleGiftMessage(e.target.value)} placeholder={"Gift Message (optional)"} rows="6"></textarea>
                                    </label> 
                                </section>
                            }
                        </div>
                    </section>

                    {/* <section className="checkout--deliveryinfo-image">
                        <img className="img img-map" src={map.src} />
                    </section> */}


                    <section className="checkout--deliveryinfo-actions">
                        {newAddress ? 
                        <div className='add-new-address'>
                            <button className="btn btn-confirm btn-primary-small btn-app" onClick={onClickSubmit}>
                                CONTINUE
                            </button> 
                            <button className="btn btn-confirm btn-secondary-small btn-app" onClick={onClickCancel}>
                                CANCEL
                            </button> 
                        </div>
                        : 
                        <button className="btn btn-confirm btn-primary-small btn-app" onClick={onClickContinue}>
                            CONTINUE
                        </button>}

                        {/* <button className="btn btn-primary btn-app" onClick={handleCancel}>
                            Cancel
                        </button> */}
                    </section>
                </div>

            }

            { currentStep !== step &&
                <div>
                    <section className="checkout--deliveryinfo-top">
                        <h3 className="subheading ha-h3">Contact & Delivery Information <span disabled={currentStep === step} onClick={() => setIsEditing(true)}> {currentStep === step && <img src={iconEdit} width={65} className="iconEdit" />}</span></h3>
                        <div className="contact-info">
                            <p>{firstName} {lastName}</p>
                            <p>{displayPhoneNumber(phoneNumber)}</p>
                            {
                            addresses.length > 1 ? 
                            addresses.map((addr, index) => {
                                    return <div key={addr.id} className="contact-info">
                                            <Radio name="address" handleClick={() => addressSelection(index)} isChecked={addr.id === addressId} label={`${addr.address1} ${(addr.address2 !== "" && addr.address2 !== null) ? addr.address2 : ''} ${addr.city}, ${addr.provinceCode} ${addr.zip}`}/>
                                        </div>      
                                        })
                            :
                            <div>
                                <p>{emailAddress}</p>
                                <p>{address}, {deliveryState} {zipcode}</p>
                            </div>
                            }
                        </div>
                    </section>

                <section className="checkout--deliveryinfo-top">
                    <label className="delivery-window_label">Delivery Instructions</label>
                    <textarea className="order_textarea" name="instructions" value={instructions} onChange={onInstructionChange} placeholder={"Enter instructions for finding or delivering to your location"} rows="6"></textarea>
                </section>
                <div className="contact-option edit-state">
                    <Checkbox
                        label="Include extra ice $5.00"
                        checked={extraIce}
                        handleClick={() => handleExtraIce(!extraIce)}
                    />
                    <Checkbox
                        label="This order is a gift"
                        checked={isGift}
                        handleClick={() => handleIsGift(!isGift)}
                    />

                    { isGift && 
                        <section className="checkout--deliveryinfo-top">
                            <label className='delivery-window_label'>Gift Message
                                    <textarea className="order_textarea" type="textarea" name="gift_note" value={giftMessage} onChange={e => handleGiftMessage(e.target.value)} placeholder={"Gift Message (optional)"} rows="6"></textarea>
                                </label>
                            </section>
                        }


                    </div>
                </div>
            }

            <hr></hr>

            <div className="place-order-container">
                <button className= {`btn btn-primary-small btn-place-order${isEditing ? ' disabled' : ''}`} disabled={address.length === 0} onClick={handleContinue}>
                    CONTINUE TO PAYMENT
                </button>
            </div>    

            
        </div>
    );
}

export async function callAddAddressApi({
    id,
    firstName,
    lastName,
    address1,
    address2,
    country,
    province,
    city,
    phone,
    zip,
  }) {
    try {
      const res = await fetch(
        id ? `/account/address/${encodeURIComponent(id)}` : '/account/address',
        {
          method: id ? 'PATCH' : 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
          }),
        },
      );
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    } catch (_e) {
      return {
        error: 'Error saving address. Please try again.',
      };
    }
  }