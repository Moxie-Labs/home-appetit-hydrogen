import { Checkbox } from "../Checkbox.client";

export default function Communication(props) {

    const { handleUpdateCommunication, acceptsMarketing, receiveConsent } = props;

    return (
        <div className="communication-information">
            <h1 className="ha-h5">Communication Preferences</h1>

            <div className="field">
                <Checkbox checked={acceptsMarketing} onChange={() => handleUpdateCommunication({acceptsMarketing: !acceptsMarketing})}/>
                <label> I agree to laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus.</label>
            </div>

            <div className="field">
                <div style={{opacity: 0.6, pointerEvents: "none"}}>
                    <Checkbox disabled="true" checked={receiveConsent} onChange={() => handleUpdateCommunication({receiveConsent: !receiveConsent})}/>
                    <label> Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus.</label>
                </div>
            </div>

            <div className="field">
                <div style={{opacity: 0.6, pointerEvents: "none"}}>
                    <Checkbox disabled="true" checked={receiveConsent} onChange={() => handleUpdateCommunication({receiveConsent: !receiveConsent})}/>
                    <label> Receive laoreet aliquet proin mattis quis ut nulla lac us vitae orci quis varius lacus.</label>
                </div>
            </div>

        </div>
    );
}