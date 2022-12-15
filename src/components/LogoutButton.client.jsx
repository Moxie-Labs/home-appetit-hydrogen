import { useCookie } from "react-use";
import { logToConsole } from "../helpers/logger";

export function LogoutButton(props) {
   const [value, updateCookie, deleteCookie] = useCookie("logged-into-hydrogen", {sameSite: 'None', domain: '.homeappetitphilly.com'});
    const logout = () => {

      logToConsole("updating logged-in cookie", value);
      updateCookie(false);

      logToConsole("new value", value);

      fetch('/account/logout', {method: 'POST'}).then(() => {
        if (typeof props?.onClick === 'function') {
          props.onClick();
        }
        window.location.href = props.redirectUrl;
      });
    };
  
    return (
      <a href="#" className="text-primary/50" {...props} onClick={logout}>
        Sign Out
      </a>
    );
  }