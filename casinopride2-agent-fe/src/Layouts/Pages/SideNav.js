import React, { useState } from "react";
import { Sidenav, Nav, Toggle } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import AdminIcon from "@rsuite/icons/Admin";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import PageIcon from "@rsuite/icons/Page";
import CouponIcon from "@rsuite/icons/Coupon";
import ExitIcon from "@rsuite/icons/Exit";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import CalendarIcon from "@rsuite/icons/Calendar";
import TagNumberIcon from "@rsuite/icons/TagNumber";
import logo from "../../assets/Images/logo.png";
import onlylogo from "../../assets/Images/onlylogo.png";
import { FaTimes } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../Redux/actions/auth";
import { ToastContainer, toast } from "react-toastify";
import ThreeColumnsIcon from "@rsuite/icons/ThreeColumns";
import "react-toastify/dist/ReactToastify.css";

import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../../assets/NavBar.css";

const SideNav = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState("1");
  const [isModalVisible, setModalVisibility] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const logoutFn = () => {
    const data = {
      UserId: loginDetails?.logindata?.userId,
    };

    dispatch(
      Logout(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          setModalVisibility(false);
          navigate("/");
        } else {
          toast.error("Invalid credentials");
          setModalVisibility(false);
        }
      })
    );
  };

  const openModal = () => {
    setModalVisibility(true);
  };
  const closeModal = () => setModalVisibility(false);

  const gotTonewBooking = () => {
    navigate("/BookingList");
    console.log("New booking------------------------------>", expanded);
  };
  const goToAgentSettelments = () => {
    navigate("/AgentSettlementList");
    console.log("Agent Settlements------------------------------>", expanded);
  };
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      {expanded ? (
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="logo-image"
            id="casinoPrideLogo"
            onClick={(expanded) => setExpanded(expanded)}
          />
        </div>
      ) : (
        <>
          {!expanded ? (
            <img
              src={onlylogo}
              alt="Logo"
              className="onlylogo-image"
              id="casinoPrideLogo"
              onClick={(expanded) => setExpanded(expanded)}
            />
          ) : (
            <FaTimes />
          )}
        </>
      )}
      <hr />
      <Sidenav expanded={expanded} defaultOpenKeys="3">
        <span style={{fontSize: "15px", fontWeight: "700", color: "black", padding: "10px 20px", border: "1px solid black", borderLeft: 0, display: "flex", alignItems: "baseline"}}>
        <AdminIcon style={{marginRight: "20px"}}/>
          {validateDetails?.Details?.Name}
        </span>
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            <Nav.Item
              eventKey="1"
              icon={<PageIcon />}
              onClick={gotTonewBooking}
            >
              <Link to="/BookingList" className="links">
                Bookings
              </Link>
            </Nav.Item>
            <Nav.Item
              eventKey="2"
              icon={<PageIcon />}
              onClick={goToAgentSettelments}
            >
              <Link to="/AgentSettlementList" className="links">
                Agent Settlements
              </Link>
            </Nav.Item>
            <Nav.Item eventKey="3" icon={<PageIcon />}>
              <Link to="/AgentsDiscounts" className="links">
                Discounts
              </Link>
            </Nav.Item>

            <Nav.Item eventKey="6" icon={<ExitIcon />} onClick={openModal}>
              Logout
            </Nav.Item>
          </Nav>
          <ToastContainer />
        </Sidenav.Body>
        <Sidenav.Toggle
          expanded={expanded}
          onToggle={(expanded) => setExpanded(expanded)}
        />
      </Sidenav>
      <Modal show={isModalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            No
          </Button>

          <Button variant="danger" onClick={logoutFn}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SideNav;
