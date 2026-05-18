import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaAngleRight,
  FaAngleDown,
  FaCogs,
  RxCross2,
} from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "react-pro-sidebar/dist/css/styles.css";
import "../../assets/NavBar.css";
import logo from "../../assets/Images/logo.png";
import onlylogo from "../../assets/Images/onlylogo.png";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details?.logindata?.UserType
  );

  return (
    <div className={`navbar-container ${collapsed ? "collapsed" : ""}`}>
      <ProSidebar collapsed={collapsed}>
        <div className="navbar-header">
          {!collapsed ? (
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
          ) : (
            <></>
          )}
          <button className="navbar-toggle" onClick={toggleCollapse}>
            {collapsed ? (
              <img src={onlylogo} alt="Logo" className="onlylogo-image" />
            ) : (
              <FaTimes />
            )}
          </button>
        </div>

        <Menu iconShape="square">
          {loginDetails == "1" ? (
            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <FaHome className="navbar-icons" />
                    <p className="navbar-menuitem">Bookings</p>
                  </div>
                </Link>
              )}
            </MenuItem>
          ) : (
            <></>
          )}

          {loginDetails == "1" ? (
            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <FaHome className="navbar-icons" />
                    <p className="navbar-menuitem">Packages</p>
                  </div>
                </Link>
              )}
            </MenuItem>
          ) : (
            <></>
          )}

          {loginDetails == "1" ? (
            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <FaHome className="navbar-icons" />
                    <p className="navbar-menuitem">Coupons</p>
                  </div>
                </Link>
              )}
            </MenuItem>
          ) : (
            <></>
          )}

          <SubMenu
            title={
              <div style={{ display: "flex" }}>
                <FaHome className="navbar-icons" />
                {!collapsed ? <p className="navbar-menuitem">Users</p> : <></>}
              </div>
            }
            iconCollapsed={<FaAngleRight />}
          >
            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <p className="navbar-menuitem">Agent</p>
                  </div>
                </Link>
              )}
            </MenuItem>

            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <p className="navbar-menuitem">Driver</p>
                  </div>
                </Link>
              )}
            </MenuItem>
          </SubMenu>

          {loginDetails == "1" ? (
            <MenuItem>
              {collapsed ? (
                <FaHome className="navbar-icons" />
              ) : (
                <Link to="/HomePage" className="links">
                  <div style={{ display: "flex" }}>
                    <FaHome className="navbar-icons" />
                    <p className="navbar-menuitem">Packages</p>
                  </div>
                </Link>
              )}
            </MenuItem>
          ) : (
            <></>
          )}
        </Menu>
      </ProSidebar>
    </div>
  );
};

export default Navbar;
