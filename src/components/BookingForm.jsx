import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
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

const BookingForm = ({ selectedPlan, selectedLocation, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",
    numberOfChildren: 1,
    children: [{ name: "", age: "", gender: "" }],
    startDate: "",
  });

  const [errors, setErrors] = useState({});

  // Sibling discount logic - apply to individual children
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
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "parentEmail",
      "parentPhone",
      "parentAddress",
      "startDate",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    // Email validation
    if (
      formData.parentEmail &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        formData.parentEmail
      )
    ) {
      newErrors.parentEmail =
        "Please enter a valid email address (e.g. john@email.com)";
    }
    // Phone validation (UAE format)
    if (
      formData.parentPhone &&
      !/^(\+971|0)?[2-9]\d{8}$/.test(formData.parentPhone)
    ) {
      newErrors.parentPhone = "Please enter a valid UAE phone number";
    }
    // Children validation
    formData.children.forEach((child, idx) => {
      if (!child.name) newErrors[`childName_${idx}`] = "This field is required";
      const age = parseInt(child.age);
      if (isNaN(age) || age < 4 || age > 12) {
        newErrors[`childAge_${idx}`] =
          "Child must be between 4 and 12 years old";
      }
      if (!child.gender)
        newErrors[`childGender_${idx}`] = "This field is required";
    });
    // Date validation (reuse existing logic)
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      } else {
        const dayOfWeek = startDate.getDay();
        const currentYear = new Date().getFullYear();
        if (selectedLocation === "abuDhabi") {
          const abuDhabiStart = new Date(`${currentYear}-07-01`);
          const abuDhabiEnd = new Date(`${currentYear}-08-21`);
          if (startDate < abuDhabiStart || startDate > abuDhabiEnd) {
            newErrors.startDate = `Camp in Abu Dhabi runs from July 1 to August 21, ${currentYear}`;
          } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            newErrors.startDate = "Camp in Abu Dhabi runs Monday to Friday";
          }
        } else if (selectedLocation === "alAin") {
          const alAinStart = new Date(`${currentYear}-07-05`);
          const alAinEnd = new Date(`${currentYear}-08-19`);
          if (startDate < alAinStart || startDate > alAinEnd) {
            newErrors.startDate = `Camp in Al Ain runs from July 5 to August 19, ${currentYear}`;
          } else if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            newErrors.startDate = "Camp in Al Ain runs Monday to Thursday";
          }
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChildrenChange = (idx, field, value) => {
    const updated = [...formData.children];
    updated[idx][field] = value;
    setFormData({ ...formData, children: updated });
  };

  const handleNumChildrenChange = (value) => {
    const num = parseInt(value);
    let updated = [...formData.children];
    if (num > updated.length) {
      for (let i = updated.length; i < num; i++) {
        updated.push({ name: "", age: "", gender: "" });
      }
    } else {
      updated = updated.slice(0, num);
    }
    setFormData({ ...formData, numberOfChildren: num, children: updated });
  };

  const calculateAccessPeriod = (startDate, planName) => {
    const start = new Date(startDate);
    let end;

    if (planName.toLowerCase().includes("1-day")) {
      end = start;
    } else if (planName.toLowerCase().includes("3-day")) {
      end = addDays(start, 2);
    } else if (planName.toLowerCase().includes("5-day")) {
      end = addDays(start, 4);
    } else if (planName.toLowerCase().includes("10-day")) {
      end = addDays(start, 9);
    } else if (planName.toLowerCase().includes("20-day")) {
      end = addDays(start, 19);
    } else if (planName.toLowerCase().includes("full camp")) {
      end =
        selectedLocation === "abuDhabi"
          ? new Date("2024-08-21")
          : new Date("2024-08-19");
    }

    return {
      start: format(start, "MMMM d, yyyy"),
      end: format(end, "MMMM d, yyyy"),
      days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
    };
  };

  const sendConfirmationEmail = async (bookingData, paymentId) => {
    const accessPeriod = calculateAccessPeriod(
      bookingData.startDate,
      selectedPlan.name
    );
    const ticketNumber =
      paymentId ||
      `TICKET-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const childNames = bookingData.children.map((c) => c.name).join(", ");
    const htmlTicket = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 2px solid #ed3227; border-radius: 16px; overflow: hidden;">
        <div style="background: #ed3227; color: #fff; padding: 24px 0; text-align: center;">
          <h2 style="margin: 0; font-size: 2rem; letter-spacing: 2px;">Summer Camp Ticket</h2>
          <div style="font-size: 1.1rem; margin-top: 8px;">Thank you for your booking!</div>
        </div>
        <div style="padding: 24px; background: #fff;">
          <p style="margin: 0 0 16px 0; font-size: 1.1rem;">Hello <strong>${
            bookingData.firstName + " " + bookingData.lastName
          }</strong>,</p>
          <div style="border: 1px dashed #ed3227; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="font-size: 1.1rem; margin-bottom: 8px;"><strong>Ticket Number:</strong> <span style="color: #ed3227;">${ticketNumber}</span></div>
            <div><strong>Plan:</strong> ${selectedPlan.name}</div>
            <div><strong>Location:</strong> ${
              selectedLocation === "abuDhabi" ? "Abu Dhabi" : "Al Ain"
            }</div>
            <div><strong>Child(ren):</strong> ${childNames}</div>
            <div><strong>Access Period:</strong> ${accessPeriod.days} days (${
      accessPeriod.start
    } to ${accessPeriod.end})</div>
            <div><strong>Start Date:</strong> ${bookingData.startDate}</div>
            <div><strong>Total Paid:</strong> AED ${
              bookingData.pricing.finalTotal
            }</div>
          </div>
          <div style="font-size: 1rem; color: #333; margin-bottom: 12px;">Please present this ticket (printed or on your phone) at the camp entrance.</div>
          <div style="font-size: 0.95rem; color: #888;">If you have any questions, contact us at <a href="mailto:info@atomicsfootball.com" style="color: #ed3227;">info@atomicsfootball.com</a>.</div>
        </div>
        <div style="background: #ed3227; color: #fff; text-align: center; padding: 12px 0; font-size: 0.95rem;">Atomics Football Club &copy; 2024</div>
      </div>
    `;
    const emailContent = {
      to: bookingData.parentEmail,
      subject: `Your Summer Camp Ticket - ${selectedPlan.name}`,
      html: htmlTicket,
    };
    try {
      const response = await axios.post("/api/send-email", emailContent);
      if (response.status !== 200) {
        throw new Error("Failed to send confirmation email");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
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
    if (validateForm()) {
      // Ensure children data is properly formatted
      const formattedChildren = formData.children.map((child) => ({
        name: child.name,
        age: parseInt(child.age),
        gender: child.gender,
      }));

      const bookingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        parentAddress: formData.parentAddress,
        numberOfChildren: formData.numberOfChildren,
        children: formattedChildren,
        startDate: formData.startDate,
        plan: selectedPlan,
        location: selectedLocation,
        pricing: {
          finalTotal: finalTotal,
        },
      };

      try {
        // Save booking to database
        console.log("Sending booking data:", bookingData);
        const response = await axios.post("/api/bookings", bookingData);

        if (response.status !== 201) {
          throw new Error("Failed to save booking");
        }

        const result = response.data;
        console.log("Booking saved successfully:", result.bookingId);

        // Add the booking ID to the booking data
        bookingData.bookingId = result.bookingId;

        await sendConfirmationEmail(bookingData);
        onSubmit(bookingData);
      } catch (error) {
        console.error("Error saving booking:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        alert(
          `Failed to save booking: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Book Your Camp</h2>
              <p className="text-gray-600 mt-1">
                {selectedLocation === "abuDhabi"
                  ? selectedPlan?.name?.toLowerCase().includes("football") ||
                    selectedPlan?.description
                      ?.toLowerCase()
                      .includes("football")
                    ? "Abu Dhabi - Full day access to Football Clinic"
                    : "Abu Dhabi - Full day access to Kids Camp"
                  : "Al Ain - Kids Camp (8:30 AM - 2 PM)"}
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
                  {selectedLocation === "abuDhabi"
                    ? selectedPlan?.name?.toLowerCase().includes("football") ||
                      selectedPlan?.description
                        ?.toLowerCase()
                        .includes("football")
                      ? "Full day access to Football Clinic"
                      : "Full day access to Kids Camp"
                    : "Kids Camp (8:30 AM - 2 PM)"}
                  {" - "}
                  {selectedLocation === "abuDhabi" ? "Abu Dhabi" : "Al Ain"}
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
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
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
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
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
                    value={formData.parentEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, parentEmail: e.target.value })
                    }
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
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
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
                        <Label htmlFor={`childAge_${idx}`}>Age</Label>
                        <Input
                          id={`childAge_${idx}`}
                          type="number"
                          min="4"
                          max="12"
                          value={child.age}
                          onChange={(e) =>
                            handleChildrenChange(idx, "age", e.target.value)
                          }
                        />
                        {errors[`childAge_${idx}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`childAge_${idx}`]}
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
                    min={`${new Date().getFullYear()}-${
                      selectedLocation === "abuDhabi" ? "07-01" : "07-05"
                    }`}
                    max={`${new Date().getFullYear()}-${
                      selectedLocation === "abuDhabi" ? "08-21" : "08-19"
                    }`}
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
