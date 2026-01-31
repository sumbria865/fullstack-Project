import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allowedRoles: ("ADMIN" | "MANAGER" | "USER")[];
  children: JSX.Element;
};

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, loading } = useAuth();
  console.log("User = ",user);
  const token = localStorage.getItem("token");
  console.log("token=",token);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

if (!allowedRoles.includes(user.role)) {
  return <Navigate to="/dashboard" replace />;
}

  

  return children;
};

export default ProtectedRoute;
