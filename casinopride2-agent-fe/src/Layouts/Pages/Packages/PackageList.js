import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getPackageDetails, deletePackage } from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";

const PackageList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const [itemDetails, setItemDetails] = useState([]);

  const fetchPackageDetails = () => {
    dispatch(
      getPackageDetails(loginDetails?.logindata?.Token, 4, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log(
            "Callback---------get Package Details",
            callback?.response
          );

          setFilterPackageDetails(callback?.response?.Details?.packageDetails);
          setPackageDetails(callback?.response?.Details?.packageDetails);
          setItemDetails(callback?.response?.Details?.packageItemDetails);
        }
      })
    );
  };

  useEffect(() => {
    fetchPackageDetails();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const deleteUserFunction = () => {
    dispatch(
      deletePackage(loginDetails?.logindata?.Token, userId, (callback) => {
        if (callback.status) {
          console.log("Callback--------- Delete Package ", callback?.response);
          setShowModal(false);
          fetchPackageDetails();
          toast.success("Package Deleted");
        }
      })
    );
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

  const groupedData = packageDetails.map((packageDetail) => {
    const matchingPackageItems = itemDetails.filter(
      (itemDetail) => itemDetail.PackageId === packageDetail.Id
    );
    return {
      ...packageDetail,
      packageItems: matchingPackageItems,
    };
  });

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilterPackageDetails([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = groupedData.filter((item) =>
        item?.PackageName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilterPackageDetails(filtered);
    }
  };
  return (
    <div>
      <h3 className="mb-4">Package List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search package name"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterPackageDetailsFn();
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/AddPackage"
                state={{ userType: "4" }}
                className="addLinks"
              >
                Add Packages
              </Link>
            </button>
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Package Name
            </th>
            <th scope="col" className="text-center table_heading">
              Package Weekday Price
            </th>
            <th scope="col" className="text-center table_heading">
              Package Weekend Price
            </th>
            <th scope="col" className="text-center table_heading">
              Status
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>

            <th scope="col" className="text-center table_heading">
              View more
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
          ) : groupedData.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            groupedData.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.PackageName}</td>
                <td className="manager-list">{item.PackageWeekdayPrice}</td>
                <td className="manager-list">{item.PackageWeekendPrice}</td>

                <td className="manager-list">
                  {item.IsPackageEnabled === 1 ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                <td className="manager-list">
                  <Link
                    to="/AddPackage"
                    state={{ userData: item }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td>

                <td
                  className="manager-list"
                  onClick={() => handleViewMore(item)}
                >
                  <img src={more} className="more_img" />
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
                      <AiFillDelete
                        onClick={() => handleShow(item.PackageId)}
                      />
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
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Master Agent?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteUserFunction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Package Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="manager-list ">
            Package Name: {selectedUserDetails.PackageName}
          </p>
          <p className="manager-list ">
            Package Weekday Price: {selectedUserDetails.PackageWeekdayPrice}
          </p>
          <p className="manager-list ">
            Package Weekend Price: {selectedUserDetails.PackageWeekendPrice}
          </p>
          <p className="manager-list ">
            No of Items: {selectedUserDetails.NumberOfItems}
          </p>

          <div className="row mx-auto">
            {selectedUserDetails?.packageItems?.map((item) => (
              <div
                className="col-5 mx-auto mb-3 mt-3"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  background: "#f8f8f8",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p
                  className="manager-list"
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Item Name: {item.ItemName}
                </p>
                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Tax: {item.ItemTax} %
                </p>
                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Weekday Price: {item.ItemWeekdayPrice}
                </p>
                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Weekend Price: {item.ItemWeekendPrice}
                </p>

                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Weekday Rate (Exclusive of tax): {item.ItemWeekdayRate}
                </p>

                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Weekend Rate (Exclusive of tax): {item.ItemWeekendRate}
                </p>

                <p
                  className="manager-list"
                  style={{ fontSize: "14px", marginBottom: "5px" }}
                >
                  Item Tax Name: {item.ItemTaxName}
                </p>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default PackageList;
