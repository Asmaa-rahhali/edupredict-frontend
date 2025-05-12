import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.email) {
      errors.email = "Veuillez remplir ce champ";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Veuillez saisir un email valide";
    }

    if (!form.password) {
      errors.password = "Veuillez remplir ce champ";
    } else if (form.password.length < 6) {
      errors.password = "Veuillez saisir un mot de passe valide";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    setServerError([]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError([]);

    try {
      const res = await axios.post(
        "https://edupredict-backend.onrender.com/api/token/login/",
        form
      );
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail || "Échec de la connexion. Vérifiez vos identifiants.";
      setServerError([message]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(120deg, #f3faff, #e2f0fb)",
        padding: "2rem",
      }}
    >
      <div className="text-center mb-4">
        <h1 style={{ color: "#0d6efd", fontWeight: "700" }}>
          <span role="img" aria-label="education">
            <i class="bi bi-mortarboard"></i>
          </span>{" "}
          EduPredict
        </h1>
      </div>

      <div
        className="card shadow-lg"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <div className="card-body p-4">
          <h4 className="mb-4 text-center fw-semibold">Connexion</h4>

          {serverError.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {serverError.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                placeholder="Entrez votre email"
              />
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                placeholder="••••••"
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>

          <p className="mt-3 mb-0 text-center">
            Vous n’avez pas de compte ?{" "}
            <Link to="/register" className="text-primary fw-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
