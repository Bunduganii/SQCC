import { useState, useEffect } from "react";
import {
  LuSearch,
  LuFilter,
  LuEye,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
} from "react-icons/lu";
import "./MyShipment.css";

const STATUS_LABELS = {
  pending: "Pending",
  submitted: "Under Review",
  in_inspection: "Under Review",
  in_lab: "Lab Testing",
  approved: "Approved",
  rejected: "Rejected",
};

const MyShipment = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shipmentsData, setShipmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/shipment/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((s) => ({
          id: `SHP-${s.id}`,
          product: s.product_name,
          category: s.product_category,
          quantity: s.quantity,
          submitted: s.submitted_at
            ? new Date(s.submitted_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—",
          status: STATUS_LABELS[s.status] || s.status,
        }));
        setShipmentsData(formatted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredShipments = shipmentsData.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(search.toLowerCase()) ||
      shipment.product.toLowerCase().includes(search.toLowerCase()) ||
      shipment.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const total = shipmentsData.length;
  const countByStatus = (label) =>
    shipmentsData.filter((s) => s.status === label).length;

  return (
    <main className="shipments-page">

      {/* Header */}
      <div className="shipments-header">
        <div>
          <h1>Shipments</h1>
          <p>View and track all shipments submitted by your company.</p>
        </div>

        <button className="new-shipment-btn">
          <LuPlus size={18} />
          Submit Shipment
        </button>
      </div>

      {/* Summary */}
      <div className="shipment-summary">

        <div className="summary-item">
          <span>Total Shipments</span>
          <strong>{total}</strong>
        </div>

        <div className="summary-item">
          <span>Pending</span>
          <strong>{countByStatus("Pending")}</strong>
        </div>

        <div className="summary-item">
          <span>Under Review</span>
          <strong>{countByStatus("Under Review")}</strong>
        </div>

        <div className="summary-item">
          <span>Approved</span>
          <strong>{countByStatus("Approved")}</strong>
        </div>

        <div className="summary-item">
          <span>Rejected</span>
          <strong>{countByStatus("Rejected")}</strong>
        </div>

      </div>

      {/* Table Card */}
      <section className="shipments-card">

        {/* Table Toolbar */}
        <div className="shipments-toolbar">

          <div className="search-box">
            <LuSearch size={18} />
            <input
              type="text"
              placeholder="Search shipment ID, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <LuFilter size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Lab Testing">Lab Testing</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

        {/* Loading / Error states */}
        {loading && <p className="shipments-status-msg">Loading shipments...</p>}
        {error && <p className="shipments-status-msg error">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <div className="table-container">
            <table className="shipments-table">

              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (

                    <tr key={shipment.id}>

                      <td>
                        <span className="shipment-id">
                          {shipment.id}
                        </span>
                      </td>

                      <td>
                        <div className="product-name">
                          {shipment.product}
                        </div>
                      </td>

                      <td>
                        <span className="category">
                          {shipment.category}
                        </span>
                      </td>

                      <td>{shipment.quantity}</td>

                      <td>{shipment.submitted}</td>

                      <td>
                        <span
                          className={`status-badge ${shipment.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {shipment.status}
                        </span>
                      </td>

                      <td>
                        <button className="view-btn">
                          <LuEye size={16} />
                          View
                        </button>
                      </td>

                    </tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No shipments found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">

          <span>
            Showing <strong>{filteredShipments.length}</strong> of <strong>{total}</strong> shipments
          </span>

          <div className="pagination-buttons">

            <button disabled>
              <LuChevronLeft size={17} />
            </button>

            <button className="page-active">1</button>

            <button>
              <LuChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>

    </main>
  );
};

export default MyShipment;