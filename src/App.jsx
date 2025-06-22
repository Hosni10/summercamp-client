import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import KidsCamp from "./pages/KidsCamp.jsx";
import FootballClinic from "./pages/FootballClinic.jsx";
import ParentConsentForm from "./pages/ParentConsentForm.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
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
            <Layout>
              <FootballClinic />
            </Layout>
          }
        />
        <Route path="/parent-consent" element={<ParentConsentForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
