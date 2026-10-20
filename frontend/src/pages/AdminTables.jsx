import { useState, useEffect } from "react";

function AdminTables({ token }) {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  function loadTables() {
    fetch("/api/tables")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch(() => {});
  }

  useEffect(() => {
    loadTables();
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    fetch("/api/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ tableNumber: Number(tableNumber), capacity: Number(capacity) })
    })
      .then((res) => res.json())
      .then(() => {
        setTableNumber("");
        setCapacity("");
        loadTables();
      });
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this table?")) return;
    fetch(`/api/tables/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then(() => loadTables());
  }

  return (
    <div>
      <h1>Manage Dining Tables</h1>

      <div className="card" style={{ padding: "16px", marginBottom: "20px" }}>
        <h3>Add Table</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <label>
            Table #
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 5"
              required
            />
          </label>
          <label>
            Capacity
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 4"
              required
            />
          </label>
          <button type="submit" className="btn">+ Add Table</button>
        </form>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Table Number</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((t) => (
            <tr key={t._id}>
              <td><strong>Table #{t.tableNumber}</strong></td>
              <td>{t.capacity} Seats</td>
              <td>
                <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(t._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTables;
