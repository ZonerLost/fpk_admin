import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/index";
import ContentManagementPage from "./pages/content-management/index";
import UsersPage from "./pages/users/index";
import AcedamySessionsPage from "./pages/Academy-Sessions/index";
import SettingsPage from "./pages/settings/index";
import LoginPage from "./pages/auth/LoginPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Home / dashboard */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Other modules */}
              <Route path="/content" element={<ContentManagementPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/academysessions" element={<AcedamySessionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback – unknown routes go home (ProtectedRoute will redirect to /login if needed) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
