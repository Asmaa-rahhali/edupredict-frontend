import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container-fluid px-3">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-primary fw-bold"
        >
          <i class="bi bi-mortarboard"></i>
          <span className="ms-2">EduPredict</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav me-3 gap-2">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link text-dark fw-medium">
                Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/predict" className="nav-link text-dark fw-medium">
                Prédire
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm fw-bold"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}