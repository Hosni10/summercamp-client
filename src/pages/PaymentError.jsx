import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function PaymentError() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    if (location.state?.error) {
      setErrorDetails(location.state.error);
    } else {
      // Default error if no specific error is passed
      setErrorDetails({
        message: "Payment processing failed",
        code: "UNKNOWN_ERROR",
        details: "An unexpected error occurred during payment processing.",
      });
    }
  }, [location.state]);

  const handleTryAgain = () => {
    // Navigate back to the booking form or payment page
    if (location.state?.bookingData) {
      navigate("/", { state: { bookingData: location.state.bookingData } });
    } else {
      navigate("/");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getErrorMessage = (code) => {
    const errorMessages = {
      payment_intent_unexpected_state:
        "Payment session expired. Please try again.",
      card_declined:
        "Your card was declined. Please check your card details or try a different card.",
      insufficient_funds:
        "Insufficient funds in your account. Please try a different payment method.",
      expired_card: "Your card has expired. Please use a different card.",
      incorrect_cvc: "Incorrect CVC code. Please check and try again.",
      processing_error: "Payment processing error. Please try again.",
      UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    };

    return errorMessages[code] || "Payment failed. Please try again.";
  };

  if (!errorDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster richColors />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <Toaster richColors />
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Payment Failed
            </CardTitle>
            <p className="text-gray-600 mt-2">
              We couldn't process your payment
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
              <div className="text-sm text-red-700 space-y-1">
                <p>
                  <strong>Error:</strong> {getErrorMessage(errorDetails.code)}
                </p>
                {errorDetails.message && (
                  <p>
                    <strong>Message:</strong> {errorDetails.message}
                  </p>
                )}
                {errorDetails.details && (
                  <p>
                    <strong>Details:</strong> {errorDetails.details}
                  </p>
                )}
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                What to do next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your payment method details</li>
                <li>• Ensure you have sufficient funds</li>
                <li>• Try using a different card</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleTryAgain}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Home
              </Button>
            </div>

            {/* Contact Information */}
            <div className="text-center text-sm text-gray-600">
              <p>Need help? Contact us at:</p>
              <p className="font-medium">📞 050 333 1468</p>
              <p className="font-medium">✉️ info@atomicsfootball.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
