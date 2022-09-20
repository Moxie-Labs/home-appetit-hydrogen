import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import editIcon from "../../assets/icon-edit-alt.png";

export default function Payment(props) {

    const { customer, handleAddCard, handleRemoveCard } = props;
    const { payments, addresses } = customer;
    // const { payments } = props;

    const [showModal, setShowModal] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newName, setNewName] = useState("");
    const [newExpiry, setNewExpiry] = useState("");

    const paymentMethods = payments.map((payment, i) => {
        return (
            <div>
                <p className="payment-label">{ i === 0 ? 'Default Payment' : `Payment ${i+1}`}</p>
                    <article className="payment-method-unit" key={i}>  
                        <b>{payment.brand} {payment.maskedNumber}</b>
                        <p>Exp: {payment.expiryMonth}/{payment.expiryYear}</p>                   
                    </article>
                    <button className="btn-payment-edit" disabled>Edit</button> <span> | </span> <button className="btn-payment-remove" onClick={() => handleRemoveCard(i)}>Remove</button>
            </div>
        );
    });

    const onAddCard = (newCardNumber, newName, newExpiry) => {
        handleAddCard(newCardNumber, newName, newExpiry);
        setShowModal(false);
    }

    return (
        <div>
        <h1 className="ha-h5">Saved Payments</h1>
        <div className="payment-information">

            <div className="payment-method-wrapper">
                {paymentMethods}
            </div>

            <button className="btn btn-default btn-new-payment" onClick={() => setShowModal(!showModal)}>Add New Payment</button>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="modal-new-payment"
            >
                <h1 className="ha-h4">Default Payment</h1>

                <label>Card Number:</label>
                <input className="card-number-field" value={newCardNumber} onChange={e => setNewCardNumber(e.target.value)}/>

                <div className="modal-row">
                    <label>Name on Card:
                        <input value={newName} onChange={e => setNewName(e.target.value)}/>
                    </label>

                    <label>Expiration Date:
                    <input value={newExpiry} onChange={e => setNewExpiry(e.target.value)}/>
                    </label>
                </div>

                <div className="modal-billing-address">
                    <h5 className="ha-h5 ha-color-primary-text">Billing Address:</h5>
                    <button className="btn btn-default btn-edit btn-modal-edit">Edit <img src={editIcon} width="24"/></button>
                    <article>
                        <div className="address">
                            <p>{addresses[0].address1}</p>
                            {addresses[0].address2 !== "" && <p>{addresses[0].address2}</p>}
                            <p>{addresses[0].city}, {addresses[0].state} {addresses[0].zip}</p>
                        </div>
                    </article>
                </div>

                <div className="modal-row btn-wrapper">
                    <button className="btn btn-confirm btn-primary-small" onClick={(newCardNumber, newName, newExpiry) => onAddCard(newCardNumber, newName, newExpiry)}>Update</button>
                    <button className="btn btn-default" onClick={() => setShowModal(false)}>Cancel</button>
                </div>

                
            </Modal>
          </div>
        </div>
    );
}