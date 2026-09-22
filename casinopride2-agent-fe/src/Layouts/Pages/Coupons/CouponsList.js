import React, { useState, useEffect, useRef } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getCouponDetails,
  deleteCoupon,
  getagentDiscountsList,
  EditagentDiscountsFn,
  EditUserDetails,
} from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import api from "../../../Service/api";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import moment from "moment";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";

const CouponsList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const printableContentRef = useRef();

  const [selected, setselected] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [couponDetails, setCouponDetails] = useState([]);
  const [filteredCouponDetails, setFilteredCouponDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    setUserId(Id);
  };

  const open = (imageUrl, per) => {
    // window.open("_blank")
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `agent-${per}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = useReactToPrint({
    content: () => printableContentRef.current,
  });

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const [bookingLink, setBookingLink] = useState("");
  const [categoryMaxDiscount, setCategoryMaxDiscount] = useState(0);
  const [myDiscount, setMyDiscount] = useState(0);
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const agentId = loginDetails?.logindata?.userId;
    const categoryId = validateDetails?.Details?.CategoryId;
    const token = loginDetails?.logindata?.Token;
    if (!agentId) return;

    // Fetch agent's QR link and saved discount
    api.CORE_PORT.get(`/core/getUserById?userId=${agentId}`)
      .then((res) => {
        const agent = res.data?.Details;
        if (agent) {
          setBookingLink(agent.QRLink || "");
          setMyDiscount(Number(agent.DiscountPercent) || 0);
        }
      }).catch(() => {});

    // Fetch category max discount
    if (categoryId && token) {
      api.CORE_PORT.get("/core/categories", { headers: { AuthToken: token } })
        .then((res) => {
          const cats = res.data?.Details || [];
          const match = cats.find((c) => Number(c.Id) === Number(categoryId));
          if (match) setCategoryMaxDiscount(Number(match.DiscountPercent) || 0);
        }).catch(() => {});
    }
  }, [loginDetails?.logindata?.userId, validateDetails?.Details?.CategoryId]);

  // Old saved discounts could exceed the category max (e.g. 15% saved but max 10%),
  // which showed a negative commission. Clamp the displayed/used value to the max.
  useEffect(() => {
    if (categoryMaxDiscount > 0 && myDiscount > categoryMaxDiscount) {
      setMyDiscount(categoryMaxDiscount);
    }
  }, [categoryMaxDiscount, myDiscount]);

  const handleSaveMyDiscount = () => {
    if (myDiscount > categoryMaxDiscount) {
      toast.error(`Max allowed is ${categoryMaxDiscount}%`);
      return;
    }
    setSavingDiscount(true);
    const data = {
      userId: loginDetails?.logindata?.userId,
      userRef: validateDetails?.Details?.Ref,
      firebaseUUID: validateDetails?.Details?.UUID || "9876590",
      name: validateDetails?.Details?.Name,
      phone: validateDetails?.Details?.Phone,
      email: validateDetails?.Details?.Email || "",
      address: validateDetails?.Details?.Address || "",
      userName: validateDetails?.Details?.Username,
      password: validateDetails?.Details?.Password,
      userType: validateDetails?.Details?.UserType,
      categoryId: validateDetails?.Details?.CategoryId,
      monthlySettlement: validateDetails?.Details?.MonthlySettlement || 0,
      QRLink: bookingLink || validateDetails?.Details?.QRLink || "",
      NumOfBookings: validateDetails?.Details?.NumOfBookings || 0,
      isUserEnabled: validateDetails?.Details?.IsUserEnabled,
      isActive: 1,
      discountPercent: myDiscount,
    };
    dispatch(
      EditUserDetails(data, loginDetails?.logindata?.Token, (callback) => {
        setSavingDiscount(false);
        if (callback.status) toast.success("Discount updated!");
        else toast.error(callback.error || "Failed to update");
      })
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const fetchCouponDetails = () => {
    dispatch(
      getagentDiscountsList(
        loginDetails?.logindata?.Token,
        loginDetails?.logindata?.userId,
        (callback) => {
          if (callback.status) {
            setLoading(false);

            setFilterPackageDetails(callback?.response?.Details);
            setCouponDetails(callback?.response?.Details);
            setFilteredCouponDetails(callback?.response?.Details);
          }
        }
      )
    );
  };

  useEffect(() => {
    fetchCouponDetails();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const filterCouponListDetails = () => {
    if (searchQuery.trim() === "") {
      setFilteredCouponDetails(() => couponDetails);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = couponDetails.filter((item) =>
        `${item?.DiscountPercent}`.includes(lowerCaseQuery)
      );
      setFilteredCouponDetails(filtered);
    }
  };

  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});

  const handleViewMore = (userDetails) => {
    setSelectedUserDetails(userDetails);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (PackageId) => {
    console.log("PackageId", PackageId);
  };

  const addWeekToDate = (dateString) => {
    const parsedDate = moment(dateString);
    const newDate = parsedDate.add(7, "days");
    return newDate.format("YYYY-MM-DD");
  };

  const onEditCoupon = (userData) => {
    const data = {
      agentDiscountId: userData?.Id,
      agentDiscountRef: userData?.Ref,
      IsActive: 1,
      isAgentDiscountEnabled: userData.IsAgentDiscountEnabled === 1 ? 0 : 1,
    };

    dispatch(
      EditagentDiscountsFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Agents Discounts Edited");
          toast.error(callback.error);
          fetchCouponDetails();
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  return (
    <div>
      <h3 className="mb-4">Discounts</h3>

      {/* Booking Link */}
      <div style={{ background: "#e8f4fd", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", border: "1px solid #b3d9f5" }}>
        <div style={{ fontSize: "13px", color: "#6c757d", marginBottom: "6px", fontWeight: "600" }}>YOUR BOOKING LINK</div>
        {bookingLink ? (
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              readOnly
              value={bookingLink}
              className="form-control"
              style={{ fontSize: "13px", background: "#fff" }}
            />
            <button className="btn btn-sm btn-outline-primary" style={{ whiteSpace: "nowrap" }} onClick={copyLink}>
              {linkCopied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span style={{ color: "#6c757d", fontSize: "13px" }}>No booking link generated yet.</span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                const name = validateDetails?.Details?.Name || "agent";
                const id = loginDetails?.logindata?.userId;
                const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 30) + "-" + id;
                const link = `https://booking.casinoprideofficial.com/?UserId=${id}`;
                api.CORE_PORT.put("/core/user", {
                  userId: id,
                  userRef: validateDetails?.Details?.Ref,
                  firebaseUUID: slug,
                  name: validateDetails?.Details?.Name,
                  phone: validateDetails?.Details?.Phone,
                  email: validateDetails?.Details?.Email || "",
                  address: validateDetails?.Details?.Address || "",
                  userName: validateDetails?.Details?.Username,
                  password: validateDetails?.Details?.Password,
                  userType: validateDetails?.Details?.UserType,
                  categoryId: validateDetails?.Details?.CategoryId,
                  monthlySettlement: validateDetails?.Details?.MonthlySettlement || 0,
                  QRLink: link,
                  NumOfBookings: validateDetails?.Details?.NumOfBookings || 0,
                  isUserEnabled: validateDetails?.Details?.IsUserEnabled,
                  isActive: 1,
                  discountPercent: myDiscount,
                }, { headers: { AuthToken: loginDetails?.logindata?.Token } })
                .then(() => {
                  setBookingLink(link);
                  toast.success("Booking link generated!");
                }).catch(() => toast.error("Failed to generate link"));
              }}
            >
              Generate Link
            </button>
          </div>
        )}
      </div>

      {/* My Discount Setting */}
      {categoryMaxDiscount > 0 && (
        <div style={{ background: "#f8f9fa", borderRadius: "8px", padding: "16px", marginBottom: "24px", border: "1px solid #dee2e6" }}>
          <div style={{ fontSize: "13px", color: "#6c757d", fontWeight: "600", marginBottom: "10px" }}>
            MY BOOKING LINK DISCOUNT &nbsp;
            <span style={{ color: "#0d6efd" }}>(Max: {categoryMaxDiscount}%)</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <input
              type="range"
              className="form-range"
              min="0"
              max={categoryMaxDiscount}
              step="1"
              value={myDiscount}
              onChange={(e) => setMyDiscount(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: "bold", fontSize: "18px", color: "#0d6efd", minWidth: "45px" }}>{myDiscount}%</span>
            <button className="btn btn-sm btn-primary" onClick={handleSaveMyDiscount} disabled={savingDiscount}>
              {savingDiscount ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="d-flex justify-content-between mt-2" style={{ fontSize: "12px" }}>
            <span style={{ color: "#198754" }}>Customer gets: <strong>{myDiscount}% off</strong></span>
            <span style={{ color: "#dc3545" }}>Your commission: <strong>{Math.max(0, categoryMaxDiscount - myDiscount)}%</strong></span>
          </div>
        </div>
      )}

      <ToastContainer />
      <div style={{ display: "none" }}>
        <div
          className="mx-auto"
          ref={printableContentRef}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <img style={{ width: 100, height: 100 }} src={selected?.QRFile} />
        </div>
      </div>
      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Coupon Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="manager-list ">
            Coupon Title: {selectedUserDetails.CouponTitle}
          </p>
          <p className="manager-list ">
            Initial : {selectedUserDetails.Initial}
          </p>
          <p className="manager-list ">
            Series Start: {selectedUserDetails.SeriesStart}
          </p>
          <p className="manager-list ">
            Series End: {selectedUserDetails.SeriesEnd}
          </p>
          <p className="manager-list ">
            Start Date: {addWeekToDate(selectedUserDetails.StartDate)}
          </p>
          <p className="manager-list ">
            End Date: {addWeekToDate(selectedUserDetails.EndDate)}
          </p>

          <p className="manager-list ">
            Remaining Coupons: {selectedUserDetails.RemainingCoupons}
          </p>
          <p className="manager-list ">
            Total Coupons: {selectedUserDetails.TotalCoupons}
          </p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default CouponsList;
