import React, { useState, useEffect, useRef } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getCouponDetails,
  deleteCoupon,
  getagentDiscountsList,
  EditagentDiscountsFn,
} from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
      <h3 className="mb-4">Discounts List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search discount"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterCouponListDetails();
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link to="/AddDiscountAgent" className="addLinks">
                Add Discount
              </Link>
            </button>
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Discount Percent
            </th>

            <th scope="col" className="text-center table_heading">
              Status
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>

            <th scope="col" className="text-center table_heading">
              Click on QR to download
            </th>

            <th scope="col" className="text-center table_heading">
              Discount Code
            </th>
            <th scope="col" className="text-center table_heading">
              Print
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Oval
                    height={80}
                    width={50}
                    color="#4fa94d"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              </td>
            </tr>
          ) : filteredCouponDetails.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredCouponDetails.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.DiscountPercent}</td>

                <td className="manager-list">
                  {item.IsAgentDiscountEnabled === 1 ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>In Active</span>
                  )}
                </td>

                <td className="manager-list">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="switch"
                    checked={item.IsAgentDiscountEnabled === 1}
                    onChange={() => onEditCoupon(item)}
                  />
                </td>

                <td
                  className="manager-list"
                  //    onClick={() => handleViewMore(item)}
                >
                  {item?.QRFile != null ? (
                    <div
                      onClick={() => {
                        open(item?.QRFile, item?.DiscountPercent);
                      }}
                    >
                      {" "}
                      <img
                        style={{ width: 40, height: 40 }}
                        src={item?.QRFile}
                        alt="Description of the image"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </td>
                <td className="manager-list">{item?.DiscountCode}</td>
                <td className="manager-list" style={{ textAlign: "center" }}>
                  <AiOutlinePrinter
                    style={{ height: "22px", width: "22px" }}
                    onClick={async () => {
                      await setselected(item);
                      handlePrint();
                    }}
                  />
                </td>

                {/* <td className="manager-list">
                  <div className="row">
                    <div className="col-lg-4">
                      <Link
                        to="/AddPackage"
                        state={{ userData: item }}
                        className="links"
                      >
                        <AiFillEdit />
                      </Link>
                    </div>
                    <div className="col-lg-4">
                      <AiFillDelete onClick={() => handleShow(item.Id)} />
                    </div>
                    <div
                      className="col-lg-4"
                      onClick={() => handleViewMore(item)}
                    >
                      View more
                    </div>
                  </div>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
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
