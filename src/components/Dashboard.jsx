import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios
      .get("https://edupredict-backend.onrender.com/api/predict/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((error) => {
        console.error(error);
        alert("Erreur lors de la récupération des données.");
      });
  }, []);

  if (!stats) return <p className="text-center mt-5">Chargement...</p>;

  const percentDifficulte =
    stats.total > 0
      ? ((stats.difficulte / stats.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(120deg, #f3faff, #e2f0fb)",
        padding: "2rem",
      }}
    >
      <div className="container mt-4">
        <h2 className="mb-5 fw-bold text-primary-emphasis">Tableau de bord</h2>

        <div className="row g-4">
          <div className="col-md-3 d-flex">
            <div className="card text-white bg-primary shadow-lg w-100 h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title fs-5 fw-bold">Total de mes prédictions</h6>
                <p className="card-text fs-4">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="card text-white bg-success shadow-lg w-100 h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title fs-5 fw-bold">Pas en difficulté</h6>
                <p className="card-text fs-4">{stats.non_difficulte}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="card text-white bg-danger shadow-lg w-100 h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title fs-5 fw-bold">En difficulté</h6>
                <p className="card-text fs-4">{stats.difficulte}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 d-flex">
            <div className="card text-white bg-warning shadow-lg w-100 h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title fs-5 fw-bold">% de difficultés</h6>
                <p className="card-text fs-4">{percentDifficulte}%</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <h4 className="mb-4 fw-semibold">Historique de mes prédictions</h4>
        {stats.history.length === 0 ? (
          <p className="text-muted">Aucune prédiction enregistrée.</p>
        ) : (
          <ul className="list-group rounded-3 shadow-sm overflow-hidden">
            {stats.history.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{item.created_at}</span>
                <span
                  className={`badge ${
                    item.result === 0 ? "bg-success" : "bg-danger"
                  }`}
                >
                  {item.result === 0 ? "Non en difficulté" : "En difficulté"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
