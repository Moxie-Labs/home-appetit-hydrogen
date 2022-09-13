import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";

export default function Payment(props) {

    const { customer, handleAddCard, handleRemoveCard } = props;
    const { payments } = customer;
    // const { payments } = props;

    const [showModal, setShowModal] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newName, setNewName] = useState("");
    const [newExpiry, setNewExpiry] = useState("");

    const paymentMethods = payments.map((payment, i) => {
        return (
            <article className="payment-method-unit" key={i}>
                <p>{ i === 0 ? 'Default Payment' : `Payment ${i+1}`}</p>
                <b>{payment.brand} {payment.maskedNumber}</b>
                <p>Exp: {payment.expiryMonth}/{payment.expiryYear}</p>
                <button disabled>Edit</button>|<button onClick={() => handleRemoveCard(i)}>Remove</button>
            </article>
        );
    });

    const onAddCard = (newCardNumber, newName, newExpiry) => {
        handleAddCard(newCardNumber, newName, newExpiry);
        setShowModal(false);
    }

    return (
        <div>
            <h1>Saved Payments</h1>

            {paymentMethods}

            <button className="btn btn-default" onClick={() => setShowModal(!showModal)}>Add New Payment</button>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <h1>Payment {payments.length}</h1>
                <label>Card Number:</label>
                <input value={newCardNumber} onChange={e => setNewCardNumber(e.target.value)}/>

                <label>Name on Card:</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}/>

                <label>Expiration Date:</label>
                <input value={newExpiry} onChange={e => setNewExpiry(e.target.value)}/>

                <button className="btn btn-confirm" onClick={(newCardNumber, newName, newExpiry) => onAddCard(newCardNumber, newName, newExpiry)}>Update</button>
                <button className="btn btn-default" onClick={() => setShowModal(false)}>Cancel</button>
            </Modal>

        </div>
    );
}