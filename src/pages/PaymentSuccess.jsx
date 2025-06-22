import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
    } else {
      toast.error("No booking data found. Redirecting to home...");
      setTimeout(() => navigate("/"), 10000);
    }
  }, [location.state, navigate]);

  const handleContinueNow = () => {
    navigate("/parent-consent", { state: { booking } });
  };

  // Function to determine plan type
  const getPlanType = (planName) => {
    if (!planName) return "Unknown Plan";

    const planNameLower = planName.toLowerCase();

    // Check for Football Clinic indicators
    if (
      planNameLower.includes("football") ||
      planNameLower.includes("clinic") ||
      planNameLower.includes("session") ||
      planNameLower.includes("membership") ||
      planNameLower.includes("training") ||
      planNameLower.includes("week") ||
      planNameLower.includes("month") ||
      planNameLower.includes("test plan") ||
      planNameLower.includes("1 day access") ||
      planNameLower.includes("3 sessions") ||
      planNameLower.includes("12 sessions") ||
      planNameLower.includes("21 sessions") ||
      planNameLower.includes("full camp access") ||
      planNameLower.includes("full month")
    ) {
      return "Football Clinic";
    }

    // Check for Kids Camp indicators
    if (
      planNameLower.includes("kids camp") ||
      planNameLower.includes("kids") ||
      (planNameLower.includes("day") &&
        !planNameLower.includes("week") &&
        !planNameLower.includes("month") &&
        !planNameLower.includes("access")) ||
      (planNameLower.includes("camp") &&
        !planNameLower.includes("clinic") &&
        !planNameLower.includes("access"))
    ) {
      return "Kids Camp";
    }

    // Default fallback based on the page context
    console.log("🔍 Using fallback logic. fromPage:", location.state?.fromPage);
    if (location.state?.fromPage === "football-clinic") {
      console.log("✅ Fallback: Football Clinic (from page context)");
      return "Football Clinic";
    }

    console.log("✅ Fallback: Kids Camp (default)");
    return "Kids Camp";
  };

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster richColors />
        <p>Loading...</p>
      </div>
    );
  }

  const planName =
    booking.plan?.name || booking.membershipPlan || "Selected Plan";
  const planType = getPlanType(planName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Toaster richColors />
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600">
            Your booking has been confirmed and payment processed successfully.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{booking._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parent Name:</span>
                <span className="font-medium">
                  {booking.firstName} {booking.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Type:</span>
                <span className="font-medium text-blue-600">{planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium text-green-600">
                  AED{" "}
                  {booking.pricing?.finalTotal ||
                    booking.totalAmountPaid ||
                    booking.plan?.price ||
                    "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">
              Next Steps
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>✅ Payment processed successfully</p>
              <p>📝 Complete the consent form (required)</p>
              <p>📧 Confirmation email sent to {booking.parentEmail}</p>
              <p>🎯 Ready for your {planType.toLowerCase()} experience!</p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinueNow}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold"
            >
              Continue to Consent Form
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please complete the consent form to
              finalize your booking. This is required for your child's
              participation in the {planType.toLowerCase()}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
