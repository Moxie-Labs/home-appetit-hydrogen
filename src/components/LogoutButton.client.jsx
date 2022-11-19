import { useCookie } from "react-use";

export function LogoutButton(props) {
   const [value, updateCookie, deleteCookie] = useCookie("logged-into-hydrogen");
    const logout = () => {
      fetch('/account/logout', {method: 'POST'}).then(() => {
        deleteCookie();
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