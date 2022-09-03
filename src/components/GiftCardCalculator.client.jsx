import React, {useCallback, useState, useRef } from 'react';
import Modal from 'react-modal/lib/components/Modal';

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

    const activator = <button onClick={toggleModal} value={'Open Calculator'}>Open Calculator</button>;

    const suggestedAmountText = isFormReady() ? `$${calculateSuggestedAmount()}` : "Enter fields for suggested amount";

    const addButtonText = isFormReady() ? `Add $${calculateSuggestedAmount()}` : "Add";

    return (
        <section>
            {activator}
            <Modal
                activator={activator}
                isOpen={activeCalculator}
                onRequestClose={dismissModals}
                >
                    <h1 className='title'>Calculate Gift Amount</h1>

                    <label># of People</label>
                    <input type='number' placeholder='# of people' value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} min={1} max={5}/>

                    <label># of Weeks</label>
                    <input type='number' placeholder='# of weeks' value={numberOfWeeks} onChange={(e) => setNumberOfWeeks(e.target.value)} min={1} max={8}/>

                    <label>ZIP Code</label>
                    <input type='number' placeholder='ZIP Code' value={zipcode} onChange={(e) => setZipcode(e.target.value)} maxLength={5} min={0} max={99999}/>

                    <p className='gift-card-calculator--amount text-center'>{suggestedAmountText}</p>

                    <div className="text-center">
                        <button className={`btn btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled'}`} primary disabled={isFormReady} onClick={onAddGift}>
                            {addButtonText} 
                        </button>

                        <button className={`btn btn-secondary btn-modal`} onClick={() => dismissModals()}>
                            Cancel
                        </button>
                    </div>

                </Modal>
        </section>        
    );
}