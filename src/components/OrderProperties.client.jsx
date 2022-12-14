import React, {useState, useCallback} from 'react';
import OrderIllustration from "./OrderIllustration.client";
import SchemeSelector from "./SchemeSelector.client";
import iconEdit from "../assets/icon-edit.png";
import iconArrowDown from "../assets/arrow-down.png";
import illustration from "../assets/ha-infographic-hd.png";
import { LayoutSection } from './LayoutSection.client';
import { FLEXIBLE_PLAN_NAME, TRADITIONAL_PLAN_NAME } from '../lib/const';

const servingOptions = [
    {label: '1 Person', value: 1},
    {label: '2 People', value: 2},
    {label: '3 People', value: 3},
    {label: '4 People', value: 4}
];

const flexServingOptions = [
    {label: '2 People', value: 2},
    {label: '3 People', value: 3},
    {label: '4 People', value: 4}
];

// const [activeScheme, setActiveScheme] = useState('traditional');

export default class OrderProperties extends React.Component {
    constructor(props) {
        super(props);    

        this.handleChange = this.handleChange.bind(this);
        this.handleSchemeChange = this.handleSchemeChange.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }

    handleChange(event) {
        this.props.handleChange(event.target.value);
    }

    handleSchemeChange(activeScheme) {
        this.props.handleSchemeChange(activeScheme);
    }
    
    handleContinue(event) {
        this.props.handleContinue();
        // const step = document.querySelector(".step-active");
        // step.scrollIntoView({behavior: "smooth", block: "start"});
    }

    handleCancel(event) {
        this.props.handleCancel();
    }

    getDisplayDate(date) {
        const retval = `${date.getMonth()+1}/${date.getDate()}`;
        return retval;
    }

    render() {   

        const {activeScheme, step, currentStep, servingCount, deliveryWindowOne, planPrice} = this.props;

        let effectiveServingOptions = activeScheme === TRADITIONAL_PLAN_NAME ? servingOptions : flexServingOptions;

        return(
            <section className={`step-section step-inner-flex${currentStep === step ? '' : ' default-padding'}`} id="OrderProperties">
                <div className="step-column">
                <LayoutSection>
                    <h2 sectioned className="heading order_prop__heading ha-h3">Step 1: Order Type 
                        { currentStep === step && <span className='order-date-label'>For {this.getDisplayDate(deliveryWindowOne)} Delivery</span> }
                    </h2>
                    <SchemeSelector
                        activeScheme={activeScheme}
                        handleSchemeChange={(activeScheme) => this.handleSchemeChange(activeScheme)}
                        currentStep={currentStep}
                        step={1}
                    />
                    <div>
                        <span className={`delivery-window-label ${currentStep !== step ? 'disabled' : ''}`}>Place order for {this.getDisplayDate(deliveryWindowOne)} delivery</span>
                    </div>

                    {activeScheme === TRADITIONAL_PLAN_NAME && currentStep === step &&
                       <p className="subheading order_prop__subheading ha-p"> Select four entrees and four small plates. If you’re feeding more than one person, we’ll portion up your selections accordingly. (Example: Enough pasta for three people.) Any dish customizations will impact all portions. If you need to customize specific portions or each person would like different selections, check out our Flex Order option.</p>
                    }

                    {activeScheme === FLEXIBLE_PLAN_NAME && currentStep === step &&
                       <p className="subheading order_prop__subheading ha-p"> Select four entrees and four small plates per person. Multiple selections of the same dish will come packed together, unless customizations are made to individual selections. (If everyone you’re ordering for will enjoy the same selections or customizations, consider placing a Classic Order—our most cost effective option.)
                       </p>
                    } 
                
                </LayoutSection>
                <LayoutSection>
                    {currentStep === step &&
                        <label>Number of people:</label>
                    }
                    <div className="select-wrapper">
                        <select className={`order_prop__dropdown${currentStep === step ? '' : ' disabled'}`} style={{backgroundImage: `url(${iconArrowDown})`}} value={this.props.servingCount} onChange={this.handleChange} disabled={currentStep !== step}>
                            <option selected disabled hidden value={0}>Select...</option>
                            {effectiveServingOptions.map(option => {
                                return (
                                    <option value={option.value}>{option.label}</option>
                                )
                            })}
                        </select>
                        {currentStep != step &&
                        <div>
                            <br />
                            </div>
                    }
                    </div>
                </LayoutSection>
                
                    <LayoutSection>
                    { currentStep === step &&
                        <button className={`btn btn-primary-small btn-app ${servingCount < 1 ? 'btn-disabled' : ''}`} onClick={this.handleContinue}>
                            Continue
                        </button>
                    }

                    { currentStep !== step &&
                        <button className="btn btn-cancel" onClick={this.handleCancel}>
                            <img src={iconEdit} width={65} />
                        </button>
                    }
                    </LayoutSection>
                
                </div>
                { currentStep === step &&
                <div className="step-column">
                    <div className="illustration-placeholder">
                        <OrderIllustration
                            activeScheme={activeScheme}
                            servingCount={servingCount}
                            planPrice={planPrice}
                        />
                    </div>
                </div>
                }
            </section>
        )
    }
}