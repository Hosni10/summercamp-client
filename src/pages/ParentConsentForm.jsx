import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import SignaturePad from "react-signature-canvas";
import { Toaster, toast } from "sonner";

const initialForm = {
  // Kids Details
  kidFullName: "",
  dob: "",
  gender: "",
  address: "",
  // Parent Guardian Details (simplified to 1 parent)
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  // Emergency Contact
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone1: "",
  emergencyPhone2: "",
  // Pick Up & Drop (simplified to 1 person)
  pickupName: "",
  pickupNumber: "",
  // Medical Questionnaire (default to "No")
  medQ1: "No",
  medQ2: "No",
  medQ3: "No",
  medQ4: "No",
  medQ5: "No",
  medQ6: "No",
  medQ7: "No",
  medQ8: "No",
  // Medical Details (conditional fields)
  hasHealthInfo: "No",
  healthInfo: "",
  hasMedications: "No",
  medications: "",
  hasHealthConcerns: "No",
  healthConcerns: "",
  // Declaration
  guardianName: "",
};

const medQuestions = [
  "Do you suffer from any medical conditions the Camp Operator & ADSS should be aware of?",
  "Has your doctor ever said that you have a heart condition and that you should only do physical activity/exercise recommended by a doctor?",
  "Do you feel pain in your chest at any point in time?",
  "Do you lose your balance because of dizziness or do you ever lose consciousness?",
  "Do you have a bone or joint problem?",
  "Do you suffer from any of the following: hypertension, asthma; diabetes; epilepsy; high blood pressure, fainting episodes, breathlessness, fast heart beat, Kidney disease, autoimmune disease, liver disease? (if so, please give details)",
  "Do you have any current injuries or conditions, and if so, are they being treated by a doctor or other health professional such as a physiotherapist? (if so, please give details)",
  "Do you know of any other reason why you should not do physical activity/ exercise?",
];

const ParentConsentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signaturePadRef = useRef(null);

  // Auto-fill form with booking data if available
  useEffect(() => {
    console.log("Location state:", location.state);

    // Check for booking data in different possible locations
    const bookingData = location.state?.booking || location.state?.bookingData;

    if (bookingData) {
      console.log("Found booking data:", bookingData);
      const child = bookingData.children?.[0]; // Use first child for consent form

      console.log("Child data:", child);
      console.log("Child dateOfBirth:", child?.dateOfBirth);

      setForm((prevForm) => ({
        ...prevForm,
        // Auto-fill kid details from booking
        kidFullName: child?.name || "",
        dob: child?.dateOfBirth || "",
        gender: child?.gender || "",
        address: bookingData.parentAddress || "",
        // Auto-fill parent details from booking
        parentName: `${bookingData.firstName} ${bookingData.lastName}`,
        parentPhone: bookingData.parentPhone || "",
        parentEmail: bookingData.parentEmail || "",
        // Auto-fill guardian name
        guardianName: `${bookingData.firstName} ${bookingData.lastName}`,
      }));
    } else {
      console.log("No booking data found in location state");
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRadio = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Handle medical questionnaire changes
  const handleMedicalChange = (fieldName, value) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user makes selection
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validate = () => {
    const errors = {};

    // Kids Details
    if (!form.kidFullName.trim())
      errors.kidFullName = "Kid full name is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.address.trim()) errors.address = "Address is required";

    // Parent Guardian Details
    if (!form.parentName.trim()) errors.parentName = "Parent name is required";
    if (!form.parentPhone.trim())
      errors.parentPhone = "Parent phone is required";
    if (!form.parentEmail.trim())
      errors.parentEmail = "Parent email is required";

    // Emergency Contact
    if (!form.emergencyName.trim())
      errors.emergencyName = "Emergency contact name is required";
    if (!form.emergencyRelation.trim())
      errors.emergencyRelation = "Emergency contact relation is required";
    if (!form.emergencyPhone1.trim())
      errors.emergencyPhone1 = "Emergency phone 1 is required";
    if (!form.emergencyPhone2.trim())
      errors.emergencyPhone2 = "Emergency phone 2 is required";

    // Pick Up & Drop
    if (!form.pickupName.trim()) errors.pickupName = "Pickup name is required";
    if (!form.pickupNumber.trim())
      errors.pickupNumber = "Pickup number is required";

    // Medical Questionnaire
    for (let i = 1; i <= 8; i++) {
      if (!form[`medQ${i}`])
        errors[`medQ${i}`] = `Medical question ${i} is required`;
    }

    // Medical Details
    if (!form.hasHealthInfo)
      errors.hasHealthInfo = "Health info question is required";
    if (form.hasHealthInfo === "Yes" && !form.healthInfo.trim()) {
      errors.healthInfo = "Health information is required when Yes is selected";
    }
    if (!form.hasMedications)
      errors.hasMedications = "Medications question is required";
    if (form.hasMedications === "Yes" && !form.medications.trim()) {
      errors.medications = "Medications list is required when Yes is selected";
    }
    if (!form.hasHealthConcerns)
      errors.hasHealthConcerns = "Health concerns question is required";
    if (form.hasHealthConcerns === "Yes" && !form.healthConcerns.trim()) {
      errors.healthConcerns =
        "Health concerns details are required when Yes is selected";
    }

    // Declaration
    if (!form.guardianName.trim())
      errors.guardianName = "Guardian name is required";
    if (signaturePadRef.current?.isEmpty()) {
      errors.guardianSig = "Guardian signature is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let signatureData = "";

      // Safely get signature data
      try {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
          signatureData = signaturePadRef.current.getCanvas().toDataURL();
        }
      } catch (signatureError) {
        console.error("Error getting signature:", signatureError);
        toast.error("Error processing signature. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Get booking data from location state
      const bookingData =
        location.state?.booking || location.state?.bookingData;

      const formData = {
        parentBooking: bookingData?._id,
        // Kids Details
        kidFullName: form.kidFullName,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        // Parent Guardian Details
        parentName: form.parentName,
        parentPhone: form.parentPhone,
        parentEmail: form.parentEmail,
        // Emergency Contact
        emergencyName: form.emergencyName,
        emergencyRelation: form.emergencyRelation,
        emergencyPhone1: form.emergencyPhone1,
        emergencyPhone2: form.emergencyPhone2,
        // Pick Up & Drop
        pickupName: form.pickupName,
        pickupNumber: form.pickupNumber,
        // Medical Questionnaire
        medQ1: form.medQ1,
        medQ2: form.medQ2,
        medQ3: form.medQ3,
        medQ4: form.medQ4,
        medQ5: form.medQ5,
        medQ6: form.medQ6,
        medQ7: form.medQ7,
        medQ8: form.medQ8,
        // Medical Details
        hasHealthInfo: form.hasHealthInfo,
        healthInfo: form.hasHealthInfo === "Yes" ? form.healthInfo : "",
        hasMedications: form.hasMedications,
        medications: form.hasMedications === "Yes" ? form.medications : "",
        hasHealthConcerns: form.hasHealthConcerns,
        healthConcerns:
          form.hasHealthConcerns === "Yes" ? form.healthConcerns : "",
        // Declaration
        guardianName: form.guardianName,
        guardianSignature: signatureData,
      };

      console.log("Submitting form data:", formData);

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
        }/api/consent-forms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("📡 Response result:", result);

      if (response.ok && result.success) {
        toast.success("Consent form submitted successfully!");
        // Add delay so user can see the success toast
        setTimeout(() => {
          navigate("/");
        }, 4000); // 2 second delay
      } else {
        toast.error(result.message || "Failed to submit consent form");
      }
    } catch (error) {
      console.error("Error submitting consent form:", error);
      toast.error("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Kids Registration, Consent & Health Declaration Form
      </h1>

      {!location.state?.booking && !location.state?.bookingData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> No booking data found. Please fill in all
            fields manually or go back to complete a booking first.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Kids Details */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Kids Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kid Full Name *
              </label>
              <input
                name="kidFullName"
                value={form.kidFullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
              {errors.kidFullName && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.kidFullName}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.dob && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.dob}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select gender</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.gender}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City & Home Address *
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter address"
              />
              {errors.address && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.address}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Parent Guardian Details */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Parent Guardian Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1st Parent Guardian Full Name *
              </label>
              <input
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
              {errors.parentName && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parentName}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                name="parentPhone"
                value={form.parentPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.parentPhone && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parentPhone}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                name="parentEmail"
                type="email"
                value={form.parentEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter email address"
              />
              {errors.parentEmail && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parentEmail}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Emergency Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name of Emergency Contact *
              </label>
              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter emergency contact name"
              />
              {errors.emergencyName && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.emergencyName}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <input
                name="emergencyRelation"
                value={form.emergencyRelation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Uncle, Aunt, Family Friend"
              />
              {errors.emergencyRelation && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.emergencyRelation}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number 1 *
              </label>
              <input
                name="emergencyPhone1"
                value={form.emergencyPhone1}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter primary phone number"
              />
              {errors.emergencyPhone1 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.emergencyPhone1}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Phone Number 2 *
              </label>
              <input
                name="emergencyPhone2"
                value={form.emergencyPhone2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter alternative phone number"
              />
              {errors.emergencyPhone2 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.emergencyPhone2}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pick Up & Drop Authorization */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Pick Up & Drop Authorization
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List of individuals authorized to pick up your child *
            </label>
            <input
              name="pickupName"
              value={form.pickupName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="List all authorized individuals"
            />
            {errors.pickupName && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.pickupName}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number *
              </label>
              <input
                name="pickupNumber"
                value={form.pickupNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.pickupNumber && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.pickupNumber}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Medical Questionnaire */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Physical Activity Readiness Questionnaire
          </h2>
          <div className="space-y-4">
            {medQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {i + 1}. {q}
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`medQ${i + 1}`}
                      value="Yes"
                      checked={form[`medQ${i + 1}`] === "Yes"}
                      onChange={() =>
                        handleMedicalChange(`medQ${i + 1}`, "Yes")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`medQ${i + 1}`}
                      value="No"
                      checked={form[`medQ${i + 1}`] === "No"}
                      onChange={() => handleMedicalChange(`medQ${i + 1}`, "No")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {errors[`medQ${i + 1}`] && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors[`medQ${i + 1}`]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Medical Details */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Medical Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any other important health-related information? *
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHealthInfo"
                    value="Yes"
                    checked={form.hasHealthInfo === "Yes"}
                    onChange={() => handleMedicalChange("hasHealthInfo", "Yes")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHealthInfo"
                    value="No"
                    checked={form.hasHealthInfo === "No"}
                    onChange={() => handleMedicalChange("hasHealthInfo", "No")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
              {form.hasHealthInfo === "Yes" && (
                <textarea
                  name="healthInfo"
                  value={form.healthInfo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={3}
                  placeholder="Describe any health conditions, allergies, or important medical information"
                />
              )}
              {errors.healthInfo && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.healthInfo}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you currently taking any medications? *
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasMedications"
                    value="Yes"
                    checked={form.hasMedications === "Yes"}
                    onChange={() =>
                      handleMedicalChange("hasMedications", "Yes")
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasMedications"
                    value="No"
                    checked={form.hasMedications === "No"}
                    onChange={() => handleMedicalChange("hasMedications", "No")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
              {form.hasMedications === "Yes" && (
                <textarea
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={2}
                  placeholder="List all current medications"
                />
              )}
              {errors.medications && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.medications}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any immediate health concerns? *
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHealthConcerns"
                    value="Yes"
                    checked={form.hasHealthConcerns === "Yes"}
                    onChange={() =>
                      handleMedicalChange("hasHealthConcerns", "Yes")
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasHealthConcerns"
                    value="No"
                    checked={form.hasHealthConcerns === "No"}
                    onChange={() =>
                      handleMedicalChange("hasHealthConcerns", "No")
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
              {form.hasHealthConcerns === "Yes" && (
                <textarea
                  name="healthConcerns"
                  value={form.healthConcerns}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={2}
                  placeholder="Describe any immediate health concerns"
                />
              )}
              {errors.healthConcerns && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.healthConcerns}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Authorizations & Consent - MOVED ABOVE DECLARATION */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="font-bold text-xl mb-4 text-blue-800 border-b border-blue-300 pb-2">
            Authorizations & Consent
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Medical Release *
              </h3>
              <div className="text-gray-700 text-sm mb-3">
                I authorise the camp staff to seek Medical treatment for my
                child in case of an emergency.
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Photo Release *
              </h3>
              <div className="text-gray-700 text-sm mb-3">
                I grant permission for my child's photograph to be used in camp
                promotional materials or social media coverage of the event.
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Activity Consent *
              </h3>
              <div className="text-gray-700 text-sm mb-3">
                I give permission for my child to participate in all camp
                activities.
              </div>
            </div>
          </div>
        </section>

        {/* Declaration & Signatures */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-300 pb-2">
            Declaration and Data Subject Consent
          </h2>
          <div className="mb-6 text-gray-700 text-sm bg-white p-4 rounded-lg border border-gray-200">
            <strong>
              I declare that I have read, understood, and answered honestly all
              the questions above.
            </strong>{" "}
            I have fully disclosed all medical conditions & information as a
            player at the camp.{" "}
            <strong>
              I am agreeing to participate in the exercise sessions (which may
              include aerobic, resistance, power and stretching exercises) and
              understand that there may be risks associated with physical
              activity.
            </strong>
            <br />I also understand that ADSS & Atomics Academy will not be
            liable to any untoward incident that may arise due to exercise.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name and Signature of Guardian *
              </label>
              <input
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-3"
                placeholder="Enter guardian's full name"
              />
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                <SignaturePad
                  ref={signaturePadRef}
                  penColor="#ed3227"
                  canvasProps={{
                    width: 300,
                    height: 80,
                    className: "border rounded w-full",
                  }}
                />
              </div>
              {errors.guardianSig && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.guardianSig}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="text-center mt-8">
          <Button
            type="submit"
            className="bg-[#ed3227] hover:bg-[#d42a1f] text-white px-8 py-3 text-lg rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ParentConsentForm;

// Add this to your routes: <Route path="/parent-consent" element={<ParentConsentForm />} />
// And install react-signature-canvas: npm install react-signature-canvas
// Add .input { @apply border rounded px-2 py-1 w-full; } to your CSS for input styling.
