import { Link } from "react-router-dom";
import { BrainCircuit, CircleUserRound } from "lucide-react";
import "./NavBar.css";

import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    sessionStorage.removeItem("Token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/home">
        <BrainCircuit size={28} className="app-icon" />
      </Link>

      <div className="nav-links">
        <Link to="/jobs">Jobs</Link>
        <Link to="/interviews">Interviews</Link>
        <Link to="/results">Results</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="nav-buttons">
        <button onClick={handleLogout}>Logout</button>
        <Link to="/profile" className="profile-icon">
          <CircleUserRound size={28} />
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
