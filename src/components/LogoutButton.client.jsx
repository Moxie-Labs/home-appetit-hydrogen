import { useCookie } from "react-use";

export function LogoutButton(props) {
   const [value, updateCookie, deleteCookie] = useCookie("logged-into-hydrogen", {sameSite: 'Lax'});
    const logout = () => {

      console.log("cookie", value);
      // deleteCookie();
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