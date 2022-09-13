import { Checkbox } from "../Checkbox.client";

export default function Communication(props) {

    const { handleAgreeUpdate, handleReceiveUpdate } = props;
    const { customer } = props;
    const { agreeConsent, receiveConsent } = props;

    return (
        <div>
            <h1>Communication Preferences</h1>

            <Checkbox checked={agreeConsent} onChange={() => handleAgreeUpdate(!agreeConsent)}/>
            <label>I agree to laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus.</label>
            <br></br>

            <Checkbox checked={receiveConsent} onChange={() => handleReceiveUpdate(!receiveConsent)}/>
            <label>Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus.</label>

        </div>
    );
}