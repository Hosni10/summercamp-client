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
  language: "",
  // Parent Guardian Details
  parent1Name: "",
  parent1Relation: "",
  parent1Phone: "",
  parent1Email: "",
  parent2Name: "",
  parent2Phone: "",
  // Emergency Contact
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone1: "",
  emergencyPhone2: "",
  // Pick Up & Drop
  pickupList: "",
  pickupName1: "",
  pickupNumber1: "",
  pickupName2: "",
  pickupNumber2: "",
  // Medical Questionnaire
  medQ1: "",
  medQ2: "",
  medQ3: "",
  medQ4: "",
  medQ5: "",
  medQ6: "",
  medQ7: "",
  medQ8: "",
  // Medical Details
  healthInfo: "",
  medications: "",
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

export default function ParentConsentForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const guardianSigRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    console.log("ParentConsentForm mounted");
    console.log("Location state:", location.state);
    console.log("Location pathname:", location.pathname);

    if (location.state && location.state.booking) {
      console.log("Setting booking data:", location.state.booking);
      setBooking(location.state.booking);
      setLoading(false);
    } else {
      console.log("No booking data found in location state");
      setLoading(false);
      toast.error("No booking data found. Please go back and try again.");
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(initialForm).forEach(([key, val]) => {
      if (!form[key]) newErrors[key] = "Required";
    });
    if (guardianSigRef.current.isEmpty())
      newErrors.guardianSig = "Signature required";
    console.log(newErrors, "newErrors");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(booking, "submit consent form");
    if (!validate()) return;
    setSubmitting(true);

    if (!booking) {
      toast.error("Booking information is missing.");
      setSubmitting(false);
      return;
    }

    // Prepare data (including signature as base64)
    let signatureData = "";
    try {
      if (guardianSigRef.current && !guardianSigRef.current.isEmpty()) {
        signatureData = guardianSigRef.current
          .getCanvas()
          .toDataURL("image/png");
      }
    } catch (error) {
      console.error("Error getting signature:", error);
      toast.error("Error processing signature. Please try again.");
      setSubmitting(false);
      return;
    }

    const data = {
      ...form,
      guardianSignature: signatureData,
      parentBooking: booking._id,
    };

    try {
      console.log("Submitting consent form data:", data);
      console.log(
        "API URL:",
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
        }/api/consent-forms`
      );

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
        }/api/consent-forms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Consent form submitted successfully!");
        console.log("Consent form saved:", result.form);
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(`Submission failed: ${result.message}`);
        console.error("Consent form submission failed:", result);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error("Error submitting consent form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster richColors />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster richColors />
        <div className="text-center">
          <p className="text-red-600 mb-4">No booking data found.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700"
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Kids Registration, Consent & Health Declaration Form
      </h1>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language *
              </label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., English, Arabic"
              />
              {errors.language && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.language}
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
                name="parent1Name"
                value={form.parent1Name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
              {errors.parent1Name && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent1Name}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <input
                name="parent1Relation"
                value={form.parent1Relation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Father, Mother, Guardian"
              />
              {errors.parent1Relation && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent1Relation}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                name="parent1Phone"
                value={form.parent1Phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.parent1Phone && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent1Phone}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                name="parent1Email"
                type="email"
                value={form.parent1Email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter email address"
              />
              {errors.parent1Email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent1Email}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2nd Parent Guardian Full Name *
              </label>
              <input
                name="parent2Name"
                value={form.parent2Name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
              {errors.parent2Name && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent2Name}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2nd Parent Guardian Phone Number *
              </label>
              <input
                name="parent2Phone"
                value={form.parent2Phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.parent2Phone && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.parent2Phone}
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
              name="pickupList"
              value={form.pickupList}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="List all authorized individuals"
            />
            {errors.pickupList && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.pickupList}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name 1 *
              </label>
              <input
                name="pickupName1"
                value={form.pickupName1}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter first authorized person's name"
              />
              {errors.pickupName1 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.pickupName1}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number *
              </label>
              <input
                name="pickupNumber1"
                value={form.pickupNumber1}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.pickupNumber1 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.pickupNumber1}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name 2 *
              </label>
              <input
                name="pickupName2"
                value={form.pickupName2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter second authorized person's name"
              />
              {errors.pickupName2 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.pickupName2}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number *
              </label>
              <input
                name="pickupNumber2"
                value={form.pickupNumber2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
              {errors.pickupNumber2 && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.pickupNumber2}
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
                      onChange={() => handleRadio(`medQ${i + 1}`, "Yes")}
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
                      onChange={() => handleRadio(`medQ${i + 1}`, "No")}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe any other important health-related information about
                you *
              </label>
              <textarea
                name="healthInfo"
                value={form.healthInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={3}
                placeholder="Describe any health conditions, allergies, or important medical information"
              />
              {errors.healthInfo && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.healthInfo}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                List all prescriptions and over-the-counter medications you are
                currently taking *
              </label>
              <textarea
                name="medications"
                value={form.medications}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={2}
                placeholder="List all current medications"
              />
              {errors.medications && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.medications}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any immediate health concerns that you think may
                affect your performance? Please specify *
              </label>
              <textarea
                name="healthConcerns"
                value={form.healthConcerns}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={2}
                placeholder="Describe any immediate health concerns"
              />
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
                  ref={guardianSigRef}
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
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Add this to your routes: <Route path="/parent-consent" element={<ParentConsentForm />} />
// And install react-signature-canvas: npm install react-signature-canvas
// Add .input { @apply border rounded px-2 py-1 w-full; } to your CSS for input styling.
