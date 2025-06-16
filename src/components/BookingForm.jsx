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
    childName: "",
    childAge: "",
    childGender: "",
    startDate: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "parentName",
      "parentEmail",
      "parentPhone",
      "parentAddress",
      "childName",
      "childAge",
      "childGender",
      "startDate",
    ];

    // Check required fields
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

    // Age validation
    const age = parseInt(formData.childAge);
    if (isNaN(age) || age < 6 || age > 18) {
      newErrors.childAge = "Child must be between 6 and 18 years old";
    }

    // Date validation
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      } else {
        const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        if (selectedLocation === "abuDhabi") {
          const abuDhabiStart = new Date("2024-07-01");
          const abuDhabiEnd = new Date("2024-08-21");

          if (startDate < abuDhabiStart || startDate > abuDhabiEnd) {
            newErrors.startDate =
              "Camp in Abu Dhabi runs from July 1 to August 21";
          } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            newErrors.startDate = "Camp in Abu Dhabi runs Monday to Friday";
          }
        } else if (selectedLocation === "alAin") {
          const alAinStart = new Date("2024-07-05");
          const alAinEnd = new Date("2024-08-19");

          if (startDate < alAinStart || startDate > alAinEnd) {
            newErrors.startDate =
              "Camp in Al Ain runs from July 5 to August 19";
          } else if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            newErrors.startDate = "Camp in Al Ain runs Monday to Thursday";
          }
        }

        // Validate plan-specific date requirements
        if (selectedPlan) {
          const planName = selectedPlan.name.toLowerCase();
          if (planName.includes("3-day") || planName.includes("3 days")) {
            // Check if the selected date allows for 3 consecutive days
            const lastDay = new Date(startDate);
            lastDay.setDate(lastDay.getDate() + 2);

            if (
              selectedLocation === "abuDhabi" &&
              lastDay > new Date("2024-08-21")
            ) {
              newErrors.startDate = "3-day plan must be completed by August 21";
            } else if (
              selectedLocation === "alAin" &&
              lastDay > new Date("2024-08-19")
            ) {
              newErrors.startDate = "3-day plan must be completed by August 19";
            }
          } else if (
            planName.includes("5-day") ||
            planName.includes("5 days")
          ) {
            // Check if the selected date allows for 5 consecutive days
            const lastDay = new Date(startDate);
            lastDay.setDate(lastDay.getDate() + 4);

            if (
              selectedLocation === "abuDhabi" &&
              lastDay > new Date("2024-08-21")
            ) {
              newErrors.startDate = "5-day plan must be completed by August 21";
            } else if (
              selectedLocation === "alAin" &&
              lastDay > new Date("2024-08-19")
            ) {
              newErrors.startDate = "5-day plan must be completed by August 19";
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        bookingData.childName
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
      };

      // Send confirmation email
      await sendConfirmationEmail(bookingData);

      // Proceed with the booking submission
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
              <h3 className="text-lg font-semibold mb-4">Child Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="childName">Full Name</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) =>
                      setFormData({ ...formData, childName: e.target.value })
                    }
                  />
                  {errors.childName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="childAge">Age</Label>
                  <Input
                    id="childAge"
                    type="number"
                    min="6"
                    max="18"
                    value={formData.childAge}
                    onChange={(e) =>
                      setFormData({ ...formData, childAge: e.target.value })
                    }
                  />
                  {errors.childAge && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childAge}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="childGender">Gender</Label>
                  <Select
                    value={formData.childGender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, childGender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.childGender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.childGender}
                    </p>
                  )}
                </div>
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
