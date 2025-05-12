import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    password2: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.full_name.trim()) {
      errors.full_name = "Veuillez remplir ce champ";
    }

    if (!form.email.trim()) {
      errors.email = "Veuillez remplir ce champ";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Veuillez saisir un email valide";
    }

    if (!form.password) {
      errors.password = "Veuillez remplir ce champ";
    } else if (form.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!form.password2) {
      errors.password2 = "Veuillez confirmer votre mot de passe";
    } else if (form.password !== form.password2) {
      errors.password2 = "Les mots de passe ne correspondent pas";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    setServerError([]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError([]);

    try {
      await axios.post("https://edupredict-backend.onrender.com/api/accounts/register/", form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      const newFormErrors = {};
      const newServerErrors = [];

      if (data) {
        for (const key in data) {
          if (form.hasOwnProperty(key)) {
            newFormErrors[key] = data[key][0];
          } else {
            newServerErrors.push(data[key][0] || data[key]);
          }
        }
      } else {
        newServerErrors.push("Erreur lors de l’inscription.");
      }

      setFormErrors(newFormErrors);
      setServerError(newServerErrors);
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
          <h4 className="mb-4 text-center fw-semibold">Inscription</h4>

          {serverError.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {serverError.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nom complet</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className={`form-control ${formErrors.full_name ? "is-invalid" : ""}`}
              />
              {formErrors.full_name && (
                <div className="invalid-feedback">{formErrors.full_name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
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
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Confirmez le mot de passe</label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                className={`form-control ${formErrors.password2 ? "is-invalid" : ""}`}
              />
              {formErrors.password2 && (
                <div className="invalid-feedback">{formErrors.password2}</div>
              )}
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={loading}
              >
                {loading ? "Inscription..." : "S’inscrire"}
              </button>
            </div>
          </form>

          <p className="mt-3 text-center">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-primary fw-semibold">
              Connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
