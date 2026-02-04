import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { JSX } from "react";

type Role = "ADMIN" | "MANAGER" | "USER";

type Props = {
  allowedRoles: Role[];
  children: JSX.Element;
};

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, token } = useAuth();

  // 🔐 Not logged in
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
