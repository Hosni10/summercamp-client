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
import {
  Star,
  Users,
  Trophy,
  Clock,
  MapPin,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import afcLogo from "./assets/AFC-Logo.svg";
import heroImage from "./assets/background.jpeg";
import kidsCampImage from "./assets/kids-camp.jpeg";
import footballClinicImage from "./assets/football-clinic.jpeg";
import BookingForm from "./components/BookingForm.jsx";
import PaymentProcessor from "./components/PaymentProcessor.jsx";
import "./App.css";

const campPlans = {
  abuDhabi: [
    {
      name: "1-Day Access",
      description: "Perfect for trying out the camp",
      price: 250,
      features: [
        "Full day access to all activities",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Valid for one day",
      ],
    },
    {
      name: "3-Days Access",
      description: "Great for a short camp experience",
      price: 600,
      features: [
        "Access to all activities for 3 days",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Must be used within same week",
      ],
    },
    {
      name: "5-Days Access",
      description: "Most popular choice for a week",
      price: 800,
      features: [
        "Access to all activities for 5 days",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Must be used within same week",
      ],
      popular: true,
    },
    {
      name: "10-Days Access",
      description: "Extended camp experience",
      price: 1600,
      features: [
        "Access to all activities for 10 days",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Flexible scheduling",
      ],
    },
    {
      name: "20-Days Access",
      description: "Comprehensive camp experience",
      price: 3200,
      features: [
        "Access to all activities for 20 days",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Flexible scheduling",
      ],
    },
    {
      name: "Full Camp Access",
      description: "Complete summer experience",
      price: 6080,
      features: [
        "Access to all activities for entire camp duration",
        "Access to both Kids Camp (8:30 AM - 2 PM) and Football Clinic",
        "Lunch included",
        "Professional supervision",
        "Available in Abu Dhabi",
        "Maximum flexibility",
      ],
    },
  ],
  alAin: [
    {
      name: "1-Day Access",
      description: "Perfect for trying out the camp",
      price: 150,
      features: [
        "Full day access to all activities",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Valid for one day",
      ],
    },
    {
      name: "3-Days Access",
      description: "Great for a short camp experience",
      price: 400,
      features: [
        "Access to all activities for 3 days",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Must be used within same week",
      ],
    },
    {
      name: "5-Days Access",
      description: "Most popular choice for a week",
      price: 650,
      features: [
        "Access to all activities for 5 days",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Must be used within same week",
      ],
      popular: true,
    },
    {
      name: "10-Days Access",
      description: "Extended camp experience",
      price: 1600,
      features: [
        "Access to all activities for 10 days",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Flexible scheduling",
      ],
    },
    {
      name: "20-Days Access",
      description: "Comprehensive camp experience",
      price: 3200,
      features: [
        "Access to all activities for 20 days",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Flexible scheduling",
      ],
    },
    {
      name: "Full Camp Access",
      description: "Complete summer experience",
      price: 6080,
      features: [
        "Access to all activities for entire camp duration",
        "Kids Camp (8:30 AM - 2 PM)",
        "Lunch included",
        "Professional supervision",
        "Available in Al Ain",
        "Maximum flexibility",
      ],
    },
  ],
};

const campActivities = {
  kidsCamp: {
    sports: [
      "Team Sports: Football, basketball, handball, dodgeball",
      "Individual & Skill-Based Sports: Baseball, Padel, track & field",
      "Martial Arts: Emphasizing discipline, fitness, and self-defense",
    ],
    cognitive: [
      "Storytelling with moral and leadership themes",
      "Arts and painting sessions",
      "Board games (e.g., chess) and LEGO play",
    ],
    competitions: [
      "Kings League: Dynamic matches with creative rules",
      "Champions League: Mini-tournaments",
      "Top Baller: Skills and celebration contests",
    ],
    skills: [
      "Physical Skills: Agility, coordination, strength, endurance",
      "Sport-Specific Competencies: Ball handling, strategies, teamwork",
      "Cognitive Development: Problem-solving, strategic thinking",
      "Creativity and Expression: Through art and storytelling",
      "Emotional and Social Skills: Teamwork, sportsmanship, leadership",
    ],
    ageGroups: [
      "U6: Born 2019–2020",
      "U9: Born 2016–2018",
      "U11: Born 2014–2015",
      "U13: Born 2012–2013",
      "Girls U11 & U14: 2011–2017",
    ],
  },
  footballClinic: {
    focus: [
      "Gym & strength development",
      "Technical training",
      "Tactical understanding (based on age group)",
    ],
    schedule: [
      "U17 & U18: 3:00 PM – 5:00 PM",
      "U6, U8 & U10: 5:00 PM – 6:15 PM",
      "U12 & U13: 6:15 PM – 7:40 PM",
      "U14 & U15: 7:30 PM – 9:00 PM",
    ],
    ageGroups: [
      "U6 to U18",
      "Age-appropriate training",
      "Serious players only",
    ],
  },
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState("abuDhabi");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedPlan(null);
  };

  const handleBookingSubmit = (data) => {
    setBookingData(data);
    setShowBookingForm(false);
    setShowPaymentProcessor(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
    setShowPaymentProcessor(false);
    setSelectedPlan(null);
    setBookingData(null);

    alert(
      `Payment successful! Booking confirmed for ${bookingData?.childName}. Payment ID: ${paymentResult.paymentId}`
    );
  };

  const handlePaymentCancel = () => {
    setShowPaymentProcessor(false);
    setShowBookingForm(true);
  };

  const handlePaymentError = (error) => {
    setShowPaymentProcessor(false);
    alert(`Payment failed: ${error.message}. Please try again.`);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src={afcLogo} alt="AFC Logo" className="h-14 w-auto" />
              <span className="text-xl font-bold text-gray-900">
                Atomics Summer Camp
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Summer 2025 Registration Open
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Summer Camp 2025
              <span className="block text-yellow-300">
                Choose Your Program!
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join us for an unforgettable summer experience. Choose between our
              multi-sport Kids Camp or specialized Football Clinic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Kids Camp Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Kids Camp</CardTitle>
                <CardDescription className="text-white/80">
                  Available in Abu Dhabi & Al Ain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-4">8:30 AM - 2 PM</p>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() => {
                    setSelectedLocation("abuDhabi");
                    document
                      .getElementById("pricing")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>

            {/* Football Clinic Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Football Clinic
                </CardTitle>
                <CardDescription className="text-white/80">
                  Available in Abu Dhabi Only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-4">3 PM - 9 PM</p>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() => {
                    setSelectedLocation("abuDhabi");
                    document
                      .getElementById("pricing")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program Activities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the program that best suits your child's interests and
              goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kids Camp Activities */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-[400px]">
                <img
                  src={kidsCampImage}
                  alt="Kids Camp Activities"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <CardTitle className="text-2xl text-white mb-2">
                    Kids Camp Activities
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Multi-sport and educational program
                  </CardDescription>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Trophy className="h-5 w-5 mr-2" />
                      Sports & Physical Activities
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.kidsCamp.sports.map((activity, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Users className="h-5 w-5 mr-2" />
                      Cognitive & Creative Activities
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.kidsCamp.cognitive.map(
                        (activity, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            {activity}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Star className="h-5 w-5 mr-2" />
                      Fun Competitions
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.kidsCamp.competitions.map(
                        (activity, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            {activity}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Trophy className="h-5 w-5 mr-2" />
                      Skills Development
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.kidsCamp.skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Users className="h-5 w-5 mr-2" />
                      Age Groups
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.kidsCamp.ageGroups.map((group, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                          {group}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Football Clinic Activities */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-[400px]">
                <img
                  src={footballClinicImage}
                  alt="Football Clinic Activities"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <CardTitle className="text-2xl text-white mb-2">
                    Football Clinic Activities
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Powered by Atomics Football
                  </CardDescription>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Trophy className="h-5 w-5 mr-2" />
                      Focus Areas
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.footballClinic.focus.map(
                        (focus, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            {focus}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Clock className="h-5 w-5 mr-2" />
                      Schedule by Age Group
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.footballClinic.schedule.map(
                        (schedule, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            {schedule}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-blue-600">
                      <Users className="h-5 w-5 mr-2" />
                      Age Groups
                    </h4>
                    <ul className="space-y-2">
                      {campActivities.footballClinic.ageGroups.map(
                        (group, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1" />
                            {group}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location and Contact Information */}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your child's summer adventure
            </p>
          </div>

          {/* Location Selection */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Choose Your Location
              </h2>
              <div className="flex justify-center gap-4">
                <Button
                  variant={
                    selectedLocation === "abuDhabi" ? "default" : "outline"
                  }
                  onClick={() => setSelectedLocation("abuDhabi")}
                  className="px-8"
                >
                  Abu Dhabi
                </Button>
                <Button
                  variant={selectedLocation === "alAin" ? "default" : "outline"}
                  onClick={() => setSelectedLocation("alAin")}
                  className="px-8"
                >
                  Al Ain
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Choose Your Plan
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {campPlans[selectedLocation].map((plan) => (
                  <Card
                    key={plan.name}
                    className={`p-6 ${
                      plan.popular ? "border-blue-500" : ""
                    } flex flex-col`}
                  >
                    {plan.popular && (
                      <Badge className="mb-4 bg-blue-600 text-white">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-3xl font-bold mb-4">
                      AED {plan.price}
                    </div>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-auto"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Select Plan
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>
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
              <p className="text-gray-600">
                ADNEC, Abu Dhabi Summer Sports, UAE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src={afcLogo} alt="AFC Logo" className="h-6 w-auto" />
            <span className="text-lg font-semibold">Atomics Summer Camp</span>
          </div>
          <p className="text-gray-400 mb-4">
            Creating champions through sports, building character through play.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Atomics Summer Camp UAE. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Booking Form Modal */}
      {showBookingForm && selectedPlan && (
        <BookingForm
          selectedPlan={selectedPlan}
          selectedLocation={selectedLocation}
          onClose={handleCloseBookingForm}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Payment Processor Modal */}
      {showPaymentProcessor && bookingData && (
        <PaymentProcessor
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
}

export default App;
