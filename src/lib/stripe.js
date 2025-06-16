// Stripe configuration and utility functions
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Utility function to format currency
export const formatCurrency = (amount, currency = "AED") => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Utility function to convert AED to cents for Stripe
export const convertToCents = (amount) => {
  return Math.round(amount * 100);
};

// Simulate PaymentIntent creation (in production, this would be done on your backend)
export const createPaymentIntent = async (amount, currency = "aed") => {
  // This is a simulation - in production, you would call your backend API
  // which would create a PaymentIntent using Stripe's server-side API

  // For demo purposes, we'll simulate the response
  const paymentIntent = {
    id: `pi_${Math.random().toString(36).substr(2, 9)}`,
    client_secret: `pi_${Math.random()
      .toString(36)
      .substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
    amount: convertToCents(amount),
    currency: currency,
    status: "requires_payment_method",
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return paymentIntent;
};
