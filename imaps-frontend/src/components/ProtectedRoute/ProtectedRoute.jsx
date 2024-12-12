import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAppContext} from "../AppContext/AppContext.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import React, {useEffect} from "react";
import {LoadingContainer} from "../LoadingContainer/LoadingContainer.jsx";
import config from "../../scripts/net/netconfig.js";
import {verifyToken} from "../../scripts/util/verifyToken.js";

const ProtectedRoute = () => {
  const location = useLocation();
  const {loading,isAuthenticated} = useAppContext();


  if(loading){
    return <LoadingContainer/>
  }


  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ targetPath: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
