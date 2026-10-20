import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ["Placed", "Preparing", "Served", "Paid", "Cancelled"];

  function loadOrders() {
    fetch("/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleStatusChange(orderId, status) {
    fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then(() => loadOrders());
  }

  if (loading) return <h2>Loading Orders...</h2>;

  return (
    <div>
      <div className="page-head">
        <h1>Orders Management</h1>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Table</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Bill</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td><strong>Table #{o.tableNumber}</strong></td>
              <td>{o.customerName}</td>
              <td>{o.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}</td>
              <td>₹{o.grandTotal}</td>
              <td>
                <span className={`badge badge-status status-${o.status}`}>{o.status}</span>
              </td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  style={{ padding: "4px" }}
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </td>
              <td>
                <Link to={`/orders/${o._id}`} className="btn btn-small btn-outline">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
