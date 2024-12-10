import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAppContext} from "../AppContext/AppContext.jsx";
import HttpService from "../../scripts/net/HttpService.js";
import React, {useEffect} from "react";
import {LoadingContainer} from "../LoadingContainer/LoadingContainer.jsx";
import config from "../../scripts/net/netconfig.js";

const ProtectedRoute = () => {
  const location = useLocation();
  const {setIsAuthenticated,setUsername,setLoading,loading,isAuthenticated} = useAppContext();


  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    const httpService = new HttpService();

    try {
      const response = await httpService.get(`${config.auth.verify}?token=${token}`);
      if (response.username) {
        setIsAuthenticated(true);
        setUsername(response.username)
        console.log("/verify resp: ",response.username);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    verifyToken();

  }, []);



  if(loading){
    return <LoadingContainer/>
  }


  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ targetPath: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
