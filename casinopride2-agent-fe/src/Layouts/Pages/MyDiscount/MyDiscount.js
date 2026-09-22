import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditUserDetails } from "../../../Redux/actions/users";
import api from "../../../Service/api";

const MyDiscount = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const agentId = loginDetails?.logindata?.userId;
  const categoryId = validateDetails?.Details?.CategoryId;
  const token = loginDetails?.logindata?.Token;

  const [maxAllowed, setMaxAllowed] = useState(0);
  const [chosenDiscount, setChosenDiscount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch current agent discount from DB
    if (agentId) {
      api.CORE_PORT.get(`/core/getUserById?userId=${agentId}`)
        .then((res) => {
          const agent = res.data?.Details;
          if (agent) setChosenDiscount(Number(agent.DiscountPercent) || 0);
        }).catch(() => {});
    }

    // Fetch category max discount
    if (categoryId) {
      api.CORE_PORT.get("/core/categories", { headers: { AuthToken: token } })
        .then((res) => {
          const cats = res.data?.Details || [];
          const match = cats.find(
            (c) => (c.idCategoryMaster || c.Id) === Number(categoryId)
          );
          if (match) setMaxAllowed(Number(match.DiscountPercent || 0));
        }).catch(() => {});
    }
  }, [agentId, categoryId]);

  const commission = maxAllowed - chosenDiscount;

  const handleSave = () => {
    if (chosenDiscount > maxAllowed) {
      toast.error(`Max allowed discount is ${maxAllowed}%`);
      return;
    }
    setSaving(true);
    const data = {
      userId: agentId,
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
      QRLink: validateDetails?.Details?.QRLink || "",
      NumOfBookings: validateDetails?.Details?.NumOfBookings || 0,
      isUserEnabled: validateDetails?.Details?.IsUserEnabled,
      isActive: 1,
      discountPercent: chosenDiscount,
    };
    dispatch(
      EditUserDetails(data, token, (callback) => {
        setSaving(false);
        if (callback.status) {
          toast.success("Discount updated successfully!");
        } else {
          toast.error(callback.error || "Failed to update");
        }
      })
    );
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h4 className="mb-4">My Discount Settings</h4>

      <div className="card">
        <div className="card-body">
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Your category allows max <strong>{maxAllowed}%</strong> discount.
            Set how much you want to offer customers — the rest is your commission.
          </p>

          <div className="mb-4 mt-3">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label mb-0">
                Discount to give customers
              </label>
              <strong style={{ color: "#0d6efd", fontSize: "18px" }}>
                {chosenDiscount}%
              </strong>
            </div>
            <input
              type="range"
              className="form-range"
              min="0"
              max={maxAllowed}
              step="1"
              value={chosenDiscount}
              onChange={(e) => setChosenDiscount(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: "13px", color: "#6c757d" }}>
              <span>0%</span>
              <span>{maxAllowed}%</span>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-6">
              <div style={{ background: "#e8f5e9", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>Customer gets</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2e7d32" }}>
                  {chosenDiscount}% off
                </div>
              </div>
            </div>
            <div className="col-6">
              <div style={{ background: "#fff3e0", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>Your commission</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#e65100" }}>
                  {commission}%
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Discount Setting"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyDiscount;
