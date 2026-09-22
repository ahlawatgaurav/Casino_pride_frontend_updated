import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, deleteUser, getAllCategories } from "../../../Redux/actions/users";

// Dummy data for profiles
const DUMMY_PROFILES = [
  {
    id: 1,
    name: "Rajesh Kumar",
    mobile: "+91 9876543210",
    email: "rajesh.kumar@example.com",
    categoryId: 1,
    categoryName: "Feet on Street Agent",
    url: "https://casinopride.com/book/agent1",
    status: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Priya Sharma",
    mobile: "+91 9876543211",
    email: "priya.sharma@example.com",
    categoryId: 2,
    categoryName: "Alliances",
    url: "https://casinopride.com/book/alliance1",
    status: true,
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Amit Patel",
    mobile: "+91 9876543212",
    email: "amit.patel@example.com",
    categoryId: 3,
    categoryName: "Taxi Agent",
    url: "https://casinopride.com/book/taxi1",
    status: true,
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Sunita Desai",
    mobile: "+91 9876543213",
    email: "sunita.desai@example.com",
    categoryId: 4,
    categoryName: "Local Agent",
    url: "https://casinopride.com/book/local1",
    status: false,
    createdAt: "2024-02-10",
  },
  {
    id: 5,
    name: "Vikram Singh",
    mobile: "+91 9876543214",
    email: "vikram.singh@example.com",
    categoryId: 1,
    categoryName: "Feet on Street Agent",
    url: "https://casinopride.com/book/agent1",
    status: true,
    createdAt: "2024-02-15",
  },
  {
    id: 6,
    name: "Neha Gupta",
    mobile: "+91 9876543215",
    email: "neha.gupta@example.com",
    categoryId: 2,
    categoryName: "Alliances",
    url: "https://casinopride.com/book/alliance2",
    status: true,
    createdAt: "2024-03-01",
  },
  {
    id: 7,
    name: "Arjun Reddy",
    mobile: "+91 9876543216",
    email: "arjun.reddy@example.com",
    categoryId: 3,
    categoryName: "Taxi Agent",
    url: "https://casinopride.com/book/taxi1",
    status: true,
    createdAt: "2024-03-05",
  },
  {
    id: 8,
    name: "Kavita Nair",
    mobile: "+91 9876543217",
    email: "kavita.nair@example.com",
    categoryId: 4,
    categoryName: "Local Agent",
    url: "https://casinopride.com/book/local2",
    status: true,
    createdAt: "2024-03-10",
  },
];

const ProfileList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProfileList, setFilterProfileList] = useState([]);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryMap, setCategoryMap] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");
  const userTypeMap = { 1: "Admin", 2: "Manager", 3: "GRE", 4: "MasterAgent", 5: "Agent", 6: "Driver", 7: "Accounts", 8: "LocalAgent", 9: "CRM Manager" };
  const agentTypes = [4, 5, 6, 8]; // UserTypes that are agent-like (use category filter)

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  // CRM Manager (UserType 9) can manage all users EXCEPT Admin (cannot see/add/edit Admins).
  const isCrmManager = Number(loginDetails?.logindata?.UserType) === 9;

  const fetchProfiles = () => {
    setLoading(true);
    dispatch(
      getUserDetails(loginDetails?.logindata?.Token, 0, (callback) => {
        setLoading(false);
        if (callback.status) {
          let data = callback?.response?.Details || [];
          if (isCrmManager) {
            data = data.filter((u) => Number(u?.UserType) !== 1);
          }
          setProfiles(data);
          setFilterProfileList(data);
        } else {
          toast.error(callback.error || "Failed to fetch profiles");
        }
      })
    );
  };

  useEffect(() => {
    if (!loginDetails?.logindata?.Token) return;
    fetchProfiles();

    // Fetch categories
    dispatch(
      getAllCategories(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          const map = {};
          (callback?.response?.Details || []).forEach((c) => { map[c.Id] = c.Name; });
          setCategoryMap(map);
        }
      })
    );

  }, [dispatch, loginDetails]);

  const getCategoryName = (item) => categoryMap[item?.CategoryId] || "-";

  // Build flat filter list: non-agent userTypes + categories for agents
  const nonAgentTypes = Object.entries(userTypeMap)
    .filter(([id]) => !agentTypes.includes(Number(id)))
    // CRM Manager cannot manage Admin users, so hide the Admin tab / add option for them.
    .filter(([id]) => !(isCrmManager && Number(id) === 1))
    .map(([id, name]) => ({ type: "userType", id: Number(id), label: name }));

  // Website is a package-visibility channel, not a user category — exclude from filters/add.
  const categoryFilters = Object.entries(categoryMap)
    .filter(([, name]) => String(name).toLowerCase() !== "website")
    .map(([id, name]) => ({ type: "category", id: Number(id), label: name }));

  const allFilters = [
    { type: "all", label: "All" },
    ...nonAgentTypes,
    ...categoryFilters,
  ];

  const applyFilters = (search, filter, allProfiles) => {
    let filtered = allProfiles || profiles;
    if (filter && filter.type !== "all") {
      if (filter.type === "userType") {
        filtered = filtered.filter((item) => Number(item?.UserType) === filter.id);
      } else if (filter.type === "category") {
        filtered = filtered.filter(
          (item) => Number(item?.CategoryId) === filter.id
        );
      }
    }
    if (search?.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.Name?.toLowerCase()?.includes(q) ||
          item?.Phone?.includes(search) ||
          item?.Email?.toLowerCase()?.includes(q)
      );
    }
    setFilterProfileList(filtered);
  };

  const filterProfileDetails = (value) => {
    const f = allFilters.find((f) => f.label === selectedFilter) || { type: "all" };
    applyFilters(value, f);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.label);
    applyFilters(searchQuery, filter);
  };

  const handleViewMore = (profile) => {
    setSelectedProfile(profile);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedProfile({});
  };

  const handleDeleteClick = (profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(
      deleteUser(loginDetails?.logindata?.Token, profileToDelete, (callback) => {
        if (callback.status) {
          toast.success("Profile deleted successfully!");
          fetchProfiles();
        } else {
          toast.error(callback.error || "Failed to delete profile");
        }
        setShowDeleteModal(false);
      })
    );
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setProfileToDelete(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">User Management</h3>
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value=""
          onChange={(e) => {
            const label = e.target.value;
            if (!label) return;
            const f = allFilters.find((x) => x.label === label);
            if (!f) return;
            if (f.type === "userType") {
              navigate("/AddUser", { state: { userType: f.id } });
            } else if (f.type === "category") {
              // Category-based agents are stored as UserType 5 (Agent) + CategoryId.
              navigate("/AddUser", { state: { userType: 5, categoryId: f.id } });
            }
          }}
        >
          <option value="">+ Add User</option>
          {allFilters
            .filter((f) => f.type !== "all")
            .map((f) => (
              <option key={f.label} value={f.label}>{f.label}</option>
            ))}
        </select>
      </div>

      {/* Flat filter tabs */}
      <div className="mb-3" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {allFilters.map((f) => {
          let count = 0;
          if (f.type === "all") count = profiles.length;
          else if (f.type === "userType") count = profiles.filter((p) => Number(p?.UserType) === f.id).length;
          else if (f.type === "category") count = profiles.filter((p) => Number(p?.CategoryId) === f.id).length;
          return (
            <button key={f.label} onClick={() => handleFilterClick(f)}
              className={`btn btn-sm ${selectedFilter === f.label ? "btn-dark" : "btn-outline-secondary"}`}>
              {f.label} <span className="ms-1 badge bg-secondary">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, mobile, email, or category"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterProfileDetails(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3"></div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Name
            </th>
            <th scope="col" className="text-center table_heading">
              Mobile
            </th>
            <th scope="col" className="text-center table_heading">
              Email
            </th>
            <th scope="col" className="text-center table_heading">
              Role
            </th>
            <th scope="col" className="text-center table_heading">
              Status
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>
            <th scope="col" className="text-center table_heading">
              Delete
            </th>
            <th scope="col" className="text-center table_heading">
              View More
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center">
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
          ) : filterProfileList.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No profiles found.
              </td>
            </tr>
          ) : (
            filterProfileList.map((item) => (
              <tr key={item.Id}>
                <td className="manager-list">{item.Name}</td>
                <td className="manager-list">
                  {item.Phone ? item.Phone : "-"}
                </td>
                <td className="manager-list">
                  {item.Email ? item.Email : "-"}
                </td>
                <td className="manager-list">
                  <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "#e3f2fd", color: "#1976d2", fontSize: "12px", fontWeight: "500" }}>
                    {/* Agents show category, others show userType */}
                    {[4,5,6,8].includes(Number(item?.UserType))
                      ? (getCategoryName(item) !== "-" ? getCategoryName(item) : userTypeMap[item?.UserType] || "-")
                      : (userTypeMap[item?.UserType] || "-")}
                  </span>
                </td>
                <td className="manager-list">
                  {item.IsUserEnabled ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>
                <td className="manager-list">
                  <Link to="/AddUser" state={{ userData: item }} className="links">
                    <AiFillEdit style={{ color: "#C5CEE0", fontSize: "20px" }} />
                  </Link>
                </td>
                <td className="manager-list" style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteClick(item.Id)}>
                  <AiFillDelete style={{ color: "#ff4d4f", fontSize: "20px" }} />
                </td>
                <td className="manager-list" onClick={() => handleViewMore(item)} style={{ cursor: "pointer" }}>
                  <img src={more} className="more_img" alt="View more" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      {/* View More Modal */}
      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-details-modal">
            <p>
              <strong>Name:</strong> {selectedProfile.Name}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedProfile.Phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedProfile.Email || "-"}
            </p>
            <p>
              <strong>Category:</strong> {selectedProfile.CategoryName}
            </p>
            <p>
              <strong>Booking URL:</strong>{" "}
              <a
                href={selectedProfile.QRLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedProfile.QRLink}
              </a>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedProfile.IsUserEnabled ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Created At:</strong> {selectedProfile.currentTs}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewMore}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this profile?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileList;
