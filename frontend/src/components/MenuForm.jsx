import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MenuForm({ initialValues, submitLabel, onSubmit }) {
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      category: "Starters",
      price: "",
      isVeg: true,
      isAvailable: true,
      image: "",
      description: ""
    }
  );

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price)
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Dish Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Paneer Butter Masala"
          required
        />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Starters">Starters</option>
          <option value="Main Course">Main Course</option>
          <option value="Breads">Breads</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
        </select>
      </label>

      <label>
        Price (₹)
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. 250"
          required
        />
      </label>

      <label style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
        <input
          name="isVeg"
          type="checkbox"
          checked={form.isVeg}
          onChange={handleChange}
        />
        <span>Pure Vegetarian</span>
      </label>

      <label style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
        <input
          name="isAvailable"
          type="checkbox"
          checked={form.isAvailable}
          onChange={handleChange}
        />
        <span>Available for Ordering</span>
      </label>

      <label>
        Image URL
        <input
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short details about the dish"
          rows="3"
        />
      </label>

      <div className="actions">
        <button type="submit" className="btn">
          {submitLabel}
        </button>
        <Link to="/menu" className="btn btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default MenuForm;
