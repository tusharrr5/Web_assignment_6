import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuForm from "../components/MenuForm";

function AdminMenuEdit({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function handleSubmit(formValues) {
    fetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formValues)
    })
      .then((res) => res.json())
      .then(() => navigate("/menu"));
  }

  if (loading) return <h2>Loading...</h2>;
  if (!initialData) return <h2>Dish not found</h2>;

  return (
    <div className="form-page">
      <h1>Edit Dish</h1>
      <MenuForm
        initialValues={initialData}
        submitLabel="Update Dish"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default AdminMenuEdit;
