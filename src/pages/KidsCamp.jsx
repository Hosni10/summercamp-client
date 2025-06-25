import React, { useState, useEffect } from "react";
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
  Check,
  MapPin,
  Trophy,
  Users,
  Star,
  Clock,
  Calendar,
  X,
  ArrowRight,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import activitiesImage from "../assets/activities.jpeg";
import detailsImage from "../assets/full-new.jpeg";
import lastYearImage from "../assets/last-year-new.jpeg";
import fullImage from "../assets/kids-camp.jpeg";
import coachImage from "../assets/coach.jpeg";
import BookingForm from "../components/BookingForm.jsx";
import { useNavigate } from "react-router-dom";

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
        "Full day camp activities",
        "Extended skill development",
        "Progress tracking",
      ],
    },
    {
      name: "5-Days Access",
      description: "Complete summer camp experience",
      price: "850",
      features: [
        "Full day camp activities",
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
        "Full day camp activities",
        "Advanced activities",
        "Special workshops",
      ],
    },
    {
      name: "20-Days Access",
      description: "Full summer camp experience",
      price: "3,000",
      features: [
        "Full day camp activities",
        "Complete summer program",
        "Exclusive activities",
      ],
    },
    {
      name: "Full Camp Access",
      description: "Unlimited access to all camp days and activities",
      price: "5,700",
      features: [
        "Full day camp activities",
        "Unlimited access",
        "Personalized coaching",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-w-[95vw] max-h-[95vh] w-auto h-auto flex flex-col items-center">
        {/* Close button */}
        <button
          className="absolute -top-12 right-0 text-white hover:text-red-400 text-3xl font-bold transition-colors duration-200 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Image container */}
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
            style={{
              maxWidth: "min(95vw, 1200px)",
              maxHeight: "85vh",
            }}
          />
        </div>

        {/* Click outside to close */}
        <div className="absolute inset-0 -z-10" onClick={onClose} />
      </div>
    </div>
  );
}

function KidsCamp() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("abuDhabi");
  const [modalImg, setModalImg] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: fullImage,
      title: "Kids Camp",
      subtitle: "Where Champions Are Made",
      description:
        "Join our comprehensive summer program designed to develop young talents through sports, education, and fun activities.",
      badge: "Summer 2025 Registration Open",
      buttonText: "Book Now",
      buttonAction: "book",
    },
    {
      image: coachImage,
      title: "Football Clinic",
      subtitle: "Professional Football Training",
      description:
        "Specialized football training for all skill levels. Professional coaching, tactical training, and match play experience.",
      badge: "Professional Coaching",
      buttonText: "View Football Clinic",
      buttonAction: "football",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (data) => {
    console.log("Booking submitted:", data);
    setShowBookingForm(false);
    // The BookingForm handles everything internally now
  };

  const getLocationName = (location) => {
    return "Abu Dhabi";
  };

  const handleFootballClinicClick = () => {
    navigate("/football-clinic");
  };

  const handleBookNowClick = () => {
    document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
  };

  const handleSlideButtonClick = () => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData.buttonAction === "football") {
      handleFootballClinicClick();
    } else {
      handleBookNowClick();
    }
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-[#ed3227]/50"></div>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center text-white">
            <div className="mb-8">
              <Badge className="mb-4 bg-[#ed3227] text-white hover:bg-[#ed3227]/90">
                {slides[currentSlide].badge}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {slides[currentSlide].title}
                <span className="block text-[#ed3227]">
                  {slides[currentSlide].subtitle}
                </span>
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                {slides[currentSlide].description}
              </p>
              <Button
                className="bg-[#ed3227] hover:bg-[#ed3227]/90 text-white px-8 py-6 text-lg"
                onClick={handleSlideButtonClick}
              >
                {slides[currentSlide].buttonText}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-[#ed3227]"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
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
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-[#ed3227] mt-1" />
                  <div>
                    <h3 className="font-semibold">Girls Group Available</h3>
                    <p className="text-gray-600">
                      Dedicated girls-only groups for comfortable participation
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>1st Kid:</strong> Full Price
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>2nd Kid:</strong> 10% off
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>3rd Kid:</strong> 15% off
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5 text-[#ed3227]" />
                    <span>
                      <strong>4th Kid:</strong> 20% off
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
