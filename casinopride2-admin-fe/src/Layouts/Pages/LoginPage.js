import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/LoginPage.css";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Login } from "../../Redux/actions/auth";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import logo from "../../assets/Images/logo.png";
import { connect, useSelector } from "react-redux";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  console.log("Login Details------>", loginDetails?.logindata);
  console.log("validate Details--->", validateDetails);

  const onsubmit = () => {
    setLoading(true);
    const data = {
      Username: userName,
      Password: password,
    };

    dispatch(
      Login(data, (callback) => {
        if (callback.status) {
          toast.success("Welcome to casino pride");

          if (loginDetails?.logindata?.UserType == "7") {
            navigate("BillingList");
          } else if (loginDetails?.logindata?.UserType == "4") {
            navigate("CouponsList");
          } else if (loginDetails?.logindata?.UserType == "2") {
            navigate("Shifts");
          } else {
            navigate("NewBooking");
          }

          setLoading(false);
        } else {
          toast.error(callback.error);
          navigate("/");
          setLoading(false);
        }
      })
    );
  };

  const isButtonDisabled = !userName || !password;

  return (
    <div>
      {/* <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">
          <img
            src="https://www.casinoprideofficial.com/assets/images/logo.png"
            alt="Logo"
            className="d-inline-block align-top"
            style={{ marginRight: "10px", height: "30px" }} // Adjust the height as needed
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      </Navbar> */}

      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
        <div className="col-lg-4 col-md-6 col-sm-8 text-center">
          <img src={logo} alt="Website Logo" className="logo" />
          <h2 className="text-center title mb-4">SIGN IN</h2>
          <div className="p-4 bg-light rounded">
            <h2 className="text-center subtitle mb-2">
              WELCOME BACK TO CASINO PRIDE{" "}
            </h2>

            <div className="form-group">
              <input
                type="text"
                className="form-control mb-4"
                id="username"
                placeholder="Enter username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control mb-4"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <button
                disabled={isButtonDisabled}
                type="button"
                className="btn btn-dark btn-block btn-md w-100"
                onClick={onsubmit}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Oval
                      height={30}
                      width={30}
                      color="#4fa94d"
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="#4fa94d"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
export default LoginPage;
