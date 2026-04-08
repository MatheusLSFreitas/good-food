import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = sessionStorage.getItem("admin_auth") === "true";
  return isAuth ? <>{children}</> : <Navigate to="/admin-login" replace />;
};
