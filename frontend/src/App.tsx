import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import AdminDashboard from "./pages/admin-dashboard";
import AuthPage from "./pages/auth";
import Home from "./pages/home";
import PetDetails from "./pages/pet-details";
import PetListing from "./pages/pet-listing";
import UserDashboard from "./pages/user-dashboard";
import ProtectedRoute from "./routes/ProtectedRouter";
import PublicRoute from "./routes/PublicRouter";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path="/pets" element={<PetListing />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
