import {useState} from 'react';
import logo from "../assets/logo.png";
import hamburgerMenu from "../assets/hamburger-menu.png";
import iconDropdownArrow from "../assets/icon-dropdown-arrow.png";
import iconDropdownReverse from "../assets/icon-dropdown-reverse.png";
import { LogoutButton } from './LogoutButton.client';

export function Header(prop){
    const {isOrdering} = prop;
    const [isHovering, setIsHovering] = useState(false);
    const rootUrl = import.meta.env.VITE_STORE_DOMAIN;

    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };

   return(
        <div className="header">
            <div className="header-inner">
                <div className="mobile-menu">
                    <img src={hamburgerMenu} width="24"/>
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
                <div className="logo">
                    <a href={`https://${rootUrl}`}>
                     <img src={logo}/>
                     </a>
                </div>
                {!isOrdering &&
                <div className="nav-wrapper">
                    <ul>
                        <li><a href="/order" className="btn-order-cta mobile-order-cta">ORDER</a></li>
                        <li><a href="/order" className="btn-order-cta desktop-order-cta">ORDER NOW</a></li>
                        <li><a href="/account" className="my-account-trigger nav-main" onMouseOver={handleMouseOver}>ACCOUNT &nbsp;<span> {isHovering && <img src={iconDropdownReverse} />}{!isHovering && <img src={iconDropdownArrow} />}</span></a>
                            
                        {isHovering && (
                            <ul className="account-dropdown">
                                    <li><a href="#">My Account</a></li>
                                    <li><a href="#">Orders</a></li>
                                    <li><a href="#">Referrals</a></li>
                                    <li><LogoutButton onMouseOut={handleMouseOut}/></li>
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

