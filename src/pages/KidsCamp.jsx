import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Star, Users, Check, Calendar, Trophy, MapPin } from "lucide-react";
import kidsCampImage from "../assets/kids-camp.jpeg";
import activitiesImage from "../assets/activities.jpeg";
import detailsImage from "../assets/details.jpeg";
import lastYearImage from "../assets/last-year.jpeg";
import fullImage from "../assets/kids-camp.jpeg";
import BookingForm from "../components/BookingForm.jsx";
import PaymentProcessor from "../components/PaymentProcessor.jsx";

const campPlans = {
  abuDhabi: [
    {
      name: "1-Day Access",
      description: "Perfect for trying out our summer camp",
      price: "250",
      features: ["Full day camp activities", "Professional supervision"],
    },
    {
      name: "3-Days Access",
      description: "Great for a short camp experience",
      price: "650",
      features: [
        "All 1-day features",
        "Extended skill development",
        "Progress tracking",
      ],
    },
    {
      name: "5-Days Access",
      description: "Complete summer camp experience",
      price: "850",
      features: [
        "All 3-day features",
        "Full week activities",
        "Individual attention",
      ],
      popular: true,
    },
    {
      name: "10-Days Access",
      description: "Extended camp experience",
      price: "1,600",
      features: [
        "All 5-day features",
        "Advanced activities",
        "Special workshops",
        "Extended care options",
      ],
    },
    {
      name: "20-Days Access",
      description: "Full summer camp experience",
      price: "3,000",
      features: [
        "All 10-day features",
        "Complete summer program",
        "Priority registration",
        "Exclusive activities",
      ],
    },
    {
      name: "Full Camp Access",
      description: "Unlimited access to all camp days and activities",
      price: "5,700",
      features: [
        "All 20-day features",
        "Unlimited access",
        "Personalized coaching",
        "Exclusive events",
      ],
      popular: false,
    },
  ],
};

const campActivities = {
  sports: [
    "Football",
    "Basketball",
    "Martial Arts",
    "Dodgeball",
    "Handball",
    "Baseball",
    "Tennis",
    "Padel",
    "Badminton",
    "Track & Field",
    "Olympic Challenges",
    "Cycling",
    "Art",
    "Board Games & more",
  ],
  cognitive: [],
  competitions: [],
  skills: [],
  ageGroups: [
    "Ages 4-6: Early Development",
    "Ages 7-9: Skill Building",
    "Ages 10-12: Advanced Training",
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

function KidsCamp() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("abuDhabi");
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [modalImg, setModalImg] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (data) => {
    setBookingData(data);
    setShowBookingForm(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setBookingData(null);
    setSelectedPlan(null);
  };

  const handlePaymentError = () => {
    setShowPayment(false);
  };

  const getLocationName = (location) => {
    return "Abu Dhabi";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fullImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-[#ed3227]/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white">
          <div className="mb-8">
            <Badge className="mb-4 bg-[#ed3227] text-white hover:bg-[#ed3227]/90">
              Summer 2025 Registration Open
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kids Camp
              <span className="block text-[#ed3227]">
                Where Champions Are Made
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our comprehensive summer program designed to develop young
              talents through sports, education, and fun activities.
            </p>
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

      {/* Camp Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Camp Details
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-6 w-6 text-[#ed3227] mt-1" />
                  <div>
                    <h3 className="font-semibold">Schedule</h3>
                    <p className="text-gray-600">
                      Monday to Friday, 8:30 AM - 2 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-[#ed3227] mt-1" />
                  <div>
                    <h3 className="font-semibold">Age Groups</h3>
                    <p className="text-gray-600">
                      Ages 4-12, grouped by age for optimal development
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-[#ed3227] mt-1" />
                  <div>
                    <h3 className="font-semibold">Professional Staff</h3>
                    <p className="text-gray-600">
                      Qualified coaches and instructors for each activity
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() =>
                setModalImg({ src: detailsImage, alt: "Camp Details" })
              }
            >
              <img
                src={detailsImage}
                alt="Camp Details"
                className="w-full h-[400px] object-cover hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Camp Activities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diverse range of activities designed to develop physical,
              mental, and social skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() =>
                setModalImg({ src: activitiesImage, alt: "Camp Activities" })
              }
            >
              <img
                src={activitiesImage}
                alt="Camp Activities"
                className="w-full h-[400px] object-cover hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {campActivities.sports.map((sport, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                    <span>{sport}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Year's Success Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Last Year's Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our campers achieved in the previous summer
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-[#ed3227]" />
                <h3 className="text-2xl font-bold">Achievements</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-2">
                  <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                  <span>
                    Over 4000 happy kids attended across different days
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                  <span>Rated as 1 of Abu Dhabi's top summer camps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-5 w-5 text-[#ed3227] mt-1" />
                  <span>
                    High satisfaction and glowing feedback from parents
                  </span>
                </li>
              </ul>
            </div>
            <div
              className="relative rounded-lg overflow-hidden shadow-lg order-1 md:order-2 cursor-pointer"
              onClick={() =>
                setModalImg({ src: lastYearImage, alt: "Last Year's Success" })
              }
            >
              <img
                src={lastYearImage}
                alt="Last Year's Success"
                className="w-full h-[400px] object-cover hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Membership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your child's summer camp experience
            </p>
          </div>

          {/* Location Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedLocation === "abuDhabi"
                    ? "bg-[#ed3227] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setSelectedLocation("abuDhabi")}
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                Abu Dhabi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {campPlans[selectedLocation].map((plan, index) => (
              <Card
                key={index}
                className={`relative flex flex-col h-full overflow-hidden ${
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
                <CardContent className="flex flex-col flex-1">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">AED {plan.price}</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 mr-2 text-[#ed3227] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button
                      className="w-full bg-[#ed3227] hover:bg-[#ed3227]/90 text-white"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Buy Membership
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sibling Discount Info */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#ed3227]/10 to-[#ed3227]/5 border-[#ed3227]/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-[#ed3227] mb-4">
                  Sibling Discounts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>2 Siblings:</strong> 10% off
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>3 Siblings:</strong> 15% off
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>4+ Siblings:</strong> 20% off
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedPlan && (
        <BookingForm
          selectedPlan={selectedPlan}
          selectedLocation={selectedLocation}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Payment Processor Modal */}
      {showPayment && bookingData && (
        <PaymentProcessor
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => setShowPayment(false)}
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

export default KidsCamp;
