import React from "react";
import "../../assets/LoginPage.css";
import Navbar from "../Pages/Navbar";
import TopBar from "./TopBar";
import SideNav from "../Pages/SideNav";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="layout-container">
        <SideNav />

        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
