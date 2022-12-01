import {useState} from 'react';
import logo from "../assets/logo.png";
import hamburgerMenu from "../assets/hamburger-menu.png";
import iconDropdownArrow from "../assets/icon-dropdown-arrow.png";
import iconDropdownReverse from "../assets/icon-dropdown-reverse.png";
import iconCloseBtn from "../assets/icon-close-btn.png";
import { LogoutButton } from './LogoutButton.client';

export function Header(prop){
    const {isOrdering} = prop;
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const rootUrl = import.meta.env.VITE_STORE_DOMAIN;
    const rootOrderingUrl = import.meta.env.VITE_ORDERING_SITE;
    var base_url = window.location.origin;

    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleClick = () => {
        setIsActive(current => !current);
    };

    const handleOrdersRedirect = (e) => {
        e.preventDefault();
        window.location.replace(base_url+"/account#orders");
        window.location.reload();
        return false;
    };

    const handleReferralsRedirect = (e) => {
        e.preventDefault();
        window.location.replace(base_url+"/account#referrals");
        window.location.reload();
        return false;
    };

   return(
        <div className="header">
            <div className={`header-inner ${isOrdering ? 'header-inner-ordering' : ''}`}>
                <div className={`mobile-menu ${isOrdering ? 'mobile-hide-menu' : ''}`}>
                    {isActive &&
                      <img src={iconCloseBtn} width="24" onClick={handleClick}/>
                    }
                    {!isActive &&
                    <img src={hamburgerMenu} width="24" onClick={handleClick}/>
                    }
                    <div className={`mobile-nav-wrapper ${isActive ? 'active' : ''}`}>
                        <div className="mobile-nav mobile-nav-main">
                            <ul>
                                <li><a href={`https://${rootUrl}/pages/how-it-works`}>HOW IT WORKS</a></li>
                                <li><a href={`https://${rootUrl}/pages/why-home-appetit`}>WHY HOME APPETIT</a></li>
                                <li><a href={`https://${rootUrl}/blogs/blog`}>BLOG</a></li>
                            </ul>
                        </div>
                        <div className="mobile-nav mobile-nav-account">
                            <ul>
                            <li><a href="/account">My Account</a></li> 
                                 <li><a href={`${rootOrderingUrl}/account#orders`} onClick={handleOrdersRedirect}>Orders</a></li>
                                 <li><a href={`${rootOrderingUrl}/account#referrals`} onClick={handleReferralsRedirect}>Referrals</a></li>
                                {/* <li><LogoutButton onMouseOut={handleMouseOut}/></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                {!isOrdering &&
                <div className="nav-wrapper nav-main">
                    <ul>
                        <li><a href={`https://${rootUrl}/pages/how-it-works`}>HOW IT WORKS</a></li>
                        <li><a href={`https://${rootUrl}/pages/why-home-appetit`}>WHY HOME APPETIT</a></li>
                        <li><a href={`https://${rootUrl}/blogs/blog`}>BLOG</a></li>
                    </ul>
                </div>
                }
                <div className={`logo ${isOrdering ? 'mobile-logo-margin' : ''}`}>
                    <a href={`https://${rootUrl}`}>
                     <img src={logo}/>
                     </a>
                </div>
                {!isOrdering &&
                <div className="nav-wrapper">
                    <ul>
                        <li><a href="/order" className="btn-order-cta mobile-order-cta">ORDER</a></li>
                        <li><a href="/order" className="btn-order-cta desktop-order-cta">ORDER NOW</a></li>
                        <li><a href="#" className="my-account-trigger nav-main" onMouseOver={handleMouseOver}>ACCOUNT &nbsp;<span> {isHovering && <img src={iconDropdownReverse} />}{!isHovering && <img src={iconDropdownArrow} />}</span></a>
                            
                        {isHovering && (
                            <ul className="account-dropdown">
                                 <li><a href="/account">My Account</a></li> 
                                 <li><a href="#" onClick={handleOrdersRedirect}>Orders</a></li>
                                 <li><a href="javascript:void(0)" onMouseOut={handleMouseOut}>Referrals</a></li>
                                    {/* <li><LogoutButton onMouseOut={handleMouseOut} redirectUrl={`https://${rootUrl}`}/></li> */}
                                </ul>
                            )}
                           
                        </li>
                        
                    </ul>
                </div>
                }
            </div>
        </div>
   );
}
