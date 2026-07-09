import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import KidsCamp from "./pages/KidsCamp.jsx";
import FootballClinic from "./pages/FootballClinic.jsx";
import ParentConsentForm from "./pages/ParentConsentForm.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentError from "./pages/PaymentError.jsx";
import NotFound from "./pages/NotFound.jsx";
import { FOOTBALL_CLINIC_ENABLED } from "./config/features.js";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <KidsCamp />
            </Layout>
          }
        />
        <Route
          path="/kids-camp"
          element={
            <Layout>
              <KidsCamp />
            </Layout>
          }
        />
        <Route
          path="/football-clinic"
          element={
            FOOTBALL_CLINIC_ENABLED ? (
              <Layout>
                <FootballClinic />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/parent-consent" element={<ParentConsentForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-error" element={<PaymentError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
