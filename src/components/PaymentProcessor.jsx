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
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { CreditCard, Lock, CheckCircle, AlertCircle, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

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

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true);
      console.log("Stripe Elements is ready");
    }
  }, [stripe, elements]);

  // Create PaymentIntent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log("Initializing payment for plan:", bookingData.plan);
        const paymentIntent = await createPaymentIntent(bookingData.plan.price);
        console.log("Payment intent created:", paymentIntent);
        setClientSecret(paymentIntent.client_secret);
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        setPaymentError("Failed to initialize payment. Please try again.");
      }
    };

    initializePayment();
  }, [bookingData.plan.price]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      console.error("Missing required payment data:", {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret,
      });
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);
    console.log("Processing payment with card element");

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: bookingData.parentName,
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
        setPaymentError(error.message);
        onError(error);
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        onSuccess({
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });
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

        {paymentError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{paymentError}</span>
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
          disabled={!isStripeReady || isProcessing || !clientSecret}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(bookingData.plan.price)}`
          )}
        </Button>
      </div>
    </form>
  );
};

// Main Payment Processor Component
const PaymentProcessor = ({ bookingData, onSuccess, onCancel, onError }) => {
  const [paymentStatus, setPaymentStatus] = useState("form"); // 'form', 'success', 'error'
  const [paymentResult, setPaymentResult] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

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
    setPaymentResult(result);
    setPaymentStatus("success");
    setTimeout(() => {
      onSuccess(result);
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus("error");
    onError(error);
  };

  if (paymentStatus === "success") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed. You will receive a confirmation
              email shortly.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>
                <strong>Payment ID:</strong> {paymentResult?.paymentId}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {formatCurrency(bookingData.plan.price)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <span>Plan:</span>
                <span className="font-medium">{bookingData.plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{bookingData.plan.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Child:</span>
                <span>{bookingData.childName}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{bookingData.startDate}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-semibold">Total:</span>
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {formatCurrency(bookingData.plan.price)}
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
