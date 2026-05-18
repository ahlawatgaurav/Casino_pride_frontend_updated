import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getBookingLink } from "../../../Redux/actions/users";

const PaymentLinkPayment = () => {
  const [searchParams] = useSearchParams();
  const param = searchParams.get('code');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getBookingLink(param, (callback) => {
        if (callback.status) {
          console.log("Callback--------get long url", callback?.response);
          window.open(callback?.response?.Details?.Url, "_self");
        }
      })
    );
  }, [dispatch, param]);
}

export default PaymentLinkPayment;