import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/global.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCategoryDiscount, addCategory } from "../../../Redux/actions/users";

const AddEditCategory = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const categoryData = location.state?.categoryData;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        discountPercentage: "",
        isActive: 1,
    });

    const loginDetails = useSelector(
        (state) => state.auth?.userDetailsAfterLogin.Details
    );

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // If editing, populate form with existing data
    useEffect(() => {
        if (categoryData) {
            setFormData({
                name: categoryData.Name || "",
                description: categoryData.Description || "",
                discountPercentage: categoryData.DiscountPercent || "",
                isActive: categoryData.IsActive !== undefined ? categoryData.IsActive : 1,
            });
        }
    }, [categoryData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        }

        if (!formData.discountPercentage && formData.discountPercentage !== 0) {
            newErrors.discountPercentage = "Discount percentage is required";
        } else if (
            parseFloat(formData.discountPercentage) < 0 ||
            parseFloat(formData.discountPercentage) > 100
        ) {
            newErrors.discountPercentage = "Discount must be between 0 and 100";
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

        setLoading(true);

        const payload = {
            categoryName: formData.name,
            discountPercentage: parseFloat(formData.discountPercentage),
            description: formData.description,
            isActive: formData.isActive
        };

        const token = loginDetails?.logindata?.Token;

        if (categoryData) {
            // Edit Mode
            payload.categoryId = categoryData.Id;
            dispatch(
                updateCategoryDiscount(payload, token, (callback) => {
                    setLoading(false);
                    if (callback.status) {
                        toast.success("Category updated successfully!");
                        setTimeout(() => {
                            navigate("/CategoryList");
                        }, 1500);
                    } else {
                        toast.error(callback.error || "Failed to update category");
                    }
                })
            );
        } else {
            // Add Mode
            dispatch(
                addCategory(payload, token, (callback) => {
                    setLoading(false);
                    if (callback.status) {
                        toast.success("Category created successfully!");
                        setTimeout(() => {
                            navigate("/CategoryList");
                        }, 1500);
                    } else {
                        toast.error(callback.error || "Failed to create category");
                    }
                })
            );
        }
    };

    const handleCancel = () => {
        navigate("/CategoryList");
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                {categoryData ? "Edit Category" : "Add New Category"}
            </h3>

            <div className="card">
                <div className="card-body">
                    {categoryData && (
                        <div className="alert alert-info mb-4">
                            <strong>Note:</strong> You are editing the pricing rules for <strong>{categoryData.Name}</strong>.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Category Name */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="name" className="form-label">
                                    Category Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Feet on Street Agent"
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of this category"
                                    rows="3"
                                />
                            </div>

                            {/* Discount Percentage */}
                            <div className="col-md-12 mb-3">
                                <label htmlFor="discountPercentage" className="form-label">
                                    Discount Percentage <span style={{ color: "red" }}>*</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.discountPercentage ? "is-invalid" : ""}`}
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleChange}
                                        placeholder="10"
                                    />
                                    <span className="input-group-text">%</span>
                                    {errors.discountPercentage && (
                                        <div className="invalid-feedback">
                                            {errors.discountPercentage}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="col-md-12 mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive === 1}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="isActive">
                                        Category Status: <strong>{formData.isActive === 1 ? "Active" : "Inactive"}</strong>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {categoryData ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    categoryData ? "Update Category" : "Create Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddEditCategory;
