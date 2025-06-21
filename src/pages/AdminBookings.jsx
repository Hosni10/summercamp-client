import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Download, Users, Calendar, MapPin } from "lucide-react";
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/bookings");
      if (response.status !== 200) {
        throw new Error("Failed to fetch bookings");
      }
      const data = response.data;
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Convert bookings to CSV format
    const headers = [
      "Booking ID",
      "First Name",
      "Last Name",
      "Parent Email",
      "Parent Phone",
      "Parent Address",
      "Number of Children",
      "Children Names",
      "Children Ages",
      "Children Genders",
      "Start Date",
      "Membership Plan",
      "Location",
      "Total Amount Paid",
      "Booking Date",
    ];

    const csvData = bookings.map((booking) => [
      booking._id,
      booking.firstName,
      booking.lastName,
      booking.parentEmail,
      booking.parentPhone,
      booking.parentAddress,
      booking.numberOfChildren,
      booking.children.map((child) => child.name).join(", "),
      booking.children.map((child) => child.age).join(", "),
      booking.children.map((child) => child.gender).join(", "),
      booking.startDate,
      booking.membershipPlan,
      booking.location,
      booking.totalAmountPaid,
      new Date(booking.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bookings_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed3227] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchBookings}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bookings Management
              </h1>
              <p className="text-gray-600 mt-2">
                View and export all summer camp bookings
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={fetchBookings} variant="outline">
                Refresh
              </Button>
              <Button
                onClick={exportToExcel}
                className="bg-[#ed3227] hover:bg-[#ed3227]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#ed3227] mr-3" />
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#ed3227] mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.reduce(
                      (total, booking) => total + booking.numberOfChildren,
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Total Children</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-[#ed3227] mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b) => b.location === "abuDhabi").length}
                  </p>
                  <p className="text-sm text-gray-600">Abu Dhabi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[#ed3227] mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    AED{" "}
                    {bookings
                      .reduce(
                        (total, booking) => total + booking.totalAmountPaid,
                        0
                      )
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.firstName} {booking.lastName}
                    </CardTitle>
                    <CardDescription>{booking.parentEmail}</CardDescription>
                  </div>
                  <Badge className="bg-[#ed3227] text-white">
                    AED {booking.totalAmountPaid}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {booking.parentPhone}
                  </div>
                  <div>
                    <span className="font-medium">Children:</span>{" "}
                    {booking.numberOfChildren}
                  </div>
                  <div>
                    <span className="font-medium">Plan:</span>{" "}
                    {booking.membershipPlan}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {booking.location === "abuDhabi" ? "Abu Dhabi" : "Al Ain"}
                  </div>
                  <div>
                    <span className="font-medium">Start Date:</span>{" "}
                    {booking.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Children Names:</span>{" "}
                    {booking.children.map((child) => child.name).join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Booking Date:</span>{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Booking ID:</span>{" "}
                    {booking._id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
