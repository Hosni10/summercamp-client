// Stripe configuration and utility functions
import { loadStripe } from "@stripe/stripe-js";

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

const DEFAULT_FETCH_TIMEOUT_MS = 45000;

export const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your connection and try again."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

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
    const serverUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    const response = await fetchWithTimeout(`${serverUrl}/create-payment-intent`, {
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
