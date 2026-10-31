import { Routes, Route } from "react-router-dom";
import App from "./App";
import DashBoard from "./dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
}

export default AppRoutes;
