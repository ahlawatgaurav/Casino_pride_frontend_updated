import React from "react";
import { useSelector } from "react-redux";
import { Logout } from "../../Redux/actions/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const HomePage = () => {
  return (
    <div>
      <p>Shifts </p>
    </div>
  );
};

export default HomePage;
