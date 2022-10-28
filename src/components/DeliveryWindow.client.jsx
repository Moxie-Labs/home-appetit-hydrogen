import React, {useCallback, useState} from 'react';
import iconArrowDown from "../assets/arrow-down.png";
import iconEdit from "../assets/icon-edit.png";

export default function DeliveryWindow(props) {

    const {
        deliveryWindowStart, 
        deliveryWindowEnd, 
        deliveryWindowDay,
        deliveryWindowOne,
        deliveryWindowTwo,
        availableDeliveryStarts, 
        availableDeliveryEnds, 
        handleChangeStart, 
        handleChangeEnd, 
        handleChangeDay,
        handleContinue, 
        handleCancel,
        step,
        currentStep,
        isEditing
    } = props;

    const [selection, setSelection] = useState(false);

    const filteredEndOptions = availableDeliveryEnds.filter((option) => {
        return (!(option <= deliveryWindowStart));
    });

    const startOptions = availableDeliveryStarts.map((option, i) => {
        let endOption = option + 2;
        let optionText = option;
        if (option < 13) {
            optionText += "am";
        } else {
            optionText = parseInt(option) - 12;
            optionText += "pm";
        }
        if (endOption < 13) {
            optionText += ` - ${endOption}am`;
        } else {
            optionText += ` - ${parseInt(endOption) - 12}pm`;
        }
        return <option key={i} value={option}>{optionText}</option>
    });

    const endOptions = filteredEndOptions.map((option) => {
        let optionText = option;
        if (option < 13) {
            optionText += "am";
        } else {
            optionText = parseInt(option) - 12;
            optionText += "pm";
        }
        return <option value={option}>{optionText}</option>
    });

    const getDisplayDate = date => {
        let retval;
        if (date.getDay() === 1) 
            retval = `Monday `
        else if (date.getDay() === 2)
            retval = `Tuesday `
        
        retval += `${date.getMonth()+1}/${date.getDate()}`;
        return retval;
    }

    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    return (
        <div className={`checkout-section checkout--delivery-window ${isEditing ? 'disabled' : ''}`}>
            
            <h2 className="order_delivery__window-title heading order_prop__heading ha-h3">Select Delivery Window  
            { currentStep !== step && 
                <span>
                            <img src={iconEdit} width={65} className="iconEdit"  onClick={handleCancel} /></span>
                            }</h2>
                
            { currentStep === step && 
                <div>

                    <div className="delivery-date_container">
                        <h3 className={`subheading delivery-date_item${deliveryWindowDay === 1 ? ' active' : ''}`} onClick={() => handleChangeDay(1)}>{getDisplayDate(deliveryWindowOne)}</h3>
                        <h3 className={`subheading delivery-date_item${deliveryWindowDay === 2 ? ' active' : ''}`} onClick={() => handleChangeDay(2)}>{getDisplayDate(deliveryWindowTwo)}</h3>
                    </div>

                    <label className="delivery-window_label">Delivery Window</label>
                    <div className="checkout--delivery-window-selectors">
                        <select className="order_delivery__dropdown left" style={{backgroundImage: `url(${iconArrowDown})`}} value={deliveryWindowStart} onChange={(value) => {handleChangeStart(value); setSelection(true)}}>
                            <option selected disabled>- Select a Window -</option>
                            {startOptions}
                        </select> 
                        {/* -
                        // <select className="order_delivery__dropdown right" style={{backgroundImage: `url(${iconArrowDown.src})`}} disabled={true} value={deliveryWindowEnd} onChange={handleChangeEnd}>
                        //     {endOptions}
                        // </select>  */}
                    </div>

                    <div className="checkout--delivery-window-actions">
                        <button className={`btn btn-primary-small btn-confirm btn-app ${selection ? '' : 'disabled'}`} onClick={handleContinue}>
                            CONFIRM
                        </button>
                    </div> 
                </div>
            } 

            { currentStep !== step &&
                // <div className="step-disabled">
                <div>
                    <div className="delivery-date_container">
                        <h3 className="subheading delivery-date_item active">{getDisplayDate(deliveryWindowDay === 1 ? deliveryWindowOne : deliveryWindowTwo)}</h3>     
                    </div>

                    <div className="checkout--delivery-window-selectors">
                        <select className="order_delivery__dropdown left delivery-window_disabled" style={{backgroundImage: `url(${iconArrowDown.src})`}} disabled={true} value={deliveryWindowStart} onChange={handleChangeStart}>
                            {startOptions}
                        </select> 
                        {/* - */}
                        {/* <select className="order_delivery__dropdown right" style={{backgroundImage: `url(${iconArrowDown.src})`}} disabled={true} value={deliveryWindowEnd} onChange={handleChangeEnd}> */}
                        {/* <select className="order_delivery__dropdown right delivery-window_disabled" style={{backgroundImage: `url(${iconArrowDown.src})`}} disabled={true} value={deliveryWindowEnd} onChange={handleChangeEnd}>
                            {endOptions}
                        </select>  */}
                    </div>

                    <div className="checkout--delivery-window-actions">
                      { currentStep === step &&
                        <button className="btn btn-primary-small btn-disabled btn-app " onClick={handleContinue}>
                            Continue
                        </button>
                      }

                        {/* <button className="btn btn-primary btn-app" onClick={handleCancel}>
                            Cancel
                        </button> */}
                    </div>
                </div>
            }

            <hr></hr>

        </div>
    );
}