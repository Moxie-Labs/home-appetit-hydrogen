export function TextField(props) {

    const {ref, label, type, onFocus, value, placeholder, maxLength, onChange, autoComplete} = props;

    return (
        <div class="">
            <div class="Polaris-Labelled__LabelWrapper">
                <div class="Polaris-Label">
                    <label id="PolarisTextField2Label" for="PolarisTextField2" class="Polaris-Label__Text">{label}</label>
                </div>
            </div>
            <div class="Polaris-Connected">
                <div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
                    <div class="Polaris-TextField">
                        <input 
                            id="PolarisTextField2" 
                            placeholder={placeholder} 
                            autocomplete={autoComplete} 
                            className="Polaris-TextField__Input" 
                            maxlength={maxLength} 
                            type={type} 
                            aria-labelledby="PolarisTextField2Label" 
                            aria-invalid="false" 
                            value={value}
                            onFocus={onFocus}
                            onChange={e => onChange(e.target.value)}
                        />                            
                        <div class="Polaris-TextField__Backdrop"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

{/* //   ref={node}
// label="Card Number"
// type="text"
// onFocus={handleFocus}
// value={modalCreditCardNumber}
// placeholder={"Enter card number"}
// maxLength={16}
// onChange={(modalCreditCardNumber) => {setModalCreditCardNumber(modalCreditCardNumber)}}
// autoComplete="off" */}