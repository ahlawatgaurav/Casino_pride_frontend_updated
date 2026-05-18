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
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../Redux/actions/auth";
import { ToastContainer, toast } from "react-toastify";
import ThreeColumnsIcon from "@rsuite/icons/ThreeColumns";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/NavBar.css";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import booking from "../../assets/Images/booking.png";
import { BiMoneyWithdraw } from "react-icons/bi";
import CreditCardMinusIcon from "@rsuite/icons/CreditCardMinus";
import DocPassIcon from "@rsuite/icons/DocPass";
import PeoplesIcon from "@rsuite/icons/Peoples";

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

  const bookingsLink = () => {
    navigate("/BookingList");
  };

  const billingLink = () => {
    navigate("/BillingList");
  };

  const ManagerLink = () => {
    navigate("/ManagerList");
  };

  const openModal = () => {
    setModalVisibility(true);
  };
  const closeModal = () => setModalVisibility(false);
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
              onClick={(expanded) => setExpanded(expanded)}
            />
          ) : (
            <FaTimes />
          )}
        </>
      )}
      <hr />
      <Sidenav expanded={expanded} defaultOpenKeys={["3", "4"]}>
      <span style={{fontSize: "15px", fontWeight: "700", color: "black", padding: "10px 20px", border: "1px solid black", borderLeft: 0, display: "flex", "alignItems": "baseline"}}>
        <AdminIcon style={{marginRight: "20px"}}/>
        {validateDetails?.Details?.Name}
        </span>
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "3" ||
            loginDetails?.logindata?.UserType == "2" || 
            loginDetails?.logindata?.UserType == "7" ? (
              <Nav.Item
                eventKey="10"
                icon={<TagNumberIcon />}
                onClick={() => navigate("/Shifts")}
              >
                <Link to="/Shifts" className="links">
                  Shifts
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "3" ||
            loginDetails?.logindata?.UserType == "2" ? (
              <Nav.Item
                eventKey="1"
                icon={<DocPassIcon />}
                onClick={bookingsLink}
              >
                <Link to="/BookingList" className="links">
                  Bookings
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "7" ||
            loginDetails?.logindata?.UserType == "3" ||
            loginDetails?.logindata?.UserType == "2" ? (
              <Nav.Item eventKey="6" icon={<PageIcon />} onClick={billingLink}>
                <Link to="/BillingList" className="links">
                  Billing
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {/* {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "7" ||
            loginDetails?.logindata?.UserType == "3" ? (
              <Nav.Item eventKey="6" icon={<PageIcon />}>
                <Link to="/RegenerateBill" className="links">
                  Reprint Bill
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )} */}
            {loginDetails?.logindata?.UserType == "1" ? (
              <Nav.Menu
                placement="rightStart"
                eventKey="3"
                title="Users"
                icon={<PeoplesIcon />}
              >
                <Nav.Item
                  eventKey="3-1"
                  onClick={() => navigate("/ManagerList")}
                >
                  <Link to="/ManagerList" className="links">
                    Manager
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-2" onClick={() => navigate("/GREList")}>
                  <Link to="/GREList" className="links">
                    GRE
                  </Link>
                </Nav.Item>
                <Nav.Item
                  eventKey="3-3"
                  onClick={() => navigate("/MasterAgent")}
                >
                  {" "}
                  <Link to="/MasterAgent" className="links">
                    Master Agent
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3-4" onClick={() => navigate("/AgentList")}>
                  <Link to="/AgentList" className="links">
                    Travel Agent
                  </Link>
                </Nav.Item>
                <Nav.Item
                  eventKey="3-4"
                  onClick={() => navigate("/DriverList")}
                >
                  <Link to="/DriverList" className="links">
                    Taxi Agent
                  </Link>
                </Nav.Item>
                <Nav.Item
                  eventKey="3-4"
                  onClick={() => navigate("/LocalAgentList")}
                >
                  <Link to="/LocalAgentList" className="links">
                    Local Agent
                  </Link>
                </Nav.Item>
                <Nav.Item
                  eventKey="3-4"
                  onClick={() => navigate("/AccountsList")}
                >
                  <Link to="/AccountsList" className="links">
                    Accounts
                  </Link>
                </Nav.Item>
              </Nav.Menu>
            ) : (
              <></>
            )}
            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item
                eventKey="6"
                icon={<CouponIcon />}
                onClick={() => navigate("/CouponsList")}
              >
                <Link to="/CouponsList" className="links">
                  Coupons
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item
                eventKey="7"
                icon={<ThreeColumnsIcon />}
                onClick={() => navigate("/PackageList")}
              >
                <Link to="/PackageList" className="links">
                  Packages
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ? (
              <Nav.Item
                eventKey="71"
                icon={<CreditCardMinusIcon />}
                onClick={() => navigate("/AgentSettlementList")}
              >
                <Link to="/AgentSettlementList" className="links">
                  Agent Settlement
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" ||
            loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Item
                eventKey="7"
                icon={<CalendarIcon />}
                onClick={() => navigate("/FutureBookingDates")}
              >
                <Link to="/FutureBookingDates" className="links">
                  Future Booking Dates
                </Link>
              </Nav.Item>
            ) : (
              <></>
            )}

            {loginDetails?.logindata?.UserType == "1" || loginDetails?.logindata?.UserType == "4" ? (
              <Nav.Menu
                placement="rightStart"
                eventKey="10"
                title="Discounts"
                icon={<MagicIcon />}
              >
                  <Nav.Item
                    eventKey="3-1"
                    onClick={() => navigate("/Discountonwebsite")}
                  >
                    <Link to="/Discountonwebsite" className="links">
                      Website Discounts
                    </Link>
                  </Nav.Item>
                
                <Nav.Item
                  eventKey="3-2"
                  onClick={() => navigate("/DiscountOnPanel")}
                >
                  <Link to="/DiscountOnPanel" className="links">
                    Panel Discounts
                  </Link>
                </Nav.Item>
              </Nav.Menu>
            ) : (
              <></>
            )}

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
