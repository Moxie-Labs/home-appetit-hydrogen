import { useState } from "react";
import { Checkbox } from "../Checkbox.client";
import editIcon from "../../assets/icon-edit-alt.png";


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
                    <button className="btn btn-default btn-edit" onClick={() => setEditingPersonal(true)}>Edit<img src={editIcon} width="24"/></button>
                     <div className="personal-info-wrapper">
                        <div className="info-row">
                            <h2><span className="info-label">First Name:</span><br /> {firstName}</h2>
                            <h2><span className="info-label">Last Name:</span><br />  {lastName}</h2>
                            {/* placeholder */}
                            <h2><span className="info-label">Birthdate:</span><br />  12/21/1982</h2>
                            {/* end placeholder */}
                        </div>
                        <div className="info-row">
                            <h2><span className="info-label">Email:</span><br />  {email}</h2>
                            <h2><span className="info-label">Phone Number:</span> <br /> {formattedPhoneNumber(phone)}</h2>
                        </div>
                    </div>
                    <button className="btn btn-default">Reset Password</button>
                </section>
            }

            { editingPersonal && 
                <section>
                     <div className="personal-info-wrapper edit-wrapper">
                        <div className="info-row">
                            <label className="info-label-field">First Name:
                              <input value={firstNameState} onChange={e => setFirstNameState(e.target.value)}/>
                            </label>
                            <label className="info-label-field">Last Name:
                              <input value={lastNameState} onChange={e => setLastNameState(e.target.value)}/>
                            </label>
                            {/* placeholder */}
                            <h2><span className="info-label">Birthdate:</span><br />  12/21/1982</h2>
                            {/* end placeholder */}
                        </div>
                    <div className="info-row row-2">
                        <label className="info-label-field email-label">Email:
                           <input className="email-field" value={emailState} onChange={e => setEmailState(e.target.value)}/>
                        </label>

                        <label className="info-label-field phone-label">Phone Number:
                            <input className="phone-field" value={formattedPhoneNumber(phoneState)} onChange={e => setPhoneState(e.target.value)}/>
                        </label>
                    </div>

                    <button className="btn btn-default btn-primary-small" onClick={() => updateFields()}>Update</button>
                    <button className="btn btn-default" onClick={() => dismissModals()}>Cancel</button>
                    </div>
                </section>
            }
        

            <hr></hr>

            <h1 className="address-title">Saved Addresses</h1>

            <article>
                <h2 className="default-address-label">Default Address</h2>
                <div className="address">
                    <p>{addresses[0].address1}</p>
                    {addresses[0].address2 !== "" && <p>{addresses[0].address2}</p>}
                    <p>{addresses[0].city}, {addresses[0].state} {addresses[0].zip}</p>
                </div>

                <button className="btn btn-default">Add New Address</button>
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
       

        <hr></hr>

        <h1 className="address-title">Communication Preferences</h1>

        <Checkbox
            label="I agree to laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus."
        />

        <Checkbox
            label="Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus."
        />

        <Checkbox
            label="Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus."
        />

        </div>
    );
}