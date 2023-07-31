import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import Login from '../pages/auth/LoginPage';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {

  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenStored = localStorage.getItem('accessToken');
    setToken(tokenStored);
  }, []);

  if(!token){
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}
