import {useState} from 'react';
import logo from "../assets/logo.png";
import { LogoutButton } from './LogoutButton.client';

export function Header(props){
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const {customerAccessToken} = props;

    let accountSection = <li><a href="/account/login" className='btn-login-cta'>LOGIN</a></li>
    
    if (customerAccessToken) 
        accountSection = <li><a href="/account" className="my-account-trigger" onMouseOver={handleMouseOver} >MY ACCOUNT</a>              
            {isHovering && (
                <ul className="account-dropdown">
                        <li><LogoutButton onMouseOut={handleMouseOut}/></li>
                    </ul>
                )}
            </li>;



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
                        <li><a href="/order" className="btn-order-cta">ORDER NOW</a></li>
                        {accountSection}
                        
                    </ul>
                </div>
            </div>
        </div>
   );
}

