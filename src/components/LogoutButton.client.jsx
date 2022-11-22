import { useCookie } from "react-use";

export function LogoutButton(props) {
   const [value, updateCookie, deleteCookie] = useCookie("logged-into-hydrogen", {sameSite: 'None', domain: '.homeappetitphilly.com'});
    const logout = () => {

      console.log("updating logged-in cookie", value);
      updateCookie(false);

      console.log("new value", value);

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