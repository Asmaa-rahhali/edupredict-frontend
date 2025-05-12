/* import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('access');
  return token ? children : <Navigate to="/login" />;
}
 */

import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivateRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setAuthorized(false);
      return;
    }

    axios
      .get("https://edupredict-backend.onrender.com/api/accounts/protected/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuthorized(true))
      .catch(() => {
        setAuthorized(false);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      });
  }, []);

  if (authorized === null) {
    return <p className="text-center mt-5">Chargement de la session...</p>;
  }

  return authorized ? children : <Navigate to="/login" />;
}
