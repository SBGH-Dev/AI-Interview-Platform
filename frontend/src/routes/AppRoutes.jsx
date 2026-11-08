import { Routes, Route } from "react-router-dom";
import App from "../pages/App.jsx";
import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
