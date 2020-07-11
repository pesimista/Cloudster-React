import React, { useContext } from "react";
import { saduwux } from "../SF/Context";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({
  requireAdmin = false,
  redirectToAdmin = "/notFound",
  requireLogin = true,
  redirectTo = "/notlogged",
  ...rest
}) => {
  const { state } = useContext(saduwux);
  const children = () => {
    if (requireLogin && !state.logStatus) { return <Redirect to={redirectTo} />; }
    if (requireAdmin && state.user.nivel < 5) { return <Redirect to={redirectToAdmin || redirectTo} />; }
    return rest.children;
  }
  return <Route {...rest} render={children} />
};

export default ProtectedRoute;