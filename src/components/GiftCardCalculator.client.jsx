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

    const servingOptions = [
        { label: '1 Person', value: 1 },
        { label: '2 People', value: 2 },
        { label: '3 People', value: 3 },
        { label: '4 People', value: 4 },
        { label: '5 People', value: 5 }
    ];

    return (
        <section>
            {activator}
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
                        <input type='text' placeholder='Enter Weeks (max 8)' onKeyPress={(e) => !/[1-8]/.test(e.key) && e.preventDefault()} maxLength={1} value={numberOfWeeks} onChange={(e) => setNumberOfWeeks(e.target.value)} />
                    </div>
                    <div className='calculator-field'>
                        <label>ZIP Code:</label>
                        <input type='text' placeholder='Enter ZIP' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} maxLength={5} value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                    </div>
                </div>

                <p className='gift-card-calculator--amount text-center'>{suggestedAmountText}</p>

                <div className="text-center gift-card-control">
                    <button className={`btn btn-primary-small btn-confirm btn-modal${isFormReady() ? '' : ' btn-disabled btn-primary-small-disable'}`} primary disabled={isFormReady} onClick={onAddGift}>
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