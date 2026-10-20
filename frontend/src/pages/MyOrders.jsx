import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MyOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  function handleCancel(id) {
    if (!window.confirm("Cancel this order?")) return;
    fetch(`/api/orders/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Order cancelled");
        loadOrders();
      });
  }

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Please Login</h2>
        <p>You need to login to view your orders.</p>
        <Link to="/login" className="btn">Login</Link>
      </div>
    );
  }

  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div>
      <div className="page-head">
        <h1>My Orders</h1>
        <Link to="/menu" className="btn btn-outline">+ Order Food</Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Table #{order.tableNumber}</h3>
                <span className={`badge badge-status status-${order.status}`}>{order.status}</span>
              </div>

              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</li>
                ))}
              </ul>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Total: ₹{order.grandTotal}</strong>
                <div className="actions">
                  <Link to={`/orders/${order._id}`} className="btn btn-small btn-outline">View Bill</Link>
                  {order.status === "Placed" && (
                    <button type="button" className="btn btn-small btn-danger" onClick={() => handleCancel(order._id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
