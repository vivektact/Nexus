import { Navigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "./PageLoader";

const ProtectedRoute = ({ children }) => {
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return <PageLoader/>
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;