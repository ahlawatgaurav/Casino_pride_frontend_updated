import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getLongUrl } from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const QrLinkPage = () => {
  let { param } = useParams();
  const dispatch = useDispatch();
  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const fetchCouponCodes = () => {
    dispatch(
      getLongUrl(param, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Callback--------get long url", callback?.response);
        }

        window.open(callback?.response, "_blank");
      })
    );
  };

  useEffect(() => {
    fetchCouponCodes();
  }, []);
  return <div>QrLinkPage</div>;
};

export default QrLinkPage;
