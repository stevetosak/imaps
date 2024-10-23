import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {

    return <Navigate to="/Login" state={{ targetPath: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
