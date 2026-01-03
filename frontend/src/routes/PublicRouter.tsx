import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser } from "@/hooks/use-auth";

interface PublicRouterProps {
  children: ReactNode;
}

const PublicRouter = ({ children }: PublicRouterProps) => {
  const user = useCurrentUser();

  if (user) {
    // Otherwise, redirect based on user role
    const redirectPath = user.user_role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // If user is not authenticated, allow access to public routes
  return <>{children}</>;
};

export default PublicRouter;
