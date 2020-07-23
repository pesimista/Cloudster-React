import React, { useContext } from 'react';
import { saduwux } from '../SF/Context';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({
  requireAdmin = false,
  requireLogin = true,
  redirectTo = '/notlogged',
  ...props
}) => {
  const { state } = useContext(saduwux);
  const getComponent = () => {
    if (requireLogin && !state.logStatus) {
      return (
        <Route>
          <Redirect to={redirectTo} />
        </Route>
      );
    }
    if (requireAdmin && state.user.nivel < 5) {
      return (
        <Route>
          <Redirect to='/busqueda' />
        </Route>
      );
    }
    return <Route {...props} />;
  };

  return getComponent();
};

export default ProtectedRoute;
