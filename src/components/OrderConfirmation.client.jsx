import { CompleteSignUp } from "./CompleteSignup.client";

export default function OrderConfirmation(props) {

    const {
        deliveryWindowStart,
        deliveryWindowEnd,
        windowDay,
        cardNumber, 
        expiration, 
        securityCode, 
        zipcode, 
        sameAsBilling,
        creditCards,
        giftCards,
        step,
        currentStep,
        firstName,
        lastName, 
        emailAddress, 
        phoneNumber, 
        address, 
        address2, 
        city, 
        deliveryState,
        billingZipcode,
        orderNumber
    } = props;

    const handleChange = (event) => {
        this.props.handleChange(event.target.value);
      }
    
    const handleContinue = (event) => {
        this.props.handleContinue();
    }

    const handleCancel = (event) => {
        this.props.handleCancel();
    }

    const getDisplayDate = date => {
        let retval;
        if (date.getDay() === 6) 
            retval = `Saturday `
        else if (date.getDay() === 0)
            retval = `Sunday `
        
        retval += `${date.getMonth()+1}/${date.getDate()}`;
        return retval;
    }


    const getCardVendor = () => {
        if (cardNumber[0] === '4')
            return "Visa";
        else {
            return "MasterCard";
        }
    }
    
    return(
        <div>
        <section className={`step-section ${currentStep === step ? '' : ' default-padding'}`} id="OrderConfirmation">
            <div className='checkout-subsection'>
                <h1 className='ha-h2'>Your Order is Confirmed!</h1>
                <p className='order-no'>Order #{orderNumber}</p>
                <p className='ha-p'>Amet id vitae laoreet morbi mattis pharetra. Est edist adipiscing sit maecenas aliquet maecenas id. Faucibus egestas consequat view Heating Instructions.</p>
            </div>
           
            <div className='checkout-subsection'>
                <h2 className='ha-h3'>Contact & Delivery Information</h2>
                <p className='ha-p'>{firstName}</p>
                <p className='ha-p'>{emailAddress}</p>
                <p className='ha-p'>{phoneNumber}</p>
                <p className='ha-p'>{address} {city}, {deliveryState} {zipcode}</p>
            </div>

            <div className='checkout-subsection'>
                <h2 className='ha-h3'>Delivery Window</h2>
                <p className='ha-p'>{getDisplayDate(windowDay)}</p>
                <p className='ha-p'>{deliveryWindowStart}:00{deliveryWindowStart < 13 ? 'am' : 'pm'} - {(deliveryWindowEnd < 13 ? deliveryWindowEnd : deliveryWindowEnd - 12)}:00{deliveryWindowEnd < 13 ? 'am' : 'pm'}</p>
            </div>

            <div className='checkout-subsection'>
                <h2 className='ha-h3'>Payment Information</h2>
                <p className='ha-p'>{getCardVendor()} ****{cardNumber.slice(cardNumber.length-5, cardNumber.length-1)}</p>
            </div>
        
        </section>
         
         <CompleteSignUp/>

        </div>
    )
    
}