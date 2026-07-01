import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;