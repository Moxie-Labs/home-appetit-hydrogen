import {useState} from 'react';
import logo from "../assets/logo.png";
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
                {!isOrdering &&
                <div className="nav-wrapper">
                    <ul>
                        <li><a href={`https://${rootUrl}/pages/how-it-works`}>HOW IT WORKS</a></li>
                        <li><a href={`https://${rootUrl}/pages/why-home-appetit`}>WHY HOME APPETIT</a></li>
                        <li><a href={`https://${rootUrl}/blogs/blog`}>BLOG</a></li>
                    </ul>
                </div>
                }
                <div className="logo">
                    <a href={`https://${rootUrl}`}>
                     <img src={logo} />
                     </a>
                </div>
                {!isOrdering &&
                <div className="nav-wrapper">
                    <ul>
                        <li><a href="/order" className="btn-order-cta">ORDER NOW</a></li>
                        <li><a href="/account" className="my-account-trigger" onMouseOver={handleMouseOver}>ACCOUNT</a>
                            
                        {isHovering && (
                            <ul className="account-dropdown">
                                    <li><a href="#">My Account</a></li>
                                    <li><a href="#">Orders</a></li>
                                    <li><a href="#">Referrals</a></li>
                                    <li><LogoutButton onMouseOut={handleMouseOut} redirectURL={`https://${rootUrl}`}/></li>
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
