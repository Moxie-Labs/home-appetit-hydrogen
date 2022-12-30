import { useEffect, useState } from "react";
import Communication from "./Communication.client";
import { flattenConnection } from '@shopify/hydrogen';
import Modal from "react-modal/lib/components/Modal";
import { Checkbox } from "../Checkbox.client";
import editIcon from "../../assets/icon-edit-alt.png";
import iconCloseBtn from "../../assets/icon-close-btn.png";
import { emailValidation } from "../../lib/utils";
import { logToConsole } from "../../helpers/logger";


export default function Referrals(props) {

    const [showingModal, setShowingModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [modalEmail, setModalEmail] = useState();
    const [referralApiMsg, setReferralApiMsg] = useState(null);
    const [referralApiError, setReferralApiError] = useState(null);

    const referralUrl = import.meta.env.VITE_REFERRAL_APP_URL;
    const {customer, orderCount} = props;

    useEffect(() => {
        logToConsole("Connecting to referral app...");
        fetch(`${referralUrl}/api`)
            .then((response) => response.text())
            .then((text) => {
                logToConsole(text);
        });
    },[]);

    const submitReferral = () => {
        if (validateEmail(modalEmail)) {
            const req = {
                method: "POST",
                body: JSON.stringify({
                    referredUseremail : modalEmail,
                    userEmail : customer.email
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            };

            fetch(`${referralUrl}/api/checkReferralValidity`, req)
                .then((response) => response.json())
                .then((json) => {
                    if (json.status !== 200)
                        setReferralApiError(json.msg);
                    else {
                        setReferralApiMsg("Invitation sent!");
                        setModalEmail("");
                    }
                        
            });
        }
    }

    const validateEmail = email => {
        return ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    }

    return (
        <div className="account-information">

            <section>            
                <div className="personal-info-wrapper">
                    <h5 className={`ha-h5 text-uppercase no-margin`}>Referrals <a className={`link pull-right${orderCount < 1 ? ' greyed-out' : ''}`} href="#" onClick={() => setShowingModal(true)}>Invite a Friend</a></h5>
                    <div className="info-row">
                        <div>
                            <h1>About our referral program</h1>
                            { orderCount < 1 && <p className="underline">You must complete an Order to be eligible for the Referral Program.</p> }
                            <p>
                                Sit vel, elit convallis sem sit. Pharetra, vel enim nascetur facilisi id sollicitudin turpis. 
                                Vitae potenti tincidunt sit iaculis. Pellentesque sit odio in eros augue facilisis. 
                                Convallis consequat arcu massa feugiat egestas. In pharetra vulputate donec id interdum scelerisque suscipit ullamcorper nisl. 
                                Semper suspendisse eros at aliquet ut.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

                <Modal
                    isOpen={showingModal}
                    onRequestClose={() => setShowingModal(false)}
                    className="modal-new-referral"
                >
                    <img className='btn-close-referral-modal' src={iconCloseBtn} width="24" onClick={() => setShowingModal(false)}/>
                    <h4 className="ha-h4 text-uppercase text-center no-margin">Invite A Friend</h4>

                    <div className="new-address-wrapper">
                        <div className="field-row">
                            <div className="field">
                                <label>Email Address</label>
                                <input className={`modal-address-field${validationErrors.modalEmail !== undefined ? ' input-error' : ''}`} type="text" name="email" value={modalEmail} onChange={e => setModalEmail(e.target.value)} placeholder={"Enter email"} required/>
                                {/* {validationErrors.modalEmail !== undefined && <p className='form-errors'>{validationErrors.modalEmail}</p>} */}
                                { referralApiMsg !== null && <p className="referral-api-msg">{referralApiMsg}</p> }
                                { referralApiError !== null && <p className="referral-api-msg referral-api-error">{referralApiError}</p> }
                                <p>Sit vel, elit convallis sem sit. Pharetra, vel enim nascetur facilisi id sollicitudin turpis. Vitae potenti tincidunt sit iaculis.</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button className={`btn btn-primary-small${validateEmail(modalEmail) ? '' : ' greyed-out'}`} onClick={() => submitReferral()}>Submit</button>
                    </div>

                </Modal>
            
        </div>
    );
}