import { useState } from "react";

export default function PersonalInfo(props) {

    const [editingPersonal, setEditingPersonal] = useState(false);

    const { customer, handleUpdatePersonal } = props;
    const {
        firstName,
        lastName,
        acceptsMarketing,
        email,
        phone,
        id,
        addresses
    } = customer;

    const [firstNameState, setFirstNameState] = useState(firstName);
    const [lastNameState, setLastNameState] = useState(lastName);
    const [emailState, setEmailState] = useState(email);
    const [phoneState, setPhoneState] = useState(phone);

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

            <h1>Saved Addresses</h1>

            <article>
                <h2>Default Address</h2>
                <p>{addresses[0].address1}</p>
                {addresses[0].address2 !== "" && <p>{addresses[0].address2}</p>}
                <p>{addresses[0].city}, {addresses[0].state} {addresses[0].zip}</p>

                <button className="btn btn-default">Add New Address</button>
            </article>

            { addresses.length === 2 &&
                <article>
                    <h2>Address 2</h2>
                    <p>{addresses[1].address1}</p>
                    {addresses[1].address2 !== "" && <p>{addresses[1].address2}</p>}
                    <p>{addresses[1].city}, {addresses[1].state} {addresses[1].zip}</p>
                </article> 
            }
        </div>
    );
}