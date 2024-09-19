import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoute;
