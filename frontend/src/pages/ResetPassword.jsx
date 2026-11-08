import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { apiUrl } from "../api";
import { showErrorAlert, showSuccessAlert } from "../alerts";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      showErrorAlert("Passwords do not match.");
      return;
    }
    if (!token) {
      showErrorAlert("Invalid password reset link.");
      return;
    }

    try {
      const response = await fetch(apiUrl("/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorAlert(errorData.detail || "Failed to reset password.");
        return;
      } else {
        await showSuccessAlert("Your password has been reset. You can now sign in.");
        navigate("/");
      }
    } catch {
      showErrorAlert("Cannot connect to the server. Please try again.");
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
    </div>
  );
}

export default ResetPassword;
