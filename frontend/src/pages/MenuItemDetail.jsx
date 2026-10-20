import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function MenuItemDetail({ onAddToCart }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!item) return <h2>Item not found</h2>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Link to="/menu" className="btn btn-small btn-outline" style={{ marginBottom: "16px" }}>
        ← Back to Menu
      </Link>

      <div className="card" style={{ padding: "20px" }}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", maxHeight: "280px", objectFit: "cover", borderRadius: "8px" }}
          />
        )}

        <h2>{item.name}</h2>
        <p style={{ color: "var(--muted)" }}>Category: {item.category}</p>
        <p>{item.isVeg ? "🌱 Vegetarian" : "🍗 Non-Vegetarian"}</p>
        <div className="price" style={{ fontSize: "22px", margin: "8px 0" }}>₹{item.price}</div>
        <p>{item.description}</p>

        <button
          type="button"
          className="btn"
          disabled={!item.isAvailable}
          onClick={() => {
            onAddToCart(item);
            alert(`Added ${item.name} to cart`);
          }}
        >
          {item.isAvailable ? "+ Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

export default MenuItemDetail;
