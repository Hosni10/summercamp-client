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

const BookingForm = ({ selectedPlan, selectedLocation, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",
    numberOfChildren: 1,
    children: [{ name: "", age: "", gender: "" }],
    startDate: "",
  });

  const [errors, setErrors] = useState({});

  // Sibling discount logic
  const calculateDiscount = (num) => {
    if (num === 1) return 0;
    if (num === 2) return 10;
    if (num === 3) return 15;
    return 20;
  };
  const basePrice = parseInt(selectedPlan.price);
  const numChildren = parseInt(formData.numberOfChildren);
  const discount = calculateDiscount(numChildren);
  const subtotal = basePrice * numChildren;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "parentName",
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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)
    ) {
      newErrors.parentEmail = "Please enter a valid email address";
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

  const sendConfirmationEmail = async (bookingData) => {
    const accessPeriod = calculateAccessPeriod(
      bookingData.startDate,
      selectedPlan.name
    );

    const emailContent = {
      to: bookingData.parentEmail,
      subject: `Summer Camp Booking Confirmation - ${selectedPlan.name}`,
      text: `
Dear ${bookingData.parentName},

Thank you for booking the ${selectedPlan.name} for your child ${
        bookingData.children[0].name
      }.

Booking Details:
- Plan: ${selectedPlan.name}
- Location: ${selectedLocation === "abuDhabi" ? "Abu Dhabi" : "Al Ain"}
- Access Period: ${accessPeriod.days} days (${accessPeriod.start} to ${
        accessPeriod.end
      })
- Price: AED ${selectedPlan.price}

${
  selectedLocation === "abuDhabi"
    ? "Your booking includes access to both Kids Camp and Football Clinic."
    : "Your booking includes access to Kids Camp."
}

Kids Camp Schedule:
- Abu Dhabi: Monday to Friday, 8:30 AM - 2 PM
- Al Ain: Monday to Thursday, 8:30 AM - 2 PM

${
  selectedLocation === "abuDhabi"
    ? `
Football Clinic Schedule (Abu Dhabi only):
- U17 & U18: 3:00 PM - 5:00 PM
- U6, U8 & U10: 5:00 PM - 6:15 PM
- U12 & U13: 6:15 PM - 7:40 PM
- U14 & U15: 7:30 PM - 9:00 PM
`
    : ""
}

Please ensure your child arrives 15 minutes before the scheduled time.

If you have any questions, please don't hesitate to contact us.

Best regards,
Summer Camp Team
      `,
    };

    try {
      // Here you would integrate with your email service
      // For example, using a backend API endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailContent),
      });

      if (!response.ok) {
        throw new Error("Failed to send confirmation email");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      // You might want to show a notification to the user
      // but still proceed with the booking
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingData = {
        ...formData,
        plan: selectedPlan,
        location: selectedLocation,
        pricing: {
          basePrice,
          numChildren,
          discount,
          subtotal,
          discountAmount,
          total,
        },
      };
      await sendConfirmationEmail(bookingData);
      onSubmit(bookingData);
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
                  ? "Abu Dhabi - Full day access to Kids Camp and Football Clinic"
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
                    ? "Full day access to Kids Camp and Football Clinic"
                    : "Kids Camp (8:30 AM - 2 PM)"}
                  {" - "}
                  {selectedLocation === "abuDhabi" ? "Abu Dhabi" : "Al Ain"}
                </p>
              </div>
              <Badge className="bg-blue-600 text-white">
                AED {selectedPlan?.price}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="parentName">Full Name</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                  />
                  {errors.parentName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parentName}
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
                <div className="flex justify-between">
                  <span>Base Price per Child:</span>
                  <span>AED {basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Children:</span>
                  <span>{numChildren}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>AED {subtotal}</span>
                </div>
                {discount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Sibling Discount ({discount}%):</span>
                      <span>-AED {discountAmount}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>AED {total}</span>
                      </div>
                    </div>
                  </>
                )}
                {discount === 0 && (
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>AED {total}</span>
                    </div>
                  </div>
                )}
              </div>
              {discount > 0 && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <span>
                    Great! You're saving AED {discountAmount} with your sibling
                    discount.
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
