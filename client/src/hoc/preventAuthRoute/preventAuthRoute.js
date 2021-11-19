import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PreventAuthRoute = (props) => {
  const users = useSelector((state) => state.users);
  return <>{users.auth ? <Redirect to="/dashboard" /> : props.children}</>;
};

export default PreventAuthRoute;
