import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/global.css";
import { useDispatch, useSelector } from "react-redux";
import {
    AddUserDetails,
    EditUserDetails,
    getAllCategories,
} from "../../../Redux/actions/users";

const AddEditProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const profileData = location.state?.profileData;
    const isEdit = !!profileData;

    const loginDetails = useSelector(
        (state) => state.auth?.userDetailsAfterLogin.Details
    );

    const websiteBase = "http://localhost:3000";
    const randomSuffix = useRef(Math.random().toString(36).substr(2, 5));

    const makeSlug = (name) =>
        (name || "agent").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + randomSuffix.current;

    const existingUUID = profileData?.UUID ? String(profileData.UUID) : null;

    const [formData, setFormData] = useState({
        name: profileData?.Name || "",
        mobile: profileData?.Phone || "",
        email: profileData?.Email || "",
        categoryId: profileData?.CategoryId || "",
        url: profileData?.QRLink || `${websiteBase}/p/${existingUUID || makeSlug(profileData?.Name || "")}`,
        status: profileData?.IsUserEnabled === 1 ? true : profileData?.IsUserEnabled === undefined ? true : !!profileData?.IsUserEnabled,
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (loginDetails?.logindata?.Token) {
            dispatch(
                getAllCategories(loginDetails?.logindata?.Token, (callback) => {
                    setLoadingCategories(false);
                    if (callback.status) {
                        setCategories(callback?.response?.Details || []);
                    }
                })
            );
        }
    }, [dispatch, loginDetails]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updated = { ...formData, [name]: type === "checkbox" ? checked : value };
        if (name === "name" && !isEdit) {
            updated.url = `${websiteBase}/p/${makeSlug(value)}`;
        }
        setFormData(updated);
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "Category is required";
        }

        if (!formData.url.trim()) {
            newErrors.url = "Booking URL is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            firebaseUUID: existingUUID || formData.url.split("/p/")[1] || makeSlug(formData.name),
            name: formData.name,
            phone: formData.mobile,
            email: formData.email,
            userType: 5, // Travel Agent
            categoryId: Number(formData.categoryId),
            QRLink: formData.url,
            isUserEnabled: formData.status ? 1 : 0,
            isActive: 1,
            // Additional required fields for AddUserDetails
            address: "",
            userName: formData.mobile, // use mobile as username
            password: "ProfileUser@123",
            monthlySettlement: 0,
            NumOfBookings: profileData?.NumOfBookings || 0,
        };

        if (isEdit) {
            payload.userId = profileData.Id;
            payload.userRef = profileData.Ref;
            payload.firebaseUUID = profileData.FirebaseUUID || "9876590";

            dispatch(
                EditUserDetails(payload, loginDetails?.logindata?.Token, (callback) => {
                    setIsSubmitting(false);
                    if (callback.status) {
                        toast.success("Profile updated successfully!");
                        setTimeout(() => navigate("/ProfileList"), 1500);
                    } else {
                        toast.error(callback.error || "Failed to update profile");
                    }
                })
            );
        } else {
            dispatch(
                AddUserDetails(payload, loginDetails?.logindata?.Token, (callback) => {
                    setIsSubmitting(false);
                    if (callback.status) {
                        toast.success("Profile created successfully!");
                        setTimeout(() => navigate("/ProfileList"), 1500);
                    } else {
                        toast.error(callback.error || "Failed to create profile");
                    }
                })
            );
        }
    };

    const handleCancel = () => {
        navigate("/ProfileList");
    };

    const selectedCategory = categories.find(
        (cat) => cat.Id === parseInt(formData.categoryId)
    );

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                {isEdit ? "Edit Profile" : "Add New Profile"}
            </h3>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter agent name"
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="mobile" className="form-label">
                                    Mobile Number <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                />
                                {errors.mobile && (
                                    <div className="invalid-feedback">{errors.mobile}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="agent@example.com"
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="categoryId" className="form-label">
                                    Category <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                    className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                >
                                    <option value="">{loadingCategories ? "Loading..." : "Select Category"}</option>
                                    {categories.map((category) => (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <div className="invalid-feedback">{errors.categoryId}</div>
                                )}
                            </div>

                            {selectedCategory && (
                                <div className="col-md-12 mb-3">
                                    <div className="alert alert-info" style={{ backgroundColor: "#e3f2fd", border: "none" }}>
                                        <strong>Category Details:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Discount: {selectedCategory.DiscountPercent || 0}%</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-12 mb-3">
                                <label htmlFor="url" className="form-label">
                                    Booking URL <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.url ? "is-invalid" : ""}`}
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="Tracking URL"
                                />
                                {errors.url && (
                                    <div className="invalid-feedback">{errors.url}</div>
                                )}
                            </div>

                            <div className="col-md-12 mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="status"
                                        name="status"
                                        checked={formData.status}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="status">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : isEdit ? "Update Profile" : "Create Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddEditProfile;
