import React, {useState, useCallback} from 'react';
import badgeNew from "../assets/badge-new.png";

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
                <span className={`schemeType ${activeScheme === 'traditional' ? 'active' : ''} ${currentStep !== step ? 'ss-no-underline' : ''}`} onClick={() => this.changeScheme('traditional')}>Traditional Plan</span>
                {/* {currentStep === step &&
                   <span className={`schemeType ${activeScheme === 'flexible' ? 'active' : ''} ${currentStep !== step ? 'ss-no-underline' : ''}`} onClick={() => this.changeScheme('flexible')}>Flexible Plan</span>
                }
                { currentStep === step && 
                 <span><img src={badgeNew} width={42} className="badge"/></span>
                } */}
            </section>
        );
    }
    
}

export default SchemeSelector;