export function LogoutButton(props) {
    const logout = () => {
      fetch('/account/logout', {method: 'POST'}).then(() => {
        if (typeof props?.onClick === 'function') {
          props.onClick();
        }
        window.location.href = '/account';
      });
    };
  
    return (
      <a href="#" className="text-primary/50" {...props} onClick={logout}>
        LOGOUT
      </a>
    );
  }