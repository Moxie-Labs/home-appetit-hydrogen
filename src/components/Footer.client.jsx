import logo from "../assets/logo.png";
import footerLogo from '../assets/footer-logo.png';
import iconEmail from '../assets/icon-email.png';
import iconInsta from '../assets/icon-insta.png';
export function Footer(){
   return(
        <div className="footer">
            <img src={ footerLogo } className="footer-logo"/>
            <div className="footer-item-wrapper">
            <div className="footer-item">
                
                <div className="sub-heading">
                    Get Order Reminders
                </div>
                <form className="subscription-form">
                    <input type="text" placeholder="Enter your email"/>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div className="footer-item">
                <div className="sub-heading">
                    Connect with us
                </div>
                <div className="social-wrapper">
                    <img src={ iconEmail } className="footer-logo"/>
                    <img src={ iconInsta } className="footer-logo"/>
                </div>
            </div>
            <div className="footer-item">
                <div className="sub-heading">
                    &nbsp;
                </div>
                <ul className="footer-menu">
                    <li><a href="#">HEATING INSTRUCTIONS</a></li>
                    <li><a href="#">FAQS</a></li>
                    <li><a href="#">GIFT CARDS</a></li>
                    <li><a href="#">OUR REFERRAL PROGAM</a></li>
                </ul>
            </div>
            <div className="footer-item">
                <div className="sub-heading">
                    &nbsp;
                </div>
                <ul className="footer-menu">
                    <li><a href="#">ABOUT US</a></li>
                    <li><a href="#">PRIVACY POLICY</a></li>
                    <li><a href="#">TERMS OF USE</a></li>
                    <li><a href="#">CONTACT US</a></li>
                </ul>
            </div>
            </div>
        </div>
   );
}

