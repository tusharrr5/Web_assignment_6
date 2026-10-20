import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Menu({ user, token, cart, onAddToCart }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadMenu() {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const result = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "all" || item.category === category;
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesSearch && matchesCat && matchesVeg;
  });

  function handleDelete(id) {
    if (!window.confirm("Delete this dish?")) return;
    fetch(`/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then(() => loadMenu());
  }

  function handleToggle(id) {
    fetch(`/api/menu/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then(() => loadMenu());
  }

  if (loading) return <h2>Loading Menu...</h2>;

  return (
    <div>
      <div className="page-head">
        <h1>Restaurant Menu</h1>
        {user && user.role === "admin" && (
          <Link to="/admin/menu/new" className="btn">+ Add Dish</Link>
        )}
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Starters">Starters</option>
          <option value="Main Course">Main Course</option>
          <option value="Breads">Breads</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          <span>Veg Only</span>
        </label>
      </div>

      <div className="grid">
        {result.map((item) => {
          const inCart = cart.find((c) => c.menuItem === item._id);

          return (
            <div key={item._id} className="card">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-img"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

              <h2>
                <Link to={`/menu/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {item.name}
                </Link>
                <span className={`badge ${item.isVeg ? "badge-veg" : "badge-nonveg"}`}>
                  {item.isVeg ? "● Veg" : "▲ Non-Veg"}
                </span>
              </h2>

              <p style={{ color: "var(--muted)", margin: "0 0 6px" }}>{item.category}</p>
              <div className="price">₹{item.price}</div>
              {item.description && <p className="desc">{item.description}</p>}

              {!item.isAvailable && (
                <p><span className="badge badge-unavailable">Out of Stock</span></p>
              )}

              <div className="actions" style={{ marginTop: "auto" }}>
                {user && user.role === "admin" ? (
                  <>
                    <Link to={`/admin/menu/${item._id}/edit`} className="btn btn-small btn-outline">Edit</Link>
                    <button type="button" className="btn btn-small btn-outline" onClick={() => handleToggle(item._id)}>
                      {item.isAvailable ? "Stock Out" : "Stock In"}
                    </button>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={`/menu/${item._id}`} className="btn btn-small btn-outline">Details</Link>
                    <button
                      type="button"
                      className="btn btn-small"
                      disabled={!item.isAvailable}
                      onClick={() => onAddToCart(item)}
                    >
                      {!item.isAvailable ? "Out of Stock" : inCart ? `In Cart (${inCart.quantity}) +` : "+ Add"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
