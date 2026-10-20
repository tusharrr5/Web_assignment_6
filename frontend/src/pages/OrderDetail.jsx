import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function OrderDetail({ token, user }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  if (loading) return <h2>Loading Bill...</h2>;
  if (!order) return <h2>Order not found</h2>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="actions" style={{ marginBottom: "16px" }}>
        <Link to={user && user.role === "admin" ? "/admin/orders" : "/my-orders"} className="btn btn-small btn-outline">
          ← Back
        </Link>
      </div>

      <div className="card" style={{ padding: "20px" }}>
        <h2>Restaurant Dine-In Bill</h2>
        <p><strong>Table:</strong> #{order.tableNumber}</p>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <table className="data-table" style={{ margin: "16px 0" }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </p>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>GST (5%):</span>
            <span>₹{order.gst}</span>
          </p>
          <h3 style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
            <span>Grand Total:</span>
            <span>₹{order.grandTotal}</span>
          </h3>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
