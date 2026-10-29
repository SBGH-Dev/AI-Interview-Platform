import "./App.css";

import { BrainCircuit, ArrowLeft } from "lucide-react";

import { use, useState } from "react";

function App() {
  const currentYear = new Date().getFullYear();
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [forgetpassword, setForgotPassword] = useState(false);

  const handleSignUpLinkClick = (event) => {
    event.preventDefault();
    setIsLogin(!isLogin);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setFullName("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Password Dont Match");
    } else {
      setError("");
    }
  };

  const handleForgetPawwordClick = (event) => {
    event.preventDefault();
    setForgotPassword(true);
  };

  const handleBackToHomeClick = (event) => {
    event.preventDefault();
    setForgotPassword(false);
    setIsLogin(true);
    setError("");
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="auth-container">
      {!forgetpassword && (
        <>
          <div className="auth-left">
            <div className="brand">
              <BrainCircuit size={28} />
              <h2>InterviewAI</h2>
            </div>

            <div className="hero-content">
              <p className="eyebrow">SMARTER HIRING STARTS HERE</p>
              <h1>Hire smarter. Interview better.</h1>
              <p>
                Streamline your hiring process with AI-powered interviews and
                intelligent evaluations.
              </p>
            </div>

            <div className="footer">
              <p>©{currentYear} InterviewAI</p>
            </div>
          </div>

          <div className="auth-right">
            <div className="form-container">
              <h2>{isLogin ? "Welcome Back" : "Create An Account"}</h2>
              <p>
                {isLogin
                  ? "Enter your credentials to access your dashboard"
                  : "Create your account to get started"}
              </p>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      required
                      id="name"
                      placeholder="Enter Your Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    ></input>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    required
                    id="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    required
                    id="password"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="confpass">Confirm Password</label>
                    <input
                      type="password"
                      required
                      id="confpass"
                      placeholder="Confirm Your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>
                  </div>
                )}

                {isLogin && (
                  <a href="#" onClick={handleForgetPawwordClick}>
                    Forgot Password?
                  </a>
                )}

                {error && <p className="pass-error">{error}</p>}
                <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
              </form>
              <a
                href="#"
                className="sign-up-link"
                onClick={handleSignUpLinkClick}
              >
                {isLogin
                  ? "Dont Have An Account? Sign Up"
                  : "Already Have An Account? Sign in"}
              </a>
            </div>
          </div>
        </>
      )}
      {forgetpassword && (
        <>
          <div className="forget-pass-page">
            <h1>Reset your password</h1>
            <p>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleForgotPassword}>
              <div className="forget-pass-page-input-group">
                <label htmlFor="sendemail">Email Address</label>
                <input
                  type="email"
                  id="sendemail"
                  required
                  placeholder="email@example.com"
                ></input>
              </div>
              <button type="submit">Send Link</button>
            </form>

            <div className="back-to-home">
              <ArrowLeft size={20} />
              <a href="#" onClick={handleBackToHomeClick}>
                Back To Login Page
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
