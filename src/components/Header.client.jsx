import {useState} from 'react';
import logo from "../assets/logo.png";
import { LogoutButton } from './LogoutButton.client';

export function Header(){
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };

   return(
        <div className="header">
            <div className="header-inner">
                <div className="nav-wrapper">
                    <ul>
                        <li><a href="#">HOW IT WORKS</a></li>
                        <li><a href="#">WHY HOME APPETIT</a></li>
                        <li><a href="#">BLOG</a></li>
                    </ul>
                </div>
                <div className="logo">
                    <a href="/">
                     <img src={logo} />
                     </a>
                </div>
                <div className="nav-wrapper">
                    <ul>
                        <li><a href="#" className="btn-order-cta">ORDER NOW</a></li>
                        <li><a href="#" className="my-account-trigger" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>MY ACCOUNT</a>
                            
                        {isHovering && (
                            <ul className="account-dropdown">
                                    <li><LogoutButton /></li>
                                </ul>
                            )}
                           
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
   );
}

