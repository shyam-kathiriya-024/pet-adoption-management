import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useCurrentUser } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = useCurrentUser();
  const location = useLocation();

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user.user_role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
