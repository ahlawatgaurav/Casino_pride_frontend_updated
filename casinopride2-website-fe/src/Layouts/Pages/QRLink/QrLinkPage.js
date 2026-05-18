import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getLongUrl } from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const QrLinkPage = () => {
  const [searchParams] = useSearchParams();
  const param = searchParams.get('code');
  const dispatch = useDispatch();

  const fetchLongURLFn = () => {
    dispatch(
      getLongUrl(param, (callback) => {
        if (callback.status) {
          console.log("Callback--------get long url", callback?.response);
        }

        window.open(callback?.response, "_blank");
      })
    );
  };

  useEffect(() => {
    fetchLongURLFn();
  }, []);
  return <div>Image</div>;
};

export default QrLinkPage;
