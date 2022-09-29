import { useState } from "react";
import Communication from "./Communication.client";
import { flattenConnection } from '@shopify/hydrogen';
import Modal from "react-modal/lib/components/Modal";

export default function PersonalInfo(props) {

    const [editingPersonal, setEditingPersonal] = useState(false);

    const { customer, handleUpdatePersonal, handleUpdateCommunication, handleUpdateAddress } = props;
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
    const [modalAddressDefault, setModalAddressDefault] = useState(null);
    const [modalFirstName, setModalFirstName] = useState("");
    const [modalLastName, setModalLastName] = useState("");
    const [modalAddress1, setModalAddress1] = useState("");
    const [modalAddress2, setModalAddress2] = useState("");
    const [modalCity, setModalCity] = useState("");
    const [modalProvince, setModalProvince] = useState("");
    const [modalZip, setModalZip] = useState("");

    const formattedPhoneNumber = number => {
        let cleaned = ('' + number).replace(/\D/g, '');
        
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
    }

    const dismissModals = () => {
        setEditingPersonal(false);
    }

    const updateFields = () => {
        handleUpdatePersonal(firstNameState, lastNameState, emailState, phoneState);
        dismissModals();
    }

    const openAddressModal = address => {
        setModalAddress(address);
        setModalAddressDefault(address.isDefaultAddress);
        setModalFirstName(address.firstName);
        setModalLastName(address.lastName);
        setModalAddress1(address.address1);
        setModalAddress2(address.address2);
        setModalCity(address.city);
        setModalProvince(address.province);
        setModalZip(address.zip);
        setShowingAddressModal(true)
    }

    const removeAddress = addressId => {
        // TODO: remove address call
    }

    const submitUpdateAddress = () => {
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
            phone: modalAddress.phone,
            isDefaultAddress: modalAddressDefault,
        });

        clearModalValues();
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
    }

    const addresses = flattenConnection(customer?.addresses) || [];
    let defaultAddr;

    addresses.forEach(addr => {
        if (defaultAddress.id === addr.id) {
            defaultAddr = addr;
        }
    });

    return (
        <div className="account-information">
            <h1>Account Information</h1>

            { !editingPersonal && 
                <section>
                    <button onClick={() => setEditingPersonal(true)}>Edit</button>
                    <h2>First Name: {firstName}</h2>
                    <h2>Last Name: {lastName}</h2>
                    <h2>Email: {email}</h2>
                    <h2>Phone Number: {formattedPhoneNumber(phone)}</h2>
                    <button className="btn btn-default">Reset Password</button>
                </section>
            }

            { editingPersonal && 
                <section>
                    <input value={firstNameState} onChange={e => setFirstNameState(e.target.value)}/>
                    <input value={lastNameState} onChange={e => setLastNameState(e.target.value)}/>
                    <input value={emailState} onChange={e => setEmailState(e.target.value)}/>
                    <input value={formattedPhoneNumber(phoneState)} onChange={e => setPhoneState(e.target.value)}/>

                    <button onClick={() => updateFields()}>Update</button>
                    <button onClick={() => dismissModals()}>Cancel</button>
                </section>
            }
        

            <hr></hr>

            <Communication 
                acceptsMarketing={acceptsMarketing}
                receiveConsent={receiveConsent}
                handleUpdateCommunication={(value) => handleUpdateCommunication(value)}           
            /> 

            <h1>Saved Addresses</h1>

            <article>
                <p><b>Default Address</b></p>
                <p>{defaultAddr.name}</p>
                <p>{defaultAddr.address1}</p>
                {defaultAddr.address2 !== "" && <p>{defaultAddr.address2}</p>}
                {defaultAddr.company !== "" && <p>{defaultAddr.company}</p>}
                <p>{defaultAddr.city}, {defaultAddr.provinceCode} {defaultAddr.zip}</p>
                <p><a href="#" onClick={() => openAddressModal(defaultAddr)}>Edit</a> | <a onClick={() => removeAddress(defaultAddr.id)}>Remove</a></p>
            </article>

            {addresses.map((addr, index) => {
                if (addr.id !== defaultAddr.id) {
                    return <article>
                    <p><b>Address {index+1}</b></p>
                    <p>{addr.name}</p>
                    <p>{addr.address1}</p>
                    {addr.address2 !== "" && <p>{addr.address2}</p>}
                    {addr.company !== "" && <p>{addr.company}</p>}
                    <p>{addr.city}, {addr.provinceCode} {addr.zip}</p>
                    <p><a href="#" onClick={() => openAddressModal(addr)}>Edit</a> | <a onClick={() => removeAddress(defaultAddr.id)}>Remove</a></p>
                </article> 
                }
            })}

            <button className="btn btn-default">Add New Address</button>

            <Modal
                isOpen={showingAddressModal}
                onRequestClose={() => setShowingAddressModal(false)}
            >
                <label>First Name:</label>
                <input value={modalFirstName} onChange={e => setModalFirstName(e.target.value)}/>

                <label>Last Name:</label>
                <input value={modalLastName} onChange={e => setModalLastName(e.target.value)}/>

                <label>Address:</label>
                <input value={modalAddress1} onChange={e => setModalAddress1(e.target.value)}/>

                <label>Address 2:</label>
                <input value={modalAddress2} onChange={e => setModalAddress2(e.target.value)}/>

                <label>City:</label>
                <input value={modalCity} onChange={e => setModalCity(e.target.value)}/>

                <label>State:</label>
                <input value={modalProvince} onChange={e => setModalProvince(e.target.value)}/>

                <label>ZIP:</label>
                <input value={modalZip} onChange={e => setModalZip(e.target.value)}/>

                <button onClick={(modalAddressId) => submitUpdateAddress(modalAddressId)}>Submit</button>
                <button onClick={() => setShowingAddressModal(false)}>Cancel</button>
            </Modal>

        </div>
    );
}