import React, { useState } from "react";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import {
  Star,
  Users,
  Check,
  Calendar,
  Trophy,
  Target,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import footballClinicImage from "../assets/football-clinic.jpeg";
import coachImage from "../assets/coach.jpeg";
import backgroundImage from "../assets/background.jpeg";
import BookingForm from "../components/BookingForm.jsx";

const clinicPlans = {
  abuDhabi: [
    {
      name: "Test Plan",
      description: "Try our football clinic for just 0.5 dirham",
      price: "1",
      features: [
        "Professional coaching",
        "Skill assessment",
        "Training equipment provided",
        "Perfect for first-time visitors",
      ],
    },
    {
      name: "1 Day Access",
      description: "Perfect for trying out our football clinic",
      price: "150",
      features: [
        "Professional coaching",
        "Skill assessment",
        "Training equipment provided",
      ],
    },
    {
      name: "1 Week (3 sessions)",
      description: "Comprehensive football training program",
      price: "390",
      features: [
        "Professional coaching",
        "Advanced skill development",
        "Tactical training",
        "Progress tracking",
      ],
      popular: true,
    },
    {
      name: "Full Month (12 sessions)",
      description: "Complete football development experience",
      price: "1440",
      features: [
        "Professional coaching",
        "Match play experience",
        "Progress tracking",
        "Performance report",
      ],
    },
    {
      name: "Full Camp Access (21 sessions)",
      description: "Ultimate football training experience",
      price: "2520",
      features: [
        "Professional coaching",
        "Extended training period",
        "Comprehensive skill development",
        "Advanced tactical understanding",
      ],
    },
  ],
  alAin: [
    {
      name: "1 Day Access",
      description: "Perfect for trying out our football clinic",
      price: "150",
      features: [
        "Professional coaching",
        "Skill assessment",
        "Training equipment provided",
      ],
    },
    {
      name: "1 Week (3 sessions)",
      description: "Comprehensive football training program",
      price: "390",
      features: [
        "Professional coaching",
        "Advanced skill development",
        "Tactical training",
        "Progress tracking",
      ],
      popular: true,
    },
    {
      name: "Full Month (12 sessions)",
      description: "Complete football development experience",
      price: "1440",
      features: [
        "Professional coaching",
        "Match play experience",
        "Progress tracking",
        "Performance report",
      ],
    },
    {
      name: "Full Camp Access (21 sessions)",
      description: "Ultimate football training experience",
      price: "2520",
      features: [
        "Professional coaching",
        "Extended training period",
        "Comprehensive skill development",
        "Advanced tactical understanding",
      ],
    },
  ],
};

const clinicActivities = {
  focusAreas: [
    "Technical Skills",
    "Tactical Understanding",
    "Physical Conditioning",
    "Mental Preparation",
  ],
  schedule: {
    "U17 & U18": "3:00 PM – 5:00 PM",
    "U6, U8 & U10": "5:00 PM – 6:15 PM",
    "U12 & U13": "6:15 PM – 7:40 PM",
    "U14 & U15": "7:30 PM – 9:00 PM",
  },
  skillsDevelopment: [
    "Ball control and dribbling",
    "Passing and receiving",
    "Shooting techniques",
    "Defensive positioning",
    "Game strategy and tactics",
  ],
  benefits: [
    "Improve football skills",
    "Build confidence",
    "Develop teamwork",
    "Enhance fitness levels",
    "Learn from professionals",
  ],
};

function ImageModal({ src, alt, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-lg shadow-lg p-2 max-w-lg w-full flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <img
          src={src}
          alt={alt}
          className="max-h-[70vh] w-auto rounded-md object-contain"
          style={{ maxWidth: "90vw" }}
        />
      </div>
    </div>
  );
}

function FootballClinic() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalImg, setModalImg] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (data) => {
    console.log("Booking submitted:", data);
    setShowBookingForm(false);
    // The BookingForm handles everything internally now
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-[#ed3227]/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white">
          <div className="mb-8">
            <Badge className="mb-4 bg-[#ed3227] text-white hover:bg-[#ed3227]/90">
              Professional Football Training
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Football Clinic
              <span className="block text-[#ed3227]">Develop Your Skills</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our professional football training program designed to
              enhance your skills, improve your game, and take your football
              abilities to the next level.
            </p>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  July 1st - August 21st, 2025
                </span>
              </div>
            </div>
            <Button
              className="bg-[#ed3227] hover:bg-[#ed3227]/90 text-white px-8 py-6 text-lg"
              onClick={() =>
                document
                  .getElementById("pricing")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Training Program Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Training Program
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive football training designed to develop all aspects of
              your game
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() =>
                setModalImg({
                  src: footballClinicImage,
                  alt: "Football Training",
                })
              }
            >
              <img
                src={footballClinicImage}
                alt="Football Training"
                className="w-full h-[400px] object-cover hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Focus Areas</h3>
                <div className="grid grid-cols-2 gap-3">
                  {clinicActivities.focusAreas.map((area, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Skills Development
                </h3>
                <div className="space-y-2">
                  {clinicActivities.skillsDevelopment.map((skill, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Training Schedule
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Structured training sessions designed for different age groups
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(clinicActivities.schedule).map(
              ([ageGroup, time], index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <Clock className="h-8 w-8 text-[#ed3227] mx-auto mb-2" />
                    <CardTitle className="text-lg">{ageGroup}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#ed3227] font-semibold">{time}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-2 text-lg font-semibold text-[#ed3227]">
              🎯 Limited slots available – serious players only!
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Membership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect training program for your football development
            </p>
          </div>

          {/* Location Display */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#ed3227] text-white px-6 py-3 rounded-lg font-medium">
              <MapPin className="h-4 w-4 inline mr-2" />
              Abu Dhabi
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {clinicPlans.abuDhabi.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden flex flex-col ${
                  plan.popular
                    ? "border-2 border-[#ed3227] shadow-lg"
                    : "hover:shadow-lg"
                } transition-shadow duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-[#ed3227] text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">AED {plan.price}</span>
                  </div>
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-[#ed3227] mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-[#ed3227] hover:bg-[#ed3227]/90 text-white mt-auto"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Select Membership
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedPlan && (
        <BookingForm
          selectedPlan={selectedPlan}
          onClose={() => setShowBookingForm(false)}
        />
      )}

      {/* Image Modal */}
      <ImageModal
        src={modalImg?.src}
        alt={modalImg?.alt}
        open={!!modalImg}
        onClose={() => setModalImg(null)}
      />
    </>
  );
}

export default FootballClinic;
