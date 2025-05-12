import { useState } from "react";
import axios from "axios";

export default function PredictForm() {
  const [form, setForm] = useState({
    study_hours_per_day: "",
    social_media_hours: "",
    netflix_hours: "",
    sleep_hours: "",
    mental_health_rating: "",
    attendance_percentage: "",
    part_time_job: false,
    extracurricular_participation: false,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      const res = await axios.post("https://edupredict-backend.onrender.com/api/predict/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data);
    } catch (error) {
      alert("Erreur lors de la prédiction");
      console.error(error);
    }
  };
const handleDownload = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.post(
        "https://edupredict-backend.onrender.com/api/predict/download-report/",
        {
          prediction: result.prediction,
          advice: result.advice,
          inputs: form,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport_prediction.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors du téléchargement du rapport.");
      console.error(error);
    }
  };


  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(120deg, #f3faff, #e2f0fb)",
        padding: "2rem",
      }}
    >
      <div className="container mt-4 mb-5">
        <h2 className="text-center mb-5 fw-bold">
          Prédiction des difficultés scolaires
        </h2>
        <div className="row g-4 justify-content-center">
          {/* Formulaire */}
          <div className="col-md-5">
            <div
              className="card shadow-lg"
              style={{
                width: "100%",
                maxWidth: "900px",
                borderRadius: "1rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3 text-primary-emphasis text-center">
                  <i className="bi bi-pencil-square me-2"></i>
                  Remplir le formulaire
                </h4>
                <form onSubmit={handleSubmit}>
                  {[
                    {
                      label: "Heures d’étude par jour",
                      name: "study_hours_per_day",
                    },
                    {
                      label: "Heures sur les réseaux sociaux",
                      name: "social_media_hours",
                    },
                    { label: "Heures de Netflix", name: "netflix_hours" },
                    { label: "Heures de sommeil", name: "sleep_hours" },
                    {
                      label: "État de santé mentale (1-10)",
                      name: "mental_health_rating",
                    },
                    {
                      label: "Présence en classe (%)",
                      name: "attendance_percentage",
                    },
                  ].map((field) => (
                    <div className="mb-3" key={field.name}>
                      <label className="form-label fw-medium">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                        step="any"
                      />
                    </div>
                  ))}

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="part_time_job"
                      checked={form.part_time_job}
                      onChange={handleChange}
                      id="partTimeJob"
                    />
                    <label className="form-check-label" htmlFor="partTimeJob">
                      Travail à temps partiel
                    </label>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="extracurricular_participation"
                      checked={form.extracurricular_participation}
                      onChange={handleChange}
                      id="extraParticipation"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="extraParticipation"
                    >
                      Activités extrascolaires
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold"
                  >
                    Prédire
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Résultat */}
          <div className="col-md-5">
            <div
              className="card shadow-lg"
              style={{
                width: "100%",
                maxWidth: "900px",
                borderRadius: "1rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3 text-warning-emphasis text-center">
                  <i className="bi bi-graph-up-arrow me-2"></i>
                  Prédiction de vos résultats
                </h4>
                {result ? (
                  <>
                    <p
                      className={`fw-bold ${
                        result.prediction.includes("pas en difficulté")
                          ? "text-success"
                          : "text-danger"
                      }`}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {result.prediction}
                    </p>
                    <div
                      className="text-muted"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {result.advice}
                    </div>
                    <div className="mt-3">
                      <button
                onClick={handleDownload}
                className="btn btn-outline-primary w-100 fw-semibold"
              >
                Télécharger le rapport PDF
              </button>
                    </div>
                     
                  </>
                ) : (
                  <p className="text-muted fst-italic">
                    Cette prédiction vous aide à comprendre l'impact de vos
                    habitudes d'étude, de votre santé mentale et de votre
                    participation à des activités sociales sur vos résultats
                    scolaires. Remplissez le formulaire pour obtenir des
                    conseils personnalisés.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}