import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAgentReport, getAgentsForFilter } from "../../../Redux/actions/reports";
import { getAllCategories } from "../../../Redux/actions/users";
import * as XLSX from "xlsx";

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toNumber = (value) => Number(value || 0);
const getCategoryId = (category) => category?.Id ?? category?.idCategoryMaster;
const getCategoryName = (category) => category?.Name || category?.Category || "";

const ReportPage = () => {
  const dispatch = useDispatch();
  const loginDetails = useSelector((state) => state.auth?.userDetailsAfterLogin.Details);
  const token = loginDetails?.logindata?.Token;
  // Revenue is visible only to Admin (UserType 1). Managers, CRE, etc. see everything except revenue.
  const isAdmin = String(loginDetails?.logindata?.UserType) === "1";

  const now = new Date();
  const today = formatDateInput(now);
  const firstOfMonth = formatDateInput(new Date(now.getFullYear(), now.getMonth(), 1));

  const [filters, setFilters] = useState({
    startDate: firstOfMonth,
    endDate: today,
    categoryId: "",
    agentId: "",
  });

  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const packageColumns =
    reportData?.packageBreakdown?.length > 0
      ? Object.keys(reportData.packageBreakdown[0]).filter((k) => k !== "source")
      : [];

  useEffect(() => {
    if (!token) return;
    dispatch(
      getAllCategories(token, (cb) => {
        if (cb.status) setCategories(cb?.response?.Details || []);
        else setCategories([]);
      })
    );
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) return;
    const params = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    dispatch(
      getAgentsForFilter(token, params, (cb) => {
        if (cb.status) setAgents(cb?.response?.Details || []);
        else setAgents([]);
      })
    );
    setFilters((f) => ({ ...f, agentId: "" }));
  }, [dispatch, token, filters.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSearch = () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error("Please select start and end date");
      return;
    }
    if (filters.startDate > filters.endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    setLoading(true);
    setSearched(true);

    const params = { startDate: filters.startDate, endDate: filters.endDate };
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.agentId) params.agentId = filters.agentId;

    dispatch(
      getAgentReport(token, params, (cb) => {
        setLoading(false);
        if (cb.status) {
          const details = cb.response?.Details || {};
          setReportData({
            agents: details.agents || [],
            categoryTotals: details.categoryTotals || [],
            packageBreakdown: details.packageBreakdown || [],
            totals: details.totals || { bookings: 0, headCount: 0, revenue: 0 },
          });
        } else {
          toast.error(cb.error || "Failed to load report");
          setReportData(null);
        }
      })
    );
  };

  const selectedCategory = categories.find(
    (c) => String(getCategoryId(c)) === String(filters.categoryId)
  );
  const selectedCategoryName = getCategoryName(selectedCategory) || "";

  const handleExport = () => {
    if (!reportData) return;
    const rows = [];
    rows.push(["Alliance / Agent Report"]);
    rows.push([`Period: ${filters.startDate} to ${filters.endDate}`, "", filters.categoryId ? `Category: ${selectedCategoryName}` : "All Categories"]);
    rows.push([]);
    rows.push(["SUMMARY"]);
    rows.push(isAdmin
      ? ["Total Bookings", "Total Head Count", "Total Revenue (₹)"]
      : ["Total Bookings", "Total Head Count"]);
    rows.push(isAdmin
      ? [toNumber(reportData.totals.bookings), toNumber(reportData.totals.headCount), toNumber(reportData.totals.revenue).toFixed(2)]
      : [toNumber(reportData.totals.bookings), toNumber(reportData.totals.headCount)]);
    rows.push([]);
    if (reportData.packageBreakdown?.length > 0) {
      rows.push(["DAILY SALES - PACKAGE SOLD"]);
      rows.push(["Source", "Pax Count", ...packageColumns]);
      reportData.packageBreakdown.forEach((source) => {
        const paxCount = packageColumns.reduce((sum, col) => sum + toNumber(source[col]), 0);
        rows.push([source.source, paxCount, ...packageColumns.map((col) => toNumber(source[col]))]);
      });
      rows.push([]);
    }
    if (reportData.categoryTotals.length > 0) {
      rows.push(["CATEGORY BREAKDOWN"]);
      rows.push(isAdmin
        ? ["Category", "Bookings", "Head Count", "Revenue (₹)"]
        : ["Category", "Bookings", "Head Count"]);
      reportData.categoryTotals.forEach((cat) => {
        rows.push(isAdmin
          ? [cat.categoryName, toNumber(cat.bookings), toNumber(cat.headCount), toNumber(cat.revenue).toFixed(2)]
          : [cat.categoryName, toNumber(cat.bookings), toNumber(cat.headCount)]);
      });
      rows.push([]);
    }
    rows.push(["AGENT-WISE DETAILS"]);
    rows.push(isAdmin
      ? ["Category", "Agent Name", "Bookings", "Head Count", "Revenue (₹)"]
      : ["Category", "Agent Name", "Bookings", "Head Count"]);
    reportData.agents.forEach((agent) => {
      rows.push(isAdmin
        ? [agent.categoryName, agent.agentName, toNumber(agent.bookings), toNumber(agent.headCount), toNumber(agent.revenue).toFixed(2)]
        : [agent.categoryName, agent.agentName, toNumber(agent.bookings), toNumber(agent.headCount)]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agent Report");
    XLSX.writeFile(wb, `Agent_Report_${filters.startDate}_${filters.endDate}.xlsx`);
  };

  const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Reporting — Alliances &amp; Agents</h3>
        {reportData && (
          <button className="btn btn-success btn-sm" onClick={handleExport}>
            Export to Excel
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">End Date</label>
              <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-control" name="categoryId" value={filters.categoryId} onChange={handleChange}>
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={getCategoryId(c)} value={getCategoryId(c)}>{getCategoryName(c)}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Agent</label>
              <select className="form-control" name="agentId" value={filters.agentId} onChange={handleChange}>
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a.Id} value={a.Id}>{a.Name}</option>
                ))}
              </select>
              {filters.categoryId && agents.length === 0 && (
                <small className="text-muted">No active agents in {selectedCategoryName || "this category"}.</small>
              )}
            </div>
            <div className="col-12">
              <button className="btn btn-primary px-4" onClick={handleSearch} disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Generating report...</p>
        </div>
      )}

      {!loading && searched && reportData && (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className={isAdmin ? "col-md-4" : "col-md-6"}>
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1" style={{ fontSize: 13 }}>TOTAL BOOKINGS</p>
                  <h2 className="fw-bold text-primary">{toNumber(reportData.totals.bookings)}</h2>
                </div>
              </div>
            </div>
            <div className={isAdmin ? "col-md-4" : "col-md-6"}>
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1" style={{ fontSize: 13 }}>TOTAL HEAD COUNT</p>
                  <h2 className="fw-bold text-success">{toNumber(reportData.totals.headCount)}</h2>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="col-md-4">
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <p className="text-muted mb-1" style={{ fontSize: 13 }}>TOTAL REVENUE</p>
                    <h2 className="fw-bold text-warning">₹{fmt(reportData.totals.revenue)}</h2>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Daily Sales - Package Sold */}
          {reportData.packageBreakdown?.length > 0 && (
            <div className="card mb-4">
              <div className="card-header fw-semibold d-flex justify-content-between">
                <span>Daily Sales - Package Sold</span>
                <small className="text-muted">{filters.startDate} to {filters.endDate}</small>
              </div>
              <div className="card-body p-0">
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered mb-0">
                    <thead>
                      <tr className="table-light">
                        <th rowSpan={2} className="align-middle">Source</th>
                        <th rowSpan={2} className="text-center align-middle">Pax Count</th>
                        <th colSpan={packageColumns.length} className="text-center">Package Sold</th>
                      </tr>
                      <tr className="table-light">
                        {packageColumns.map((col) => (
                          <th key={col} className="text-center">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.packageBreakdown.map((source) => {
                        const paxCount = packageColumns.reduce((sum, col) => sum + toNumber(source[col]), 0);
                        return (
                          <tr key={source.source}>
                            <td className="fw-medium">{source.source}</td>
                            <td className="text-center fw-semibold">{paxCount}</td>
                            {packageColumns.map((col) => (
                              <td key={col} className="text-center">{toNumber(source[col])}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td className="fw-bold">Total</td>
                        <td className="text-center fw-bold">
                          {reportData.packageBreakdown.reduce(
                            (sum, s) => sum + packageColumns.reduce((inner, col) => inner + toNumber(s[col]), 0),
                            0
                          )}
                        </td>
                        {packageColumns.map((col) => (
                          <td key={col} className="text-center fw-bold">
                            {reportData.packageBreakdown.reduce((sum, s) => sum + toNumber(s[col]), 0)}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {reportData.categoryTotals.length > 0 && (
            <div className="card mb-4">
              <div className="card-header fw-semibold">Category Breakdown</div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Category</th>
                      <th className="text-center">Bookings</th>
                      <th className="text-center">Head Count</th>
                      {isAdmin && <th className="text-end">Revenue (₹)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.categoryTotals.map((cat, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ padding: "3px 10px", borderRadius: 12, backgroundColor: "#e3f2fd", color: "#1565c0", fontSize: 13, fontWeight: 500 }}>
                            {cat.categoryName}
                          </span>
                        </td>
                        <td className="text-center">{toNumber(cat.bookings)}</td>
                        <td className="text-center">{toNumber(cat.headCount)}</td>
                        {isAdmin && <td className="text-end fw-semibold">₹{fmt(cat.revenue)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Agent-wise Details */}
          <div className="card">
            <div className="card-header fw-semibold d-flex justify-content-between">
              <span>Agent-wise Details</span>
              <small className="text-muted">{reportData.agents.length} agent(s)</small>
            </div>
            <div className="card-body p-0">
              {reportData.agents.length === 0 ? (
                <div className="text-center py-4 text-muted">No booking data found for the selected filters.</div>
              ) : (
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Category</th>
                      <th>Agent Name</th>
                      <th className="text-center">Bookings</th>
                      <th className="text-center">Head Count</th>
                      {isAdmin && <th className="text-end">Revenue (₹)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.agents.map((agent, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ padding: "2px 8px", borderRadius: 10, backgroundColor: "#f3e5f5", color: "#6a1b9a", fontSize: 12 }}>
                            {agent.categoryName}
                          </span>
                        </td>
                        <td className="fw-medium">{agent.agentName}</td>
                        <td className="text-center">{toNumber(agent.bookings)}</td>
                        <td className="text-center">{toNumber(agent.headCount)}</td>
                        {isAdmin && <td className="text-end fw-semibold">₹{fmt(agent.revenue)}</td>}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan={2} className="fw-bold">TOTAL</td>
                      <td className="text-center fw-bold">{toNumber(reportData.totals.bookings)}</td>
                      <td className="text-center fw-bold">{toNumber(reportData.totals.headCount)}</td>
                      {isAdmin && <td className="text-end fw-bold">₹{fmt(reportData.totals.revenue)}</td>}
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && searched && !reportData && (
        <div className="text-center py-5 text-muted">No data found. Try different filters.</div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ReportPage;
