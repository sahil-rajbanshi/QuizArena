import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const NotFoundRedirect = () => {
  const { isAuthenticated } = useAuthContext();
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

export default NotFoundRedirect;