import { useNavigate } from "react-router-dom";
import MenuForm from "../components/MenuForm";

function AdminMenuNew({ token }) {
  const navigate = useNavigate();

  function handleSubmit(formValues) {
    fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formValues)
    })
      .then((res) => res.json())
      .then(() => navigate("/menu"));
  }

  return (
    <div className="form-page">
      <h1>Add New Dish</h1>
      <MenuForm submitLabel="Save Dish" onSubmit={handleSubmit} />
    </div>
  );
}

export default AdminMenuNew;
