import { useState } from "react";
import { Checkbox } from "./Checkbox.client";
import { Layout } from "./Layout.client";
import { Radio } from "./Radio.client";

export default function DebugPage(props) {

    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [radioValue, setRadioValue] = useState(false);

    return ( 
        <>
            <Layout>  
                <section>
                    <h1>Debug World</h1>
                    <p>Please contact a web administrator if you see this page.</p>

                    <h3>Components</h3>
                    <h6>Checkbox Checked: {checkboxChecked === true ? 'true' : 'false'}</h6>
                    <Checkbox label="Test" price={"$1.23"} checked={checkboxChecked} handleClick={() => setCheckboxChecked(!checkboxChecked)}/>

                    <Radio handleClick={() => setRadioValue(true)} name="test-radio" isChecked={radioValue} label={`Test Label: `}/>
                    <Radio handleClick={() => setRadioValue(false)} name="test-radio" isChecked={!radioValue} label={`Test Label: `}/>
                    
                </section>
                
            </Layout>
        </>
    );
}