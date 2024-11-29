import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useContext, useEffect} from "react";
import {AuthContext} from "../AuthContext/AuthContext.jsx";

const ProtectedRoute = () => {
  const location = useLocation();
  const {isAuthenticated} = useContext(AuthContext)


  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ targetPath: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
