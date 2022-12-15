import { useState } from "react";
import Communication from "./Communication.client";
import { flattenConnection } from '@shopify/hydrogen';
import Modal from "react-modal/lib/components/Modal";
import { Checkbox } from "../Checkbox.client";
import editIcon from "../../assets/icon-edit-alt.png";
import { emailValidation } from "../../lib/utils";


export default function PersonalInfo(props) {

    const [editingPersonal, setEditingPersonal] = useState(false);

    const { 
        customer,
        zipcodeArr, 
        handleUpdatePersonal, 
        handleUpdateCommunication, 
        handleUpdateAddress,
        handleRemoveAddress,
        handleNewAddress,
        handleUpdateDefault
    } = props;
    const {
        firstName,
        lastName,
        acceptsMarketing,
        email,
        phone,
        receiveConsent,
        defaultAddress
    } = customer;

    const [firstNameState, setFirstNameState] = useState(firstName);
    const [lastNameState, setLastNameState] = useState(lastName);
    const [emailState, setEmailState] = useState(email);
    const [phoneState, setPhoneState] = useState(phone);

    // values set when editing address
    const [showingAddressModal, setShowingAddressModal] = useState(false);
    const [modalAddress, setModalAddress] = useState(null);
    const [modalAddressTitle, setModalAddressTitle] = useState(null);
    const [modalAddressDefault, setModalAddressDefault] = useState(null);
    const [modalFirstName, setModalFirstName] = useState("");
    const [modalLastName, setModalLastName] = useState("");
    const [modalAddress1, setModalAddress1] = useState("");
    const [modalAddress2, setModalAddress2] = useState("");
    const [modalCity, setModalCity] = useState("");
    const [modalProvince, setModalProvince] = useState("");
    const [modalZip, setModalZip] = useState("");
    const [modalPhone, setModalPhone] = useState("");

    // Modal will submit new address instead of sending an update request
    const [newAddressModal, setNewAddressModal] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    const formattedPhoneNumber = number => {
        let cleaned = ('' + number).replace(/\D/g, '');
        
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
            return ['(', match[2], ') ', match[3], '-', match[4]].join('')
        }
    }

    const compressPhoneNumber = number => {
        let retval = null;
        if (number !== null) {
            retval = "+1";
            retval += number.replace(/[^+\d]+/g, "");
        }
        return retval;
    }

    const modalFormattedPhoneNumber = number => {
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

    const dismissModals = () => {
        setEditingPersonal(false);
    }

    const updateFields = () => {
        const errors = validateFields();
        if (Object.keys(errors).length === 0) {
            handleUpdatePersonal(firstNameState, lastNameState, emailState, compressPhoneNumber(phoneState));
            dismissModals();
            setFieldErrors({})
        } else {
            setFieldErrors(errors);
        }
    }

    const validateFields = () => {
        let newFieldErrors = {};
        if (firstNameState.length < 3)
            newFieldErrors.firstNameState = "Please enter a valid First Name.";
        if (firstNameState.length < 1)
            newFieldErrors.firstNameState = "Please enter First Name."
        if (lastNameState.length < 3)
            newFieldErrors.lastNameState = "Please enter a valid Last Name.";
        if (lastNameState.length < 1)
            newFieldErrors.lastNameState = "Please enter Last Name."
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            newFieldErrors.emailState = "Please enter a valid Email Address.";
        if (emailState.length < 1)
            newFieldErrors.emailState = "Please enter Email Address."
        if (formattedPhoneNumber(phoneState).length < 14)
            newFieldErrors.phoneState = "Please enter a valid Phone Number.";
        if (phoneState.length < 1)
            newFieldErrors.phoneState = "Please enter Phone number."

        return newFieldErrors;
    }

    const addressesSection = customer.addresses.length > 0 ? <section>
        <h1 className="address-title">Saved Addresses</h1>
            <article>
                <h2 className="default-address-label">Default Address</h2>
                <div className="address">
                    <p>{addresses[0].address1}</p>
                    {addresses[0].address2 !== "" && <p>{addresses[0].address2}</p>}
                    <p>{addresses[0].city}, {addresses[0].state} {addresses[0].zip}</p>
                </div>
            </article>

            { addresses.length === 2 &&
                <article>
                    <h2>Address 2</h2>
                    <div className="address">
                        <p>{addresses[1].address1}</p>
                        {addresses[1].address2 !== "" && <p>{addresses[1].address2}</p>}
                        <p>{addresses[1].city}, {addresses[1].state} {addresses[1].zip}</p>
                    </div>
                </article> 
            }
    </section> : null;
    const openAddressModal = (address, title) => {
        setModalAddress(address);
        setModalAddressTitle(title);
        setModalAddressDefault(address.isDefaultAddress);
        setModalFirstName(address.firstName);
        setModalLastName(address.lastName);
        setModalAddress1(address.address1);
        setModalAddress2(address.address2);
        setModalCity(address.city);
        setModalProvince(address.province);
        setModalZip(address.zip);
        setModalPhone(address.phone);
        setShowingAddressModal(true)
    }

    const removeAddress = addressId => {
        handleRemoveAddress(addressId);
    }

    const makeAddressDefault = address => {
        address.isDefaultAddress = true;
        handleUpdateDefault(address);
    }

    const submitUpdateAddress = () => {
        const errors = getFormErrors();
        if (Object.keys(errors).length === 0) {
            setShowingAddressModal(false);
            clearModalValues();
            setValidationErrors({});
            handleUpdateAddress({
                id: modalAddress.id,
                firstName: modalFirstName,
                lastName: modalLastName,
                address1: modalAddress1,
                address2: modalAddress2,
                province: modalProvince,
                city: modalCity,
                zip: modalZip,
                country: modalAddress.country,
                phone: modalPhone,
                isDefaultAddress: modalAddressDefault,
            });
        } else {
            setValidationErrors(errors);
        }
    }

    const submitNewAddress = () => {
        const errors = getFormErrors();
        if (Object.keys(errors).length === 0) {
            setShowingAddressModal(false);
            clearModalValues();
            setValidationErrors({});
            handleNewAddress({
                firstName: modalFirstName,
                lastName: modalLastName,
                address1: modalAddress1,
                address2: modalAddress2,
                province: modalProvince,
                city: modalCity,
                zip: modalZip,
                country: "United States",
                phone: modalPhone,
                isDefaultAddress: modalAddressDefault,
            });
        } else {
            setValidationErrors(errors);
        }
    }

    const handleCancel = () => {
        setShowingAddressModal(false);
        setValidationErrors({});
    }

    const clearModalValues = () => {
        setModalAddress(null);
        setModalAddressDefault(null);
        setModalFirstName("");
        setModalLastName("");
        setModalAddress1("");
        setModalAddress2("");
        setModalCity("");
        setModalProvince("");
        setModalZip("");
        setModalPhone("");
        setNewAddressModal(false);
    }

    const prepareNewAddress = () => {
        clearModalValues();
        setNewAddressModal(true);
        setShowingAddressModal(true);
    }

    const closeAddressModal = () => {
        setShowingAddressModal(false);
        clearModalValues();
        setValidationErrors({});
    }

    const addresses = flattenConnection(customer?.addresses) || [];

    let defaultAddr;

    addresses.forEach(addr => {
        if (defaultAddress.id === addr.id) {
            defaultAddr = addr;
        }
    });

    const listOfStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    const stateOptions = listOfStates.map((state, i) => {
        return <option key={i} value={state}>{state}</option>
    });

    const handlePlaceSelect = () => {
        let addressObject = autocomplete.getPlace()
        let address = addressObject.address_components;
        setModalAddress1(`${address[0].long_name} ${address[1].long_name}`);
        address.map(item => {
            if(item.types[0] === 'locality')
            setModalCity(item.long_name);
            if(item.types[0] === 'administrative_area_level_1')
            setModalProvince(item.long_name);
            if(item.types[0] === 'postal_code')
            setModalZip(item.long_name);
        })
    }

    let autocomplete;

    const autocompleteFunc = () => {
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})
        autocomplete.addListener("place_changed", handlePlaceSelect);
    };

    let addressCount = 1;

    const zipcodeCheck = zipcodeArr.find(e => e.includes(modalZip));

    const getFormErrors = () => {
        const errors = {};
        if (modalFirstName.length < 3)
            errors.modalFirstName = "Please enter a valid First Name.";
        if (modalFirstName.length < 1)
            errors.modalFirstName = "Please enter First Name."
        if (modalLastName.length < 3)
            errors.modalLastName = "Please enter a valid Last Name.";
        if (modalLastName.length < 1)
            errors.modalLastName = "Please enter Last Name."
        if (modalPhone.length < 10)
            errors.modalPhone = "Please enter a valid Phone Number.";
        if (modalPhone.length < 1)
            errors.modalPhone = "Please enter Phone number."
        if (modalAddress1.length < 5)
            errors.modalAddress1 = "Please enter a valid Address.";
        if (modalAddress1.length < 1)
            errors.modalAddress1 = "Please enter Address."
        if (modalCity.length < 3)
            errors.modalCity = "Please enter a valid City.";
        if (modalCity.length < 1)
            errors.modalCity = "Please enter City."
        if (modalProvince === "")
            errors.modalProvince = "Please choose a State.";
        if (modalProvince.length < 1)
            errors.modalProvince = "Please choose a State."
        if (modalZip.length < 5)
            errors.modalZip = "Please enter a valid ZIP Code.";
        if (modalZip.length < 1)
            errors.modalZip = "Please enter ZIP code."
        if (zipcodeCheck === undefined)
            errors.modalZip = "This ZIP code is not in our delivery zone.";

        return errors;

    }

    return (
        <div className="account-information">

            { !editingPersonal && 
                <section>            
                    <button className="btn btn-default btn-edit" onClick={() => setEditingPersonal(true)}>Edit<img src={editIcon} width="24"/></button>
                     <div className="personal-info-wrapper">
                        <h5 className="ha-h5 text-uppercase no-margin">Account information</h5>
                        <div className="info-row">
                            <h2><span className="info-label">First Name:</span><br /> {firstName}</h2>
                            <h2><span className="info-label">Last Name:</span><br />  {lastName}</h2>
                        </div>
                        <div className="info-row">
                            <h2 className="personal-info-header personal-info-header--email"><span className="info-label">Email:</span><br />  {email}</h2>
                            <h2><span className="info-label info-label--phone">Phone Number:</span> <br /> {formattedPhoneNumber(phone)}</h2>
                        </div>
                    </div>
                    <button className="btn btn-default btn-reset">Reset Password</button>
                </section>
            }

            { editingPersonal && 
                <section>
                     <div className="personal-info-wrapper edit-wrapper">
                     <h5 className="ha-h5 text-uppercase no-margin">Account information</h5>
                        <div className="info-row">
                            <label className="info-label-field">First Name:
                              <input value={firstNameState} className={`modal-address-field${fieldErrors.firstNameState !== undefined ? ' input-error' : ''}`} onChange={e => setFirstNameState(e.target.value)}/>
                              {fieldErrors.firstNameState !== undefined && <p className='form-errors'>{fieldErrors.firstNameState}</p>}
                            </label>
                            <label className="info-label-field">Last Name:
                              <input value={lastNameState} className={`modal-address-field${fieldErrors.lastNameState !== undefined ? ' input-error' : ''}`} onChange={e => setLastNameState(e.target.value)}/>
                              {fieldErrors.lastNameState !== undefined && <p className='form-errors'>{fieldErrors.lastNameState}</p>}
                            </label>
                            {/* placeholder */}
                            {/* <h2><span className="info-label">Birthdate:</span><br />  12/21/1982</h2> */}
                            {/* end placeholder */}
                        </div>
                    <div className="info-row row-2">
                        <label className="info-label-field email-label">Email:
                           <input className={`modal-address-field${fieldErrors.emailState !== undefined ? ' input-error' : ''}`} value={emailState} onChange={e => setEmailState(e.target.value)}/>
                           {fieldErrors.emailState !== undefined && <p className='form-errors'>{fieldErrors.emailState}</p>}
                        </label>

                        <label className="info-label-field phone-label">Phone Number:
                            <input className={`modal-address-field${fieldErrors.phoneState !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxlength="14" value={formattedPhoneNumber(phoneState)} onChange={e => setPhoneState(e.target.value)}/>
                            {fieldErrors.phoneState !== undefined && <p className='form-errors'>{fieldErrors.phoneState}</p>}
                        </label>
                    </div>

                    <button className="btn btn-default btn-primary-small" onClick={() => updateFields()}>Update</button>
                    <button className="btn btn-default" onClick={() => dismissModals()}>Cancel</button>
                    </div>
                </section>
            }

<div className="line-separator"></div>

            <section className="account__address-info">
                <h1>Saved Addresses</h1>

                <div className="account__address-inner">
                { defaultAddr !== undefined && <article className="account__address account__address--default">
                    <p className="account__address-title">Default Address</p>
                    <p className="account__address-body">{defaultAddr.name}</p>
                    <p className="account__address-body">{defaultAddr.address1}</p>
                    {defaultAddr.address2 !== "" && <p>{defaultAddr.address2}</p>}
                    {defaultAddr.company !== "" && <p>{defaultAddr.company}</p>}
                    <p className="account__address-body">{defaultAddr.city}, {defaultAddr.provinceCode} {defaultAddr.zip}</p>
                    <p className="address-action-cta"><a href="#" onClick={() => openAddressModal(defaultAddr, "Default Address")}>Edit</a> | <a href="#" onClick={() => removeAddress(defaultAddr.id)}>Remove</a></p>
                </article> }


                {addresses.map(addr => {
                    if (addr.id !== defaultAddr.id) {
                        return <article key={addr.id} className="account__address">
                        <p className="account__address-title">Address {++addressCount}</p>
                        <p>{addr.name}</p>
                        <p>{addr.address1}</p>
                        {addr.address2 !== "" && <p>{addr.address2}</p>}
                        {addr.company !== "" && <p>{addr.company}</p>}
                        <p>{addr.city}, {addr.provinceCode} {addr.zip}</p>
                        <p><a href="#" onClick={() => openAddressModal(addr, `Address ${addressCount}`)}>Edit</a> | <a href="#" onClick={() => removeAddress(addr.id)}>Remove</a> | <a href="#" onClick={() => makeAddressDefault(addr)}>Make Default</a></p>
                    </article> 
                    }
                })}

            </div>
            <button className="btn btn-default new-address-cta" onClick={() => prepareNewAddress()}>Add New Address</button>

            <div className="line-separator"></div>

                <Modal
                    isOpen={showingAddressModal}
                    onRequestClose={() => closeAddressModal()}
                    className="modal-new-address"
                >
                    <h4 className="ha-h4 text-uppercase text-center no-margin">{modalAddressTitle}</h4>

                    <div className="new-address-wrapper">

                    <div className="field-row">
                        <div className="field">
                        <label>First Name:</label>
                        <input className={`modal-address-field${validationErrors.modalFirstName !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[A-Za-z'-]/.test(e.key) && e.preventDefault()} type="text" name="firstname" value={modalFirstName} onChange={e => setModalFirstName(e.target.value)} placeholder={"First Name (Required)"}/>
                        {validationErrors.modalFirstName !== undefined && <p className='form-errors'>{validationErrors.modalFirstName}</p>}
                        </div>

                        <div className="field">
                        <label>Last Name:</label>
                        <input className={`modal-address-field${validationErrors.modalLastName !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[A-Za-z'-]/.test(e.key) && e.preventDefault()} type="text" name="lastname" value={modalLastName} onChange={e => setModalLastName(e.target.value)} placeholder={"Last Name (Required)"}/>
                        {validationErrors.modalLastName !== undefined && <p className='form-errors'>{validationErrors.modalLastName}</p>}
                        </div>
                    </div>

                    <div className="field-row">
                    <div className="field">
                    <label>Phone Number:</label>
                    <input className={`modal-address-field${validationErrors.modalPhone !== undefined ? ' input-error' : ''}`} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxlength="12" type="phone" name="phone" value={modalFormattedPhoneNumber(modalPhone)} onChange={e => setModalPhone(e.target.value)} placeholder={"Phone Number (Required)"}/>
                    {validationErrors.modalPhone !== undefined && <p className='form-errors'>{validationErrors.modalPhone}</p>}
                    </div>
                    </div>

                    <div className="field">
                    <label>Address:</label>
                    <input id='autocomplete' className={`modal-address-field${validationErrors.modalAddress1 !== undefined ? ' input-error' : ''}`} type="text" name="address" value={modalAddress1} onChange={e => setModalAddress1(e.target.value)} onFocus={autocompleteFunc} placeholder={"Address (Required)"}/>
                    {validationErrors.modalAddress1 !== undefined && <p className='form-errors'>{validationErrors.modalAddress1}</p>}
                    </div>
                    
                    <div className="field">
                    <label>Address 2:</label>
                    <input className="modal-address-field" type="text" name="address2" value={modalAddress2} onChange={e => setModalAddress2(e.target.value)} placeholder={"Address 2"}/>
                    </div>

                    <div className="field-row">
                    <div className="field">
                    <label>City:</label>
                    <input className={`modal-address-field${validationErrors.modalCity !== undefined ? ' input-error' : ''}`} type="text" name="city" value={modalCity} onChange={e => setModalCity(e.target.value)} placeholder={"City (Required)"}/>
                    {validationErrors.modalCity !== undefined && <p className='form-errors'>{validationErrors.modalCity}</p>}
                    </div>

                    <div className="field">
                    <label>State:</label>
                    <select value={modalProvince} className={`modal-address-field${validationErrors.modalProvince !== undefined ? ' input-error' : ''}`} onChange={e => setModalProvince(e.target.value)}>
                        <option value="" disabled selected>Select State</option>
                        {stateOptions}
                    </select>
                    {validationErrors.modalProvince !== undefined && <p className='form-errors'>{validationErrors.modalProvince}</p>}
                    </div>

                    <div className="field">
                    <label>ZIP:</label>
                    <input className={`modal-address-field${validationErrors.modalZip !== undefined ? ' input-error' : ''}`} type="text" name="zipcode" onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={modalZip} onChange={e => setModalZip(e.target.value)} placeholder={"ZIP Code (Required)"}/>
                    {validationErrors.modalZip !== undefined && <p className='form-errors'>{validationErrors.modalZip}</p>}
                    </div>
                    </div>

                    <div className="modal-action">
                    { !newAddressModal && <button className="btn btn-primary-small" onClick={(modalAddressId) => submitUpdateAddress(modalAddressId)}>Update</button> }
                    { newAddressModal && <button className="btn btn-primary-small" onClick={() => submitNewAddress()}>Submit</button> }
                    <button className="btn btn-address-cancel" onClick={() => handleCancel()}>Cancel</button>
                    </div>
                    </div>
                </Modal>

                
            </section>

            {/* <Communication 
                acceptsMarketing={acceptsMarketing}
                receiveConsent={receiveConsent}
                handleUpdateCommunication={(value) => handleUpdateCommunication(value)}           
            />  */}
  
            <button className="btn btn-default new-address-cta">Update preferences</button>
            
        </div>
    );
}