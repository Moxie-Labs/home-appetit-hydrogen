import React, {useState, useCallback} from 'react';
import SchemeSelector from "./SchemeSelector.client";
import iconEdit from "../assets/icon-edit.png";
import iconArrowDown from "../assets/arrow-down.png";
import { LayoutSection } from './LayoutSection.client';

const servingOptions = [
    {label: '1 Person', value: 1},
    {label: '2 People', value: 2},
    {label: '3 People', value: 3},
    {label: '4 People', value: 4},
    {label: '5 People', value: 5}
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
    }

    handleCancel(event) {
        this.props.handleCancel();
    }

    render() {   

        const {activeScheme, step, currentStep} = this.props;

        return(
            <section className={`step-section step-inner-flex${currentStep === step ? '' : ' default-padding'}`} id="OrderProperties">
                <div className="step-column">
                <LayoutSection>
                    <h2 sectioned className="heading order_prop__heading ha-h3">Step 1: Order Type</h2>
                    <SchemeSelector
                        activeScheme={activeScheme}
                        handleSchemeChange={(activeScheme) => this.handleSchemeChange(activeScheme)}
                        currentStep={currentStep}
                        step={1}
                    />
                    { currentStep === step &&
                        <p className="subheading order_prop__subheading ha-p">Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis nulla quam molestie id. Quisque risus pellentesque aliquet donec. Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis nulla quam.</p>
                    }
                </LayoutSection>
                <LayoutSection>
                    {currentStep === step &&
                        <label>Number of people:</label>
                    }
                    <div className="select-wrapper">
                        <select className={`order_prop__dropdown${currentStep === step ? '' : ' disabled'}`} style={{backgroundImage: `url(${iconArrowDown.src})`}} value={this.props.servingsCount} onChange={this.handleChange} disabled={currentStep !== step}>
                            {servingOptions.map(option => {
                                return (
                                    <option value={option.value}>{option.label}</option>
                                )
                            })}
                        </select>
                    </div>
                </LayoutSection>
                
                    <LayoutSection>
                    { currentStep === step &&
                        <button className="btn btn-primary-small btn-app" onClick={this.handleContinue}>
                            Continue
                        </button>
                    }

                    { currentStep !== step &&
                        <button className="btn btn-cancel" onClick={this.handleCancel}>
                            <img src={iconEdit.src} width={65} />
                        </button>
                    }
                    </LayoutSection>
                
                </div>
                { currentStep === step &&
                <div className="step-column">
                    <div className="illustration-placeholder">
                         Illustration Placeholder
                    </div>
                </div>
                }
            </section>
        )
    }
}