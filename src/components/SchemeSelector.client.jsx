import React, {useState, useCallback} from 'react';
import badgeNew from "../assets/badge-new.png";
import { FLEXIBLE_PLAN_NAME, TRADITIONAL_PLAN_NAME } from '../lib/const';

class SchemeSelector extends React.Component {

    constructor(props) {
        super(props);

        this.changeScheme = this.changeScheme.bind(this);
    }

    changeScheme(activeScheme) {
        console.log("changing scheme", activeScheme)
        this.props.handleSchemeChange(activeScheme);
    }

    render() {
        const {activeScheme, step, currentStep} = this.props;
        return (
            <section id="SchemeSelector" className={`${currentStep !== step ? 'scheme-inactive-padding' : ''}`}>
                {currentStep !== step && 
                    <span className={`schemeType ${currentStep !== step ? 'ss-no-underline' : ''}`}>{activeScheme === TRADITIONAL_PLAN_NAME ? 'Classic' : 'Flexible'} Plan</span>
                }
                {currentStep === step &&
                    <div>
                        <span className={`schemeType ${activeScheme === TRADITIONAL_PLAN_NAME ? 'active' : ''} ${currentStep !== step ? 'ss-no-underline' : ''}`} onClick={() => this.changeScheme(TRADITIONAL_PLAN_NAME)}>Classic Plan</span>
                        <span className={`schemeType ${activeScheme === FLEXIBLE_PLAN_NAME ? 'active' : ''} ${currentStep !== step ? 'ss-no-underline' : ''}`} onClick={() => this.changeScheme(FLEXIBLE_PLAN_NAME)}>Flexible Plan</span>
                        <span className="badge"><img src={badgeNew} width={42} /></span>
                    </div>
                }
            </section>
        );
    }
    
}

export default SchemeSelector;