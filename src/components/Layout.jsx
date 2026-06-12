import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { MapPin, Phone, Mail } from "lucide-react";
import afcLogo from "../assets/AFC-Logo.svg";
import poweredImage from "../assets/powered.jpg";

const CAMP_LOCATION = {
  name: "Abu Dhabi Summer Sports (ADSS)",
  address:
    "CCCP 574 ADSS (Abu Dhabi Summer Sports) - Al Rawdah - Al Ma'arid - Abu Dhabi",
  mapsUrl: "https://maps.app.goo.gl/emQPJrYeCzs1wZSF7",
  embedUrl:
    "https://www.google.com/maps?q=CCCP+574+ADSS+(Abu+Dhabi+Summer+Sports)+-+Al+Rawdah+-+Al+Ma'arid+-+Abu+Dhabi&output=embed",
};

export default function Layout({ children }) {
  return (
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
                variant="ghost"
                className="hover:text-red-600"
                onClick={() => {
                  document.getElementById("location").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Location
              </Button>
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
      <main>{children}</main>

      {/* Partners Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <img
            src={poweredImage}
            alt="Al Ain Summer Sports partners: ADNOC, ADNEC Group, Abu Dhabi Sports Council"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Location
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at Abu Dhabi Summer Sports (ADSS) at ADNEC for Kids Camp
              and Football Clinic sessions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white rounded-lg p-6 shadow-sm">
                <MapPin className="h-8 w-8 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {CAMP_LOCATION.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{CAMP_LOCATION.address}</p>
                  <a
                    href={CAMP_LOCATION.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg h-[350px] lg:h-[400px]">
              <iframe
                title="Abu Dhabi Summer Sports location"
                src={CAMP_LOCATION.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

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
              <a
                href={CAMP_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                ADNEC, Abu Dhabi Summer Sports, UAE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src={afcLogo} alt="AFC Logo" className="h-12 w-auto mb-4" />
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@atomicsfootball.com</li>
                <li>Phone: +971 50 333 1468</li>
                <li>
                  <a
                    href={CAMP_LOCATION.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400"
                  >
                    {CAMP_LOCATION.address}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 Atomics Football. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
