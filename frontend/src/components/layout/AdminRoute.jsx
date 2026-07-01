import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthContext();

  if (isLoading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;