// import { useCookie } from "react-use";
import { useCookies } from 'react-cookie';

export function LogoutButton(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  //  const [value, updateCookie, deleteCookie] = useCookie("logged-into-hydrogen", {sameSite: 'None', path: '/', domain: '.homeappetitphilly.com', secure: true});
    const logout = () => {

      console.log("updating logged-in cookie", cookies);
      setCookie('logged-into-hydrogen', false);

      console.log("new value", cookies);

      removeCookie('logged-into-hydrogen');

      // fetch('/account/logout', {method: 'POST'}).then(() => {
      //   if (typeof props?.onClick === 'function') {
      //     props.onClick();
      //   }
      //   window.location.href = props.redirectUrl;
      // });
    };
  
    return (
      <a href="#" className="text-primary/50" {...props} onClick={logout}>
        Sign Out
      </a>
    );
  }