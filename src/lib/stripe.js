// Stripe configuration and utility functions
import { loadStripe } from "@stripe/stripe-js";
import { getApiUrl, apiEndpoints } from "../config.js";

// Initialize Stripe with your publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  .then((stripe) => {
    console.log("Stripe loaded successfully");
    return stripe;
  })
  .catch((error) => {
    console.error("Error loading Stripe:", error);
    return null;
  });

export { stripePromise };

// Utility function to format currency
export const formatCurrency = (amount, currency = "AED") => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Create PaymentIntent by calling the backend
export const createPaymentIntent = async (amount, currency = "aed") => {
  try {
    console.log("Creating payment intent for amount:", amount);
    const response = await fetch(getApiUrl(apiEndpoints.createPaymentIntent), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount)),
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create payment intent");
    }

    const data = await response.json();
    console.log("Payment intent created successfully");
    return {
      client_secret: data.clientSecret,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};
