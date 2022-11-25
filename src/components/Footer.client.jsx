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
                <div class="_form_7"></div><script src="https://homeappetitphilly.activehosted.com/f/embed.php?id=7" type="text/javascript" charset="utf-8"></script>
                <div className="copyright">
                © {new Date().getFullYear()} HOME APPÉTIT
                </div>
            </div>
            <div className="footer-item">
                <div className="sub-heading">
                    Connect with us
                </div>
                <div className="social-wrapper">
                    <a href="mailto:contact@homeappetitphilly.com"><img src={ iconEmail } className="footer-logo"/></a>
                    <a href="http://instagram.com/homeappetitphilly"><img src={ iconInsta } className="footer-logo"/></a>
                </div>
            </div>
            <div className="footer-item">
                <div className="sub-heading spacer">
                    &nbsp;
                </div>
                <ul className="footer-menu">
                    <li><a href="https://marketingbeta.homeappetitphilly.com/blogs/blog/heating-instructions">HEATING INSTRUCTIONS</a></li>
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/faq">FAQS</a></li>
                    <li><a href="/gift-cards">GIFT CARDS</a></li>
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/referrals">OUR REFERRAL PROGAM</a></li>
                </ul>
            </div>
            <div className="footer-item">
                <div className="sub-heading spacer">
                    &nbsp;
                </div>
                <ul className="footer-menu">
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/why-home-appetit">ABOUT US</a></li>
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/privacy-policy">PRIVACY POLICY</a></li>
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/terms-of-use">TERMS OF USE</a></li>
                    <li><a href="https://marketingbeta.homeappetitphilly.com/pages/contact-1">CONTACT US</a></li>
                </ul>
            </div>
            </div>
        </div>
   );
}

