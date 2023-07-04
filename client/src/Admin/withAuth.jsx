import React from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const tokenInfo = JSON.parse(localStorage.getItem('token-info'));
    const isLoggedIn = !!tokenInfo;
    const permissions = tokenInfo?.permissions ?? []; // Add null-check and default value
    const navigate = useNavigate()
    // Check if the user is logged in and has the necessary permissions
    if (!isLoggedIn || !permissions.includes('access-protected-page')) {
      navigate("/")
      console.log("noo");
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
