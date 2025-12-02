// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { auth } = useAuth(); // auth = { isAuthenticated, token, user }
  const location = useLocation();

  const isAuthenticated = auth?.isAuthenticated;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // If authenticated, render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
