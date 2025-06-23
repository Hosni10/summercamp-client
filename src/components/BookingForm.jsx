import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { Badge } from "./ui/badge.jsx";
import { X, Calendar, User, Phone, Mail, MapPin } from "lucide-react";
import {
  format,
  addDays,
  isWithinInterval,
  isMonday,
  isThursday,
  isFriday,
} from "date-fns";
import axios from "axios";
import PaymentProcessor from "./PaymentProcessor.jsx";
import { toast, Toaster } from "sonner";

const BookingForm = ({ selectedPlan, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",
    numberOfChildren: 1,
    children: [{ name: "", dateOfBirth: "", gender: "" }],
    startDate: "",
  });

  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Function to validate age range (4-12 years)
  const validateAge = (dateOfBirth) => {
    const age = calculateAge(dateOfBirth);
    if (age === null) return "Date of birth is required";
    if (age < 4) return "Child must be at least 4 years old";
    if (age > 12) return "Child must be 12 years old or younger";
    return null;
  };

  const calculateChildPrice = (childIndex) => {
    const basePrice = parseInt(selectedPlan.price.replace(/,/g, "")) || 0;
    if (childIndex === 0) return basePrice; // First child pays full price

    // Calculate discount for each child based on position
    const discountPercentage = Math.min(10 + (childIndex - 1) * 5, 20); // 2nd child: 10%, 3rd: 15%, 4th: 20%, 5th+: 20%
    const discountAmount = (basePrice * discountPercentage) / 100;
    return Math.round((basePrice - discountAmount) * 100) / 100;
  };

  const basePrice = parseInt(selectedPlan.price.replace(/,/g, "")) || 0;
  const numChildren = parseInt(formData.numberOfChildren) || 1;

  // Calculate individual child prices
  const childPrices = [];
  let totalAmount = 0;
  for (let i = 0; i < numChildren; i++) {
    const childPrice = calculateChildPrice(i);
    childPrices.push(childPrice);
    totalAmount += childPrice;
  }

  const originalTotal = basePrice * numChildren;
  const totalDiscount = originalTotal - totalAmount;

  // Add 5% tax to the discounted total
  const taxAmount = Math.round(totalAmount * 0.05 * 100) / 100;
  const finalTotal = totalAmount + taxAmount;

  const validateForm = () => {
    const errors = {};

    // Basic validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 3) {
      errors.firstName = "First name must be at least 3 characters";
    } else if (formData.firstName.trim().length > 20) {
      errors.firstName = "First name must be maximum 20 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 3) {
      errors.lastName = "Last name must be at least 3 characters";
    } else if (formData.lastName.trim().length > 20) {
      errors.lastName = "Last name must be maximum 20 characters";
    }

    if (!formData.parentEmail.trim()) errors.parentEmail = "Email is required";
    if (!formData.parentPhone.trim()) errors.parentPhone = "Phone is required";
    if (!formData.parentAddress.trim())
      errors.parentAddress = "Address is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!selectedPlan) errors.plan = "Please select a plan";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parentEmail && !emailRegex.test(formData.parentEmail)) {
      errors.parentEmail = "Please enter a valid email address";
    }

    // UAE Phone validation
    const uaePhoneRegex = /^(\+971|971|0)?[2-9][0-9]{8}$/;
    if (
      formData.parentPhone &&
      !uaePhoneRegex.test(formData.parentPhone.replace(/\s/g, ""))
    ) {
      errors.parentPhone =
        "Please enter a valid UAE phone number (e.g., 0501234567, +971501234567)";
    }

    // Children validation
    if (formData.numberOfChildren < 1) {
      errors.numberOfChildren = "At least one child is required";
    }

    formData.children.forEach((child, index) => {
      if (!child.name.trim()) {
        errors[`child${index}Name`] = "Child name is required";
      } else if (child.name.trim().length < 3) {
        errors[`child${index}Name`] =
          "Child name must be at least 3 characters";
      } else if (child.name.trim().length > 20) {
        errors[`child${index}Name`] =
          "Child name must be maximum 20 characters";
      }

      // Validate date of birth and age
      const ageValidation = validateAge(child.dateOfBirth);
      if (ageValidation) {
        errors[`child${index}DateOfBirth`] = ageValidation;
      }

      if (!child.gender) errors[`child${index}Gender`] = "Gender is required";
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChildrenChange = (idx, field, value) => {
    const updated = [...formData.children];
    updated[idx][field] = value;
    setFormData({ ...formData, children: updated });

    // Real-time validation for child names
    if (field === "name") {
      const newErrors = { ...errors };
      if (!value.trim()) {
        newErrors[`child${idx}Name`] = "Child name is required";
      } else if (value.trim().length < 3) {
        newErrors[`child${idx}Name`] =
          "Child name must be at least 3 characters";
      } else if (value.trim().length > 20) {
        newErrors[`child${idx}Name`] =
          "Child name must be maximum 20 characters";
      } else {
        delete newErrors[`child${idx}Name`];
      }
      setErrors(newErrors);
    }

    // Real-time validation for date of birth
    if (field === "dateOfBirth") {
      const newErrors = { ...errors };
      const ageValidation = validateAge(value);
      if (ageValidation) {
        newErrors[`child${idx}DateOfBirth`] = ageValidation;
      } else {
        delete newErrors[`child${idx}DateOfBirth`];
      }
      setErrors(newErrors);
    }
  };

  // Real-time validation for first name
  const handleFirstNameChange = (value) => {
    setFormData({ ...formData, firstName: value });
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors.firstName = "First name is required";
    } else if (value.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    } else if (value.trim().length > 20) {
      newErrors.firstName = "First name must be maximum 20 characters";
    } else {
      delete newErrors.firstName;
    }
    setErrors(newErrors);
  };

  // Real-time validation for last name
  const handleLastNameChange = (value) => {
    setFormData({ ...formData, lastName: value });
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (value.trim().length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters";
    } else if (value.trim().length > 20) {
      newErrors.lastName = "Last name must be maximum 20 characters";
    } else {
      delete newErrors.lastName;
    }
    setErrors(newErrors);
  };

  // Real-time validation for email
  const handleEmailChange = (value) => {
    setFormData({ ...formData, parentEmail: value });
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors.parentEmail = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.parentEmail = "Please enter a valid email address";
      } else {
        delete newErrors.parentEmail;
      }
    }
    setErrors(newErrors);
  };

  // Real-time validation for phone
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, parentPhone: value });
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors.parentPhone = "Phone is required";
    } else {
      const uaePhoneRegex = /^(\+971|971|0)?[2-9][0-9]{8}$/;
      if (!uaePhoneRegex.test(value.replace(/\s/g, ""))) {
        newErrors.parentPhone =
          "Please enter a valid UAE phone number (e.g., 0501234567, +971501234567)";
      } else {
        delete newErrors.parentPhone;
      }
    }
    setErrors(newErrors);
  };

  const handleNumChildrenChange = (value) => {
    const num = parseInt(value);
    let updated = [...formData.children];
    if (num > updated.length) {
      for (let i = updated.length; i < num; i++) {
        updated.push({ name: "", dateOfBirth: "", gender: "" });
      }
    } else {
      updated = updated.slice(0, num);
    }
    setFormData({ ...formData, numberOfChildren: num, children: updated });
  };

  const calculateAccessPeriod = (startDate, planName) => {
    const start = new Date(startDate);
    let end;

    if (planName.toLowerCase().includes("1 day")) {
      end = addDays(start, 1);
    } else if (planName.toLowerCase().includes("1 week")) {
      end = addDays(start, 7);
    } else if (planName.toLowerCase().includes("full month")) {
      end = addDays(start, 30);
    } else if (planName.toLowerCase().includes("full camp")) {
      end = new Date("2025-08-21");
    } else {
      end = addDays(start, 1);
    }

    return {
      start: format(start, "MMMM d, yyyy"),
      end: format(end, "MMMM d, yyyy"),
      days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Debug logging for payment calculation
    console.log("BookingForm Payment Debug:", {
      basePrice,
      numChildren,
      childPrices,
      totalAmount,
      totalDiscount,
      selectedPlan,
      formData,
    });

    if (!validateForm()) {
      toast.error(
        "Please fix the errors in the form before submitting. Make sure all required fields are filled and dates are valid."
      );
      return;
    }

    // Don't save booking here - only save after successful payment
    // Just proceed to payment
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsSubmitting(true);
    toast.success("Payment successful! Saving your booking...");

    const bookingPayload = {
      ...formData,
      plan: selectedPlan,
      pricing: {
        originalTotal,
        totalDiscount,
        taxAmount,
        finalTotal,
      },
      paymentId: paymentResult.paymentId,
    };

    try {
      console.log("Payment successful, saving booking...");
      console.log(
        "API URL:",
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
        }/api/bookings`
      );
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
        }/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const savedBookingResult = await response.json();

      if (!savedBookingResult.success) {
        throw new Error(
          savedBookingResult.message || "Failed to save booking."
        );
      }

      console.log("Booking saved successfully:", savedBookingResult.booking);
      toast.info("Redirecting to payment success page...");

      console.log(
        "About to navigate to /payment-success with booking data:",
        savedBookingResult.booking
      );

      // Close the payment modal first
      setShowPayment(false);

      // Navigate to payment success page instead of directly to consent form
      try {
        navigate("/payment-success", {
          state: { booking: savedBookingResult.booking },
        });
        console.log("Navigation to payment success initiated successfully");
      } catch (navError) {
        console.error("Navigation failed:", navError);
        // Fallback: use window.location
        window.location.href = `/payment-success?booking=${savedBookingResult.booking._id}`;
      }
    } catch (error) {
      console.error("Error saving booking after payment:", error);
      toast.error(
        `Your payment was successful, but we failed to save your booking. Please contact support. Error: ${error.message}`
      );
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error) => {
    console.log("Payment error in BookingForm:", error);
    setIsSubmitting(false);
    setShowPayment(false);

    // Navigate to payment error page with error details
    navigate("/payment-error", {
      state: {
        error: {
          message: error.message || "Payment processing failed",
          code: error.code || "UNKNOWN_ERROR",
          details:
            error.details ||
            "An unexpected error occurred during payment processing.",
        },
        bookingData: fullBookingData,
      },
    });
  };

  const fullBookingData = {
    ...formData,
    plan: selectedPlan,
    pricing: {
      originalTotal,
      totalDiscount,
      taxAmount,
      finalTotal,
    },
  };

  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <PaymentProcessor
          bookingData={fullBookingData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => {
            setShowPayment(false);
            setIsSubmitting(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Book Your Camp</h2>
              <p className="text-gray-600 mt-1">
                {selectedPlan?.name?.toLowerCase().includes("football") ||
                selectedPlan?.description?.toLowerCase().includes("football")
                  ? "Abu Dhabi - Full day access to Football Clinic"
                  : "Abu Dhabi - Full day access to Kids Camp"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Selected Plan Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{selectedPlan?.name}</h3>
                <p className="text-gray-600">
                  {selectedPlan?.name?.toLowerCase().includes("football") ||
                  selectedPlan?.description?.toLowerCase().includes("football")
                    ? "Full day access to Football Clinic"
                    : "Full day access to Kids Camp"}
                  {" - Abu Dhabi"}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-600 text-white">
                  AED {finalTotal}
                </Badge>
                {totalDiscount > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    Save AED {totalDiscount}
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="3-20 characters"
                    value={formData.firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="3-20 characters"
                    value={formData.lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentEmail">Email</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    placeholder="e.g., parent@email.com"
                    value={formData.parentEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                  {errors.parentEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentEmail}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentPhone">Phone Number</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="e.g., 0501234567 or +971501234567"
                    value={formData.parentPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                  />
                  {errors.parentPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentPhone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentAddress">Address</Label>
                  <Textarea
                    id="parentAddress"
                    value={formData.parentAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentAddress: e.target.value,
                      })
                    }
                  />
                  {errors.parentAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Child Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Children Information
              </h3>
              <div className="mb-4">
                <Label htmlFor="numberOfChildren">Number of Children</Label>
                <Select
                  value={formData.numberOfChildren.toString()}
                  onValueChange={handleNumChildrenChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-6">
                {formData.children.map((child, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-2">Child {idx + 1}</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`childName_${idx}`}>Full Name</Label>
                        <Input
                          id={`childName_${idx}`}
                          placeholder="3-20 characters"
                          value={child.name}
                          onChange={(e) =>
                            handleChildrenChange(idx, "name", e.target.value)
                          }
                        />
                        {errors[`childName_${idx}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`childName_${idx}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`childDateOfBirth_${idx}`}>
                          Date of Birth
                        </Label>
                        <Input
                          id={`childDateOfBirth_${idx}`}
                          type="date"
                          value={child.dateOfBirth}
                          onChange={(e) =>
                            handleChildrenChange(
                              idx,
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                        />
                        {((selectedPlan?.name &&
                          selectedPlan.name.toLowerCase().includes("camp")) ||
                          (selectedPlan?.description &&
                            selectedPlan.description
                              .toLowerCase()
                              .includes("camp"))) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Child must be 4-12 years old
                          </p>
                        )}
                        {errors[`childDateOfBirth_${idx}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`childDateOfBirth_${idx}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`childGender_${idx}`}>Gender</Label>
                        <Select
                          value={child.gender}
                          onValueChange={(value) =>
                            handleChildrenChange(idx, "gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boy">Boy</SelectItem>
                            <SelectItem value="girl">Girl</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`childGender_${idx}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`childGender_${idx}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Program Information
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    min="2025-07-01"
                    max="2025-08-21"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {formData.children.map((child, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>Child {idx + 1}:</span>
                    <span>AED {childPrices[idx]}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>AED {totalAmount}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount:</span>
                    <span>-AED {totalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>AED {taxAmount}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>AED {finalTotal}</span>
                  </div>
                </div>
              </div>
              {totalDiscount > 0 && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <span>
                    Great! You're saving AED {totalDiscount} with your discount.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Proceed to Payment</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
