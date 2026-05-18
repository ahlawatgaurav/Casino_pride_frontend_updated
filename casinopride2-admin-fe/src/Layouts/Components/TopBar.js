import React from "react";
import { useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import "../../assets/TopBar.css";

import Navbar from "react-bootstrap/Navbar";

const TopBar = () => {
  const userDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const handleLogout = () => {
    // Handle logout logic here
  };

  return (
    <div className="top-bar">
      <div className="user-details">{userDetails?.username}</div>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default TopBar;
