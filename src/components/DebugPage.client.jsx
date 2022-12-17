import { useState } from "react";
import { Checkbox } from "./Checkbox.client";
import { Layout } from "./Layout.client";

export default function DebugPage(props) {

    const [checkboxChecked, setCheckboxChecked] = useState(false);

    return ( 
        <>
            <Layout>  
                <section>
                    <h1>Debug World</h1>
                    <p>Please contact a web administrator if you see this page.</p>

                    <h3>Components</h3>
                    <h6>Checkbox Checked: {checkboxChecked === true ? 'true' : 'false'}</h6>
                    <Checkbox label="Test" price={"$1.23"} checked={checkboxChecked} handleClick={() => setCheckboxChecked(!checkboxChecked)}/>
                </section>
                
            </Layout>
        </>
    );
}