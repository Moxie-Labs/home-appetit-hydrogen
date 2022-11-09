import { useState } from "react";

export default function GiftCards(props) {

    const { giftBalance: giftBalanceProp, referralCredit: referralCreditProp } = props;

    const [balanceCheckValue, setBalanceCheckValue] = useState("");
    const [giftBalance, setGiftBalance] = useState(giftBalanceProp);
    const [referralCredit, setReferralCredit] = useState(referralCreditProp);

    const mockCheckBalace = () => {
        setTimeout(() => {
            setGiftBalance(50.0);
        }, 2000);
    }

    return (
        <div className="gift-card-information">
            <h1 className="ha-h5">Gift Cards</h1>

            <label className="check-balance-label">Check Balance</label>
            <input type="text" value={balanceCheckValue} onChange={e => setBalanceCheckValue(e.target.value)}/>
            <button className="btn btn-primary-small ha-color-bg-orange btn-submit" onClick={() => mockCheckBalace()}>Submit</button>
    
            <div className="line-separator"></div>

            <div className="gift-card-row">
                <h2 className="ha-h5">Referrals</h2>
                <p><a href="#" className="ha-a">Invite a Friend</a></p>
            </div>

            <div className="gift-card-row">
                <p>Referral Credit</p>
                <p><strong>${referralCredit.toFixed(2)}</strong></p>
            </div>

            <div className="referral-program-wrapper">
            <p><strong>About Our Referral Program</strong></p>
            <p>
                Sit vel, elit convallis sem sit. Pharetra, vel enim nascetur facilisi id sollicitudin turpis. Vitae potenti tincidunt sit iaculis. 
                Pellentesque sit odio in eros augue facilisis. Convallis consequat arcu massa feugiat egestas. 
                In pharetra vulputate donec id interdum scelerisque suscipit ullamcorper nisl. Semper suspendisse eros at aliquet ut.
            </p>
            </div>

        </div>
    );
}

// pt9pbwmh7mxc86m3