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
        <div>
            <h1>Gift Cards</h1>

            <p>Check Balance</p>
            <input type="textfield" value={balanceCheckValue} onChange={e => setBalanceCheckValue(e.target.value)}/>
            <button onClick={() => mockCheckBalace()}>Submit</button>


            <p>Gift Card Balance</p>
            <p>${giftBalance.toFixed(2)}</p>

            <hr></hr>

            <h2>Referrals</h2>
            <p><a href="#">Invite a Friend</a></p>

            <h2>Referral Credit</h2>
            <p>${referralCredit.toFixed(2)}</p>

            <h2><b>About Our Referral Program</b></h2>
            <p>
                Sit vel, elit convallis sem sit. Pharetra, vel enim nascetur facilisi id sollicitudin turpis. Vitae potenti tincidunt sit iaculis. 
                Pellentesque sit odio in eros augue facilisis. Convallis consequat arcu massa feugiat egestas. 
                In pharetra vulputate donec id interdum scelerisque suscipit ullamcorper nisl. Semper suspendisse eros at aliquet ut.
            </p>

        </div>
    );
}

// pt9pbwmh7mxc86m3