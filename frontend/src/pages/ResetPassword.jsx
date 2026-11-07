import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!token) {
      setMessage("Invalid password reset link.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.detail || "Failed to reset password.");
        return;
      } else {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 10000); // Redirect after 10 seconds
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Your Password</h2>
      <p>Enter your new password below.</p>

      <form onSubmit={handleResetPassword}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          required
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          minLength={8}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default ResetPassword;
