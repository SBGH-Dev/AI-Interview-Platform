import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const url = "http://127.0.0.1:8000/verify-user";
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const verifyUser = async () => {
      const token = sessionStorage.getItem("Token");
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setStatus("unauthenticated");
          sessionStorage.removeItem("Token");
        } else {
          setStatus("authenticated");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setStatus("unauthenticated");
        return;
      }
    };
    verifyUser();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default ProtectedRoute;
