import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <h2>Loading Dashboard...</h2>;
  if (!stats) return <h2>No data available</h2>;

  return (
    <div>
      <div className="page-head">
        <h1>Restaurant Dashboard</h1>
        <div className="actions">
          <Link to="/admin/orders" className="btn btn-outline">Manage Orders</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Today's Orders</div>
          <div className="value">{stats.todayOrdersCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Today's Revenue</div>
          <div className="value" style={{ color: "var(--success)" }}>₹{stats.todayRevenue}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Orders</div>
          <div className="value">{stats.totalOrdersAllTime}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Revenue</div>
          <div className="value">₹{stats.totalRevenueAllTime}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <div className="card" style={{ padding: "16px" }}>
          <h2>Top 5 Selling Items</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Qty Sold</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {stats.topSellingItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.totalQuantity}</td>
                  <td>₹{item.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: "16px" }}>
          <h2>Category Sales</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.categoryWiseSales.map((cat, index) => (
                <tr key={index}>
                  <td>{cat.category}</td>
                  <td>₹{cat.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
