import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  stripePromise,
  createPaymentIntent,
  formatCurrency,
} from "../lib/stripe.js";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { CreditCard, Lock, AlertCircle, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { format, addDays } from "date-fns";

// Stripe Elements styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: true,
};

// Payment Form Component (inside Elements provider)
const PaymentForm = ({ bookingData, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true);
      console.log("Stripe Elements is ready");
    }
  }, [stripe, elements]);

  // Create PaymentIntent when component mounts - only once
  useEffect(() => {
    const initializePayment = async () => {
      if (isInitializing) {
        try {
          setIsInitializing(true);
          setPaymentError(null);
          // Use final total with tax if available, otherwise fallback to plan price
          let amount =
            bookingData?.pricing?.finalTotal ?? bookingData.plan.price;
          amount = Number(amount);
          if (isNaN(amount) || amount <= 0)
            throw new Error("Invalid payment amount");
          console.log("Initializing payment for amount:", amount);
          const paymentIntent = await createPaymentIntent(amount);
          setClientSecret(paymentIntent.client_secret);
          console.log("Payment intent created successfully");
        } catch (error) {
          console.error("Failed to initialize payment:", error);
          setPaymentError("Failed to initialize payment. Please try again.");
        } finally {
          setIsInitializing(false);
        }
      }
    };
    initializePayment();
  }, []); // Empty dependency array to run only once

  const resetPayment = () => {
    setClientSecret(null);
    setPaymentError(null);
    setIsProcessing(false);
    setIsInitializing(true);
    // Re-initialize payment
    const initializePayment = async () => {
      try {
        setIsInitializing(true);
        setPaymentError(null);
        let amount = bookingData?.pricing?.finalTotal ?? bookingData.plan.price;
        amount = Number(amount);
        if (isNaN(amount) || amount <= 0)
          throw new Error("Invalid payment amount");
        console.log("Re-initializing payment for amount:", amount);
        const paymentIntent = await createPaymentIntent(amount);
        setClientSecret(paymentIntent.client_secret);
        console.log("Payment intent re-created successfully");
      } catch (error) {
        console.error("Failed to re-initialize payment:", error);
        setPaymentError("Failed to initialize payment. Please try again.");
      } finally {
        setIsInitializing(false);
      }
    };
    initializePayment();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      console.error("Missing required payment data:", {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret,
      });
      setPaymentError("Payment system not ready. Please try again.");
      return;
    }

    if (isProcessing) {
      console.log("Payment already in progress");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError("Card element not found. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    console.log("Processing payment with card element");

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${bookingData.firstName} ${bookingData.lastName}`,
              email: bookingData.parentEmail,
              phone: bookingData.parentPhone,
              address: {
                line1: bookingData.parentAddress,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        if (error.code === "payment_intent_unexpected_state") {
          setPaymentError("Payment session expired. Please try again.");
          // Reset payment intent
          resetPayment();
        } else {
          setPaymentError(error.message);
          onError(error);
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        console.log("Calling onSuccess from PaymentForm");
        onSuccess({
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });
        console.log("onSuccess called from PaymentForm");
      } else {
        console.error(
          "Payment intent status unexpected:",
          paymentIntent?.status
        );
        setPaymentError("Payment status unexpected. Please try again.");
        onError(new Error("Payment status unexpected"));
      }
    } catch (error) {
      console.error("Unexpected payment error:", error);
      setPaymentError("An unexpected error occurred. Please try again.");
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Payment Method</h3>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          {isStripeReady ? (
            <CardElement options={cardElementOptions} />
          ) : (
            <div className="text-gray-500">Loading payment form...</div>
          )}
        </div>

        {/* Show the amount to be paid */}
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium">Amount to Pay:</span>
          <Badge className="bg-blue-600 text-white text-lg">
            AED {bookingData?.pricing?.finalTotal ?? bookingData.plan.price}
          </Badge>
        </div>

        {paymentError && (
          <div className="flex flex-col gap-2 text-red-600 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{paymentError}</span>
            </div>
            {paymentError.includes("expired") && (
              <Button
                type="button"
                onClick={resetPayment}
                className="text-xs bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Retry Payment
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
        <Lock className="h-4 w-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Test Card Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          Test Card Information
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Card Number:</strong> 4242 4242 4242 4242
          </p>
          <p>
            <strong>Expiry:</strong> Any future date (e.g., 12/25)
          </p>
          <p>
            <strong>CVC:</strong> Any 3 digits (e.g., 123)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !isStripeReady || isProcessing || !clientSecret || isInitializing
          }
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isInitializing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Initializing...
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            `Pay AED ${
              bookingData?.pricing?.finalTotal ?? bookingData.plan.price
            }`
          )}
        </Button>
      </div>
    </form>
  );
};

// Main Payment Processor Component
const PaymentProcessor = ({ bookingData, onSuccess, onCancel, onError }) => {
  const [stripePromise, setStripePromise] = useState(null);

  console.log("PaymentProcessor rendered with props:", {
    hasBookingData: !!bookingData,
    onSuccessType: typeof onSuccess,
    onCancelType: typeof onCancel,
    onErrorType: typeof onError,
  });

  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );
      console.log("Stripe initialized:", !!stripe);
      setStripePromise(stripe);
    };
    initStripe();
  }, []);

  const handlePaymentSuccess = (result) => {
    // Just call the parent's onSuccess callback - let the parent handle everything
    if (typeof onSuccess === "function") {
      console.log("Calling parent onSuccess callback");
      onSuccess(result);
    } else {
      console.error("onSuccess is not a function!");
    }
  };

  const handlePaymentError = (error) => {
    console.log("Payment error in PaymentProcessor:", error);
    onError(error);
  };

  const getAccessPeriod = (startDate, planName, location) => {
    // Validate startDate
    if (!startDate || !planName) return null;

    // Check if startDate is a valid date
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      console.error("Invalid start date:", startDate);
      return null;
    }

    let end;
    let description = "";

    // Al Ain plans (Monday to Thursday)
    if (location === "alAin") {
      if (planName.toLowerCase().includes("1-day")) {
        end = start;
        description = "1 day access (Monday to Thursday only)";
      } else if (planName.toLowerCase().includes("1 week")) {
        end = new Date(start);
        end.setDate(start.getDate() + 3); // 4 days: Mon-Thu
        description = "4 days access within 1 week (Monday to Thursday)";
      } else if (planName.toLowerCase().includes("2 weeks")) {
        end = new Date(start);
        end.setDate(start.getDate() + 7); // 8 days: 2x Mon-Thu
        description = "8 days access within 2 weeks (Monday to Thursday)";
      } else if (planName.toLowerCase().includes("1 month")) {
        end = new Date(start);
        end.setDate(start.getDate() + 15); // 16 days: 4x Mon-Thu
        description =
          "16 days access within 1 month (Monday to Thursday each week)";
      } else if (planName.toLowerCase().includes("full camp")) {
        end = new Date(start);
        end.setDate(start.getDate() + 25); // 26 days: 6.5x Mon-Thu
        description =
          "26 days access for the full camp (Monday to Thursday each week)";
      } else {
        end = start;
        description =
          "Access period based on selected plan (Monday to Thursday)";
      }
    } else {
      // Abu Dhabi and fallback (Monday to Friday)
      if (planName.toLowerCase().includes("1-day")) {
        end = start;
        description = "1 day access (Monday to Friday only)";
      } else if (planName.toLowerCase().includes("3-day")) {
        end = new Date(start);
        end.setDate(start.getDate() + 2);
        description = "3 days access within one week (Monday to Friday only)";
      } else if (planName.toLowerCase().includes("5-day")) {
        end = new Date(start);
        end.setDate(start.getDate() + 4);
        description = "5 days access within one week (Monday to Friday only)";
      } else if (planName.toLowerCase().includes("10-day")) {
        end = new Date(start);
        end.setDate(start.getDate() + 9);
        description = "10 days access within two weeks";
      } else if (planName.toLowerCase().includes("20-day")) {
        end = new Date(start);
        end.setDate(start.getDate() + 19);
        description = "20 days access within two weeks from start date";
      } else if (planName.toLowerCase().includes("full camp")) {
        end = new Date("2025-08-21");
        description = "Full camp access (unlimited days)";
      } else {
        end = start;
        description = "Access period based on selected plan";
      }
    }

    // Validate end date
    if (isNaN(end.getTime())) {
      console.error("Invalid end date calculated for plan:", planName);
      return null;
    }

    return {
      start: format(start, "MMMM d, yyyy"),
      end: format(end, "MMMM d, yyyy"),
      days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
      description,
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Complete Payment
            </CardTitle>
            <CardDescription>
              Review your booking details and complete the payment
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Parent Name:</span>
                <span className="font-medium">
                  {bookingData.firstName} {bookingData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">{bookingData.plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">
                  {bookingData.location === "alAin" ? "Al Ain" : "Abu Dhabi"}
                </span>
              </div>
              {/* Duration */}
              {(() => {
                console.log("PaymentProcessor - Booking data:", {
                  startDate: bookingData.startDate,
                  planName: bookingData.plan?.name,
                  location: bookingData.location,
                });

                const access = getAccessPeriod(
                  bookingData.startDate,
                  bookingData.plan.name,
                  bookingData.location
                );

                console.log("PaymentProcessor - Access period result:", access);

                return access ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{access.days} days</span>
                    </div>
                    <div className="flex justify-end text-xs text-gray-600 italic">
                      {access.description}
                    </div>
                  </div>
                ) : null;
              })()}
              {/* Child Names */}
              <div className="flex justify-between">
                <span>Children:</span>
                <span>
                  {bookingData.children && bookingData.children.length > 0
                    ? bookingData.children.map((c, i) => c.name).join(", ")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{bookingData.startDate}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-semibold">Total:</span>
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {formatCurrency(
                    bookingData.pricing?.finalTotal ?? bookingData.plan.price
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stripe Elements Payment Form */}
          {stripePromise && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={onCancel}
              />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;
