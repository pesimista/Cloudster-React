import React, { useContext } from 'react';
import { saduwux } from '../SF/Context';
import { Redirect, Route, useLocation } from 'react-router-dom';

const ProtectedRoute = ({
  requireAdmin = false,
  redirectToAdmin = '/notFound',
  requireLogin = true,
  redirectTo = '/notlogged',
  ...props
}) => {
  const location = useLocation();
  const { state } = useContext(saduwux);
  console.log(requireLogin, !state.logStatus, requireAdmin, state.user.nivel);
  const getComponent = () => {
    if (requireLogin && !state.logStatus && !location.pathname === ' ') {
      return (
        <Route>
          <Redirect to={redirectTo} />
        </Route>
      );
    }
    if (requireAdmin && state.user.nivel < 5) {
      return (
        <Route>
          <Redirect to={redirectToAdmin || redirectTo} />
        </Route>
      );
    }
    return <Route {...props} />;
  };

  return getComponent();
};

export default ProtectedRoute;
