import { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Navbar() {
  const [cookies, , removeCookie] = useCookies(null);
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userEmail = cookies.Email;
  const userRole = cookies.Role;

  const handleSignOut = () => {
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";

  return (
    <nav>
      <div className="admin-circle-container">
        <NavLink
          to={userRole === "admin" ? "/AdminPage" : "/"}
          className="logo-link"
        >
          <img src="/logo.png" alt="VitalOrgans" className="logo" />
        </NavLink>
        {userRole === "admin" && (
          <div className="admin-circle" onClick={toggleDetails}>
            <span>{firstLetter}</span>
          </div>
        )}
      </div>
      {userRole === "admin" ? (
        <>
          {showDetails && (
            <div className="admin-details">
              <p>Welcome {cookies.Email}</p>
              <button className="signup-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <ul className={menuOpen ? "open" : ""}>
            <li>
              <NavLink to="/Input">Vitals</NavLink>
            </li>
            <li>
              <NavLink to="/ChartPage">Charts</NavLink>
            </li>
            <li>
              <NavLink to="/ReportsPage">Reports</NavLink>
            </li>
            <li className="circle" onClick={toggleDetails}>
              <span>{firstLetter}</span>
            </li>
            {showDetails && (
              <li className="details">
                <p>Welcome {cookies.Email}</p>
                <button className="signup-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            )}
          </ul>
          <div className="menu" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </nav>
  );
}
