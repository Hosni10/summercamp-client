// Configuration file for environment variables and API endpoints
export const config = {
  // Backend URL - uses environment variable with fallback to production
  backendUrl:
    import.meta.env.VITE_SERVER_URL || "https://summercamp-server.onrender.com",

  // Frontend URL - uses environment variable with fallback to production
  frontendUrl:
    import.meta.env.VITE_DOMAIN_URL || "https://summercamp-client.vercel.app",

  // Stripe configuration
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => {
  return `${config.backendUrl}${endpoint}`;
};

// Common API endpoints
export const apiEndpoints = {
  bookings: "/api/bookings",
  consentForms: "/api/consent-forms",
  createPaymentIntent: "/create-payment-intent",
};
