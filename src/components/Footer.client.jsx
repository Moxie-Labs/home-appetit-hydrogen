import logo from "../assets/logo.png";
import footerLogo from '../assets/footer-logo.png';
import iconEmail from '../assets/icon-email.png';
import iconInsta from '../assets/icon-insta.png';
export function Footer(){
   let marketingSite = `https://${import.meta.env.VITE_STORE_DOMAIN}/`;
   const activeFormScript = () => { 
        return { __html: `<div class="_form_7"><script src="https://homeappetitphilly.activehosted.com/f/embed.php?id=7" type="text/javascript" charset="utf-8"></script></div>` } 
    };

   
   return(
        <div className="footer">
            <img src={ footerLogo } className="footer-logo"/>
            <div className="footer-item-wrapper">
            <div className="footer-item">
                <div className="sub-heading">
                    Get Order Reminders
                </div>
                <div dangerouslySetInnerHTML={activeFormScript()}></div>
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
                    <li><a href={`${marketingSite}blogs/blog/heating-instructions`}>HEATING INSTRUCTIONS</a></li>
                    <li><a href={`${marketingSite}pages/faq`}>FAQS</a></li>
                    <li><a href="/gift-cards">GIFT CARDS</a></li>
                    <li><a href={`${marketingSite}pages/referrals`}>OUR REFERRAL PROGAM</a></li>
                </ul>
            </div>
            <div className="footer-item">
                <div className="sub-heading spacer">
                    &nbsp;
                </div>
                <ul className="footer-menu">
                    <li><a href={`${marketingSite}pages/why-home-appetit`}>ABOUT US</a></li>
                    <li><a href={`${marketingSite}pages/privacy-policy`}>PRIVACY POLICY</a></li>
                    <li><a href={`${marketingSite}pages/terms-of-use`}>TERMS OF USE</a></li>
                    <li><a href={`${marketingSite}pages/contact-1`}>CONTACT US</a></li>
                </ul>
            </div>
            </div>
        </div>
   );
}

