import {useState} from 'react';
import logo from "../assets/logo.png";
import hamburgerMenu from "../assets/hamburger-menu.png";
import iconDropdownArrow from "../assets/icon-dropdown-arrow.png";
import iconDropdownReverse from "../assets/icon-dropdown-reverse.png";
import iconCloseBtn from "../assets/icon-close-btn.png";
import { LogoutButton } from './LogoutButton.client';

export function Header(prop){
    const {isOrdering, scrollingUp} = prop;
    const [isActive, setIsActive] = useState(false);
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const rootUrl = import.meta.env.VITE_STORE_DOMAIN;
    const rootOrderingUrl = import.meta.env.VITE_ORDERING_SITE;
    var base_url = window.location.origin;

    const handleClick = () => {
        setIsActive(current => !current);
    };

    const handleDropdownToggle = () => {
        setIsDropdownActive(isDropdownActive => !isDropdownActive);
    };

    const handleOrdersRedirect = (e) => {
        e.preventDefault();
        location.replace(base_url+"/account#orders");
        location.reload();
        return false;
    };

    const handleReferralsRedirect = (e) => {
        e.preventDefault();
        location.replace(base_url+"/account#referrals");
        location.reload();
        return false;
    };

   return(
        <div className={`header${scrollingUp ? ' header-fixed' : ''}`}>
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
                        <li><a href="#" className="my-account-trigger nav-main" onClick={handleDropdownToggle}>ACCOUNT &nbsp;<span> {isDropdownActive && <img src={iconDropdownReverse} />}{!isDropdownActive && <img src={iconDropdownArrow} />}</span></a>
                            
                        {isDropdownActive && (
                            <div className="dropdown-wrapper">
                            <ul className="account-dropdown">
                                 <li><a href="/account">My Account</a></li> 
                                 <li><a href="#" onClick={handleOrdersRedirect}>Orders</a></li>
                                 <li><a href="javascript:void(0)">Referrals</a></li>
                                    {/* <li><LogoutButton onMouseOut={handleMouseOut} redirectUrl={`https://${rootUrl}`}/></li> */}
                                </ul>
                            </div>
                            )}
                           
                        </li>
                        
                    </ul>
                </div>
                }
            </div>
        </div>
   );
}
