import React, {useCallback, useState} from 'react';
import iconArrowDown from "../assets/arrow-down.png";
import iconEdit from "../assets/icon-edit.png";

export default function DeliveryWindow(props) {

    const {
        deliveryWindowStart, 
        deliveryWindowDay,
        deliveryWindowOne,
        deliveryWindowTwo,
        availableDeliveryStarts, 
        handleChangeStart, 
        handleChangeDay,
        handleContinue, 
        handleCancel,
        step,
        currentStep,
        isEditing
    } = props;

    const [selection, setSelection] = useState(false);

    const startOptions = availableDeliveryStarts.map((option, i) => {
        const startOption = option.startHour;
        const startOptionHalfHour = (startOption !== Math.ceil(startOption) ? ":30" : ":00");
        const endOption = option.endHour;
        const endOptionHalfHour = (endOption !== Math.ceil(endOption) ? ":30" : ":00");
        let optionText;
        if (startOption < 12)
            optionText = Math.floor(startOption) + startOptionHalfHour + "am";
        else if (startOption < 13)
            optionText = Math.floor(startOption) + startOptionHalfHour + "pm";
        else
            optionText = Math.floor(startOption - 12) + startOptionHalfHour + "pm";
        if (endOption < 12)
            optionText += ` - ${Math.floor(endOption)}${endOptionHalfHour}am`;
        else if (endOption < 13)
            optionText += ` - ${Math.floor(endOption)}${endOptionHalfHour}pm`;
        else
            optionText += ` - ${Math.floor(endOption) - 12}${endOptionHalfHour}pm`;
        
        return <option key={i} value={Math.ceil(startOption)}>{optionText}</option>
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

    console.log("availableDeliveryStarts",availableDeliveryStarts);

    return (
        <div className={`checkout-section checkout--delivery-window ${isEditing ? 'disabled' : ''}`}>
            
            <h2 className="order_delivery__window-title heading order_prop__heading ha-h3">Select Delivery Window  
                { currentStep !== step && 
                    <span>
                        <img src={iconEdit} width={65} className="iconEdit"  onClick={handleCancel} />
                    </span>
                }
            </h2>
                
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
                    </div>

                    <div className="checkout--delivery-window-actions">
                        <button className={`btn btn-primary-small btn-confirm btn-app ${selection ? '' : 'disabled'}`} onClick={handleContinue}>
                            CONFIRM
                        </button>
                    </div> 
                </div>
            } 

            { currentStep !== step &&
                <div>
                    <div className="delivery-date_container">
                        <h3 className="subheading delivery-date_item active">{getDisplayDate(deliveryWindowDay === 1 ? deliveryWindowOne : deliveryWindowTwo)}</h3>     
                    </div>

                    <div className="checkout--delivery-window-selectors">
                        <select className="order_delivery__dropdown left delivery-window_disabled" style={{backgroundImage: `url(${iconArrowDown.src})`}} disabled={true} value={deliveryWindowStart} onChange={handleChangeStart}>
                            {startOptions}
                        </select> 
                    </div>

                    <div className="checkout--delivery-window-actions">
                      { currentStep === step &&
                        <button className="btn btn-primary-small btn-disabled btn-app " onClick={handleContinue}>
                            Continue
                        </button>
                      }
                    </div>
                </div>
            }

            <hr></hr>

        </div>
    );
}