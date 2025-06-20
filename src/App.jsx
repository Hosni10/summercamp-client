import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { MapPin, Phone, Mail } from "lucide-react";
import afcLogo from "./assets/AFC-Logo.svg";
import KidsCamp from "./pages/KidsCamp.jsx";
import FootballClinic from "./pages/FootballClinic.jsx";
import ParentConsentForm from "./pages/ParentConsentForm.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img src={afcLogo} alt="AFC Logo" className="h-12 w-auto" />
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/kids-camp">
                  <Button variant="ghost" className="hover:text-red-600">
                    Kids Camp
                  </Button>
                </Link>
                <Link to="/football-clinic">
                  <Button variant="ghost" className="hover:text-red-600">
                    Football Clinic
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    document.getElementById("contact").scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<KidsCamp />} />
            <Route path="/kids-camp" element={<KidsCamp />} />
            <Route path="/football-clinic" element={<FootballClinic />} />
            <Route path="/parent-consent" element={<ParentConsentForm />} />
          </Routes>
        </main>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-2">
                <Phone className="h-8 w-8 text-blue-600" />
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-gray-600">050 333 1468</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Mail className="h-8 w-8 text-green-600" />
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-gray-600">info@atomicsfootball.com</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-8 w-8 text-orange-600" />
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-gray-600">
                  ADNEC, Abu Dhabi Summer Sports, UAE
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <img
                  src={afcLogo}
                  alt="AFC Logo"
                  className="h-12 w-auto mb-4"
                />
                <p className="text-gray-400">
                  Providing quality sports education and training for young
                  athletes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/kids-camp"
                      className="text-gray-400 hover:text-red-400"
                    >
                      Kids Camp
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/football-clinic"
                      className="text-gray-400 hover:text-red-400"
                    >
                      Football Clinic
                    </Link>
                  </li>
                </ul>
              </div>
              <div id="contact">
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Email: info@atomicsfootball.com</li>
                  <li>Phone: +971 50 333 1468</li>
                  <li>Location: Abu Dhabi, UAE</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 Atomics Football. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
