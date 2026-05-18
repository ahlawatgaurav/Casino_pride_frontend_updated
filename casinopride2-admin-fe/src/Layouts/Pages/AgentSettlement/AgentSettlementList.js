import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getCouponDetails,
  deleteCoupon,
  fetchAgentSettlement,
  updateAgentSettlement,
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
import deal from "../../../assets/Images/deal.png";
import generatereport from "../../../assets/Images/generatereport.png";
import Select from "react-select";

import moment from "moment";

import { generateCSVReport } from "../../../Redux/actions/billing";

const AgentSettlementList = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [couponDetails, setCouponDetails] = useState([]);

  const [agentDetails, setAgentDetails] = useState([]);
  const [filteredAgentDetails, setFilteredAgentDetails] = useState([]);
  const [filteredCouponDetails, setFilteredCouponDetails] = useState([]);

  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"));

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  const [showDownloadReportModal, setShowDownloadReportModal] = useState(false);
  const [userTypeId, setUserTypeId] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const today = moment().format("YYYY-MM-DD HH:mm:ss");
console.log('today>>>>>>',today);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const currentDate = moment().format("YYYY-MM-DD");

  const fetchAgentSettlementDetails = () => {
    dispatch(
      fetchAgentSettlement(
        loginDetails?.logindata?.Token,
        filterDate,
        userTypeId,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------Agent settt details",
              callback?.response
            );
            setAgentDetails(callback?.response?.Details);

            setFilteredAgentDetails(callback?.response?.Details);
          }
        }
      )
    );
  };

  useEffect(() => {
    fetchAgentSettlementDetails();
  }, [dispatch, filterDate,userTypeId]);



  const filterCouponListDetails = () => {
    if (searchQuery.trim() === "") {
      setFilteredAgentDetails([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = agentDetails.filter((item) =>
        item?.Name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredAgentDetails(filtered);
    }
  };

  const filterAgentSettlementDetails = (value) => {
    if (value?.trim() === "") {
      fetchAgentSettlementDetails();
      // setFilteredManagerDetails([]);
    } else {
      const lowerCaseQuery = value?.toLowerCase();
      const filtered = agentDetails?.filter((item) =>
        item?.Name?.toLowerCase()?.includes(lowerCaseQuery)
      );
      setFilteredAgentDetails(filtered);
    }
  };


  const handleViewMore = (userDetails) => {
    setSelectedUserDetails(userDetails);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
    setShowDownloadReportModal(true)
  };
  const handleCloseDownloadReport = () => {
    // setShowViewMoreModal(false);
    // setSelectedUserDetails({});
    setShowDownloadReportModal(false)
  };



  const handleToggle = (PackageId) => {
    console.log("PackageId", PackageId);
  };

  const originalDate = "2023-09-08T18:30:00.000Z";

  // Use moment to parse the original date string
  const parsedDate = moment(originalDate);

  // Add a week to the parsed date
  const newDate = parsedDate.add(7, "days");

  // Format the new date as 'YYYY-MM-DD'
  const formattedDate = newDate.format("YYYY-MM-DD");

  console.log("startDate--------------->", formattedDate);

  const addWeekToDate = (dateString) => {
    const parsedDate = moment(dateString);
    const newDate = parsedDate.add(7, "days");
    return newDate.format("YYYY-MM-DD");
  };

  

  const updateAgentSettlementFn = () => {
    if (referenceNumber == "") {
      toast.warning("Please enter reference number");
    } else {
      const data = {
        id: selectedUserDetails?.Id,
        userId: selectedUserDetails?.UserId,
        referenceNum: referenceNumber,
        isSettled: 1,
      };

      dispatch(
        updateAgentSettlement(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Settlement Done");
              fetchAgentSettlementDetails();
              handleCloseViewMore();
              setShowDownloadReportModal(true)
              // toast.error(callback.error);
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    }
  };
  const downloadReportFn = () => {
  
      const data = {
        userId: selectedUserDetails?.UserId,
        reportTypeId:1
      };

      dispatch(
        generateCSVReport(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              // toast.success("Settlement Done");
              // fetchAgentSettlementDetails();
              // handleCloseViewMore();
              toast.error(callback.error);
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    
  };

  const userTypeOptions = [
    { value: 0, label: "Select a user type" },
    { value: 5, label: "Travel Agent" },
    { value: 6, label: "Taxi Agent" },
  ];

  const handleUserTypeChange = (selectedOption) => {
    console.log('selectedOption>>',selectedOption);
    setUserTypeId(selectedOption?.value);
    fetchAgentSettlementDetails()
  };

  const generateAgentSettlementReportFn = (item) => {
    console.log('inside generateAgentSettlementReportFn>>item>>',item);
    console.log('inside generateAgentSettlementReportFn>>item>>settlementUpdateDate-->',moment.utc(item?.Date).format("YYYY-MM-DD HH:mm:ss"));
    console.log('inside generateAgentSettlementReportFn>>item>>settlementDate-->',moment.utc(item?.SettlementDate).format("YYYY-MM-DD HH:mm:ss"));

      const data = {
        userId: item?.UserId,
        isSettlementReport: 1,
        userType : item?.UserTypeId,
        // settlementDate: item?.SettlementDate == null ? today : moment.utc(item?.SettlementDate).format("YYYY-MM-DD HH:mm:ss"),
        // settlementDate:  moment.utc(item?.SettlementDate).format("YYYY-MM-DD HH:mm:ss"),
        settlementDate: item?.SettlementDate != null ? moment(item?.SettlementDate).format("YYYY-MM-DD HH:mm:ss") : null,
        settlementUpdateDate: moment(item?.Date).format("YYYY-MM-DD HH:mm:ss"),
        reportTypeId: 9,
      };
      console.log('generateAgentSettlementReportFn>>data>>',data);
      dispatch(
        generateCSVReport(
          loginDetails?.logindata?.Token,
          data,
          (callback) => {
            if (callback.status) {
              setLoading(false);
              console.log(
                "Callback------generate report",
                callback?.response?.Details?.ReportFile
              );
              window.open(callback?.response?.Details?.ReportFile, "_blank");
            } else {
              console.log("Callback------generate report error", callback.error);
              toast.error(callback.error);
            }
          }
        )
      );
    
  };
  return (
    <div>
      <h3 className="mb-4">Agent settlement List</h3>
      <div className="container">
      <div className="row">
  <div className="col-md-8 col-lg-6 mb-2">
    <p style={{ fontWeight: "bold" }}>Search</p>
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search name"
        onChange={(e) => {
          filterAgentSettlementDetails(e.target.value);
        }}
      />
    </div>
  </div>
  <div className="col-md-2 col-lg-2 mb-2">
    <p style={{ fontWeight: "bold" }}>Date</p>
    <div className="input-group">
      <input
        type="date"
        className="form-control"
        placeholder="Search name"
        max={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
    </div>
  </div>
  <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
    <p style={{ fontWeight: "bold" }}>Search By Agent</p>
    <div className="input-group">
      <Select
        className="custom-select"
        options={userTypeOptions}
        onChange={handleUserTypeChange}
      />
    </div>
  </div>

</div>

      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Name
            </th>
            <th scope="col" className="text-center table_heading">
              Settlement
            </th>

            <th scope="col" className="text-center table_heading">
              Settle Payment
            </th>

            <th scope="col" className="text-center table_heading">
              Settled Amount
            </th>
            
            <th scope="col" className="text-center table_heading">
              Generate Report
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
          ) : filteredAgentDetails.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredAgentDetails.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.Name}</td>
                <td className="manager-list">{item.Settlement}</td>

                {item.IsSettled == 0 ? (
                  <td
                    className="manager-list"
                    onClick={() => handleViewMore(item)}
                  >
                    <img src={deal} style={{ height: "30px", width: "30px" }} />
                  </td>
                ) : (
                  <td className="manager-list" style={{ color: "green" }}>
                    Amount Settled
                  </td>
                )}

                <td className="manager-list">
                  {item.IsSettled == 0 ? '-':item.SettledAmount}
                </td>

                {(item.IsSettled == 0 
                // && item?.SettlementDate != null
                ) ? (
                  <td
                    className="manager-list"
                    onClick={() => generateAgentSettlementReportFn(item)}
                  >
                    <img src={generatereport} style={{ height: "30px", width: "30px" }} />
                  </td>
                ) : (
                  <td className="manager-list" style={{ color: "green" }}>
                    -
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Agent Settlement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Reference Number"
            onChange={(e) => {
              setReferenceNumber(e.target.value);
            }}
          />

          <buttom
            className="btn btn-primary text-center mt-3"
            onClick={updateAgentSettlementFn}
          >
            Submit Settlement
          </buttom>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
      {/* <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <buttom
            className="btn btn-primary text-center mt-3"
            onClick={generateAgentSettlementReportFn}
          >
            Generate
          </buttom>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal> */}

    </div>
  );
};

export default AgentSettlementList;
