import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import SignaturePad from "react-signature-canvas";

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
  playerName: "",
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
  const playerSigRef = useRef();
  const guardianSigRef = useRef();

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
    if (playerSigRef.current.isEmpty())
      newErrors.playerSig = "Signature required";
    if (guardianSigRef.current.isEmpty())
      newErrors.guardianSig = "Signature required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Prepare data (including signatures as base64)
    const data = {
      ...form,
      playerSignature: playerSigRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png"),
      guardianSignature: guardianSigRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png"),
    };
    // TODO: send to backend
    alert("Form submitted! (Implement backend upload)");
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Kids Registration, Consent & Health Declaration Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kids Details */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Kids Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Kid Full Name *</label>
              <input
                name="kidFullName"
                value={form.kidFullName}
                onChange={handleChange}
                className="input"
              />
              {errors.kidFullName && (
                <span className="text-red-500 text-xs">
                  {errors.kidFullName}
                </span>
              )}
            </div>
            <div>
              <label>Date of Birth *</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="input"
              />
              {errors.dob && (
                <span className="text-red-500 text-xs">{errors.dob}</span>
              )}
            </div>
            <div>
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-xs">{errors.gender}</span>
              )}
            </div>
            <div>
              <label>City & Home Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input"
              />
              {errors.address && (
                <span className="text-red-500 text-xs">{errors.address}</span>
              )}
            </div>
            <div>
              <label>Preferred Language *</label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="input"
              />
              {errors.language && (
                <span className="text-red-500 text-xs">{errors.language}</span>
              )}
            </div>
          </div>
        </section>
        {/* Parent Guardian Details */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Parent Guardian Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>1st Parent Guardian Full Name *</label>
              <input
                name="parent1Name"
                value={form.parent1Name}
                onChange={handleChange}
                className="input"
              />
              {errors.parent1Name && (
                <span className="text-red-500 text-xs">
                  {errors.parent1Name}
                </span>
              )}
            </div>
            <div>
              <label>Relationship *</label>
              <input
                name="parent1Relation"
                value={form.parent1Relation}
                onChange={handleChange}
                className="input"
              />
              {errors.parent1Relation && (
                <span className="text-red-500 text-xs">
                  {errors.parent1Relation}
                </span>
              )}
            </div>
            <div>
              <label>Phone Number *</label>
              <input
                name="parent1Phone"
                value={form.parent1Phone}
                onChange={handleChange}
                className="input"
              />
              {errors.parent1Phone && (
                <span className="text-red-500 text-xs">
                  {errors.parent1Phone}
                </span>
              )}
            </div>
            <div>
              <label>Email Address *</label>
              <input
                name="parent1Email"
                type="email"
                value={form.parent1Email}
                onChange={handleChange}
                className="input"
              />
              {errors.parent1Email && (
                <span className="text-red-500 text-xs">
                  {errors.parent1Email}
                </span>
              )}
            </div>
            <div>
              <label>2nd Parent Guardian Full Name *</label>
              <input
                name="parent2Name"
                value={form.parent2Name}
                onChange={handleChange}
                className="input"
              />
              {errors.parent2Name && (
                <span className="text-red-500 text-xs">
                  {errors.parent2Name}
                </span>
              )}
            </div>
            <div>
              <label>2nd Parent Guardian Phone Number *</label>
              <input
                name="parent2Phone"
                value={form.parent2Phone}
                onChange={handleChange}
                className="input"
              />
              {errors.parent2Phone && (
                <span className="text-red-500 text-xs">
                  {errors.parent2Phone}
                </span>
              )}
            </div>
          </div>
        </section>
        {/* Emergency Contact */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Emergency Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Name of Emergency Contact *</label>
              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                className="input"
              />
              {errors.emergencyName && (
                <span className="text-red-500 text-xs">
                  {errors.emergencyName}
                </span>
              )}
            </div>
            <div>
              <label>Relationship *</label>
              <input
                name="emergencyRelation"
                value={form.emergencyRelation}
                onChange={handleChange}
                className="input"
              />
              {errors.emergencyRelation && (
                <span className="text-red-500 text-xs">
                  {errors.emergencyRelation}
                </span>
              )}
            </div>
            <div>
              <label>Phone Number 1 *</label>
              <input
                name="emergencyPhone1"
                value={form.emergencyPhone1}
                onChange={handleChange}
                className="input"
              />
              {errors.emergencyPhone1 && (
                <span className="text-red-500 text-xs">
                  {errors.emergencyPhone1}
                </span>
              )}
            </div>
            <div>
              <label>Alternative Phone Number 2 *</label>
              <input
                name="emergencyPhone2"
                value={form.emergencyPhone2}
                onChange={handleChange}
                className="input"
              />
              {errors.emergencyPhone2 && (
                <span className="text-red-500 text-xs">
                  {errors.emergencyPhone2}
                </span>
              )}
            </div>
          </div>
        </section>
        {/* Pick Up & Drop Authorization */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Pick Up & Drop Authorization
          </h2>
          <div className="mb-2">
            <label>
              List of individuals authorized to pick up your child *
            </label>
            <input
              name="pickupList"
              value={form.pickupList}
              onChange={handleChange}
              className="input"
            />
            {errors.pickupList && (
              <span className="text-red-500 text-xs">{errors.pickupList}</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Name 1 *</label>
              <input
                name="pickupName1"
                value={form.pickupName1}
                onChange={handleChange}
                className="input"
              />
              {errors.pickupName1 && (
                <span className="text-red-500 text-xs">
                  {errors.pickupName1}
                </span>
              )}
            </div>
            <div>
              <label>Number *</label>
              <input
                name="pickupNumber1"
                value={form.pickupNumber1}
                onChange={handleChange}
                className="input"
              />
              {errors.pickupNumber1 && (
                <span className="text-red-500 text-xs">
                  {errors.pickupNumber1}
                </span>
              )}
            </div>
            <div>
              <label>Name 2 *</label>
              <input
                name="pickupName2"
                value={form.pickupName2}
                onChange={handleChange}
                className="input"
              />
              {errors.pickupName2 && (
                <span className="text-red-500 text-xs">
                  {errors.pickupName2}
                </span>
              )}
            </div>
            <div>
              <label>Number *</label>
              <input
                name="pickupNumber2"
                value={form.pickupNumber2}
                onChange={handleChange}
                className="input"
              />
              {errors.pickupNumber2 && (
                <span className="text-red-500 text-xs">
                  {errors.pickupNumber2}
                </span>
              )}
            </div>
          </div>
        </section>
        {/* Authorizations & Consent */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Authorizations & Consent
          </h2>
          <div className="mb-2">
            <label>Medical Release *</label>
            <div className="text-gray-700 text-sm mb-2">
              I authorise the camp staff to seek Medical treatment for my child
              in case of an emergency.
            </div>
          </div>
          <div className="mb-2">
            <label>Photo Release *</label>
            <div className="text-gray-700 text-sm mb-2">
              I grant permission for my child's photograph to be used in camp
              promotional materials or social media coverage of the event.
            </div>
          </div>
          <div className="mb-2">
            <label>Activity Consent *</label>
            <div className="text-gray-700 text-sm mb-2">
              I give permission for my child to participate in all camp
              activities.
            </div>
          </div>
        </section>
        {/* Medical Questionnaire */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Physical Activity Readiness Questionnaire
          </h2>
          <div className="space-y-2">
            {medQuestions.map((q, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center gap-2"
              >
                <label className="flex-1">
                  {i + 1}. {q}
                </label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name={`medQ${i + 1}`}
                      value="Yes"
                      checked={form[`medQ${i + 1}`] === "Yes"}
                      onChange={() => handleRadio(`medQ${i + 1}`, "Yes")}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`medQ${i + 1}`}
                      value="No"
                      checked={form[`medQ${i + 1}`] === "No"}
                      onChange={() => handleRadio(`medQ${i + 1}`, "No")}
                    />{" "}
                    No
                  </label>
                </div>
                {errors[`medQ${i + 1}`] && (
                  <span className="text-red-500 text-xs">
                    {errors[`medQ${i + 1}`]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* Medical Details */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Medical Details</h2>
          <div className="mb-2">
            <label>
              Describe any other important health-related information about you
              *
            </label>
            <textarea
              name="healthInfo"
              value={form.healthInfo}
              onChange={handleChange}
              className="input"
              rows={3}
            />
            {errors.healthInfo && (
              <span className="text-red-500 text-xs">{errors.healthInfo}</span>
            )}
          </div>
          <div className="mb-2">
            <label>
              List all prescriptions and over-the-counter medications you are
              currently taking *
            </label>
            <textarea
              name="medications"
              value={form.medications}
              onChange={handleChange}
              className="input"
              rows={2}
            />
            {errors.medications && (
              <span className="text-red-500 text-xs">{errors.medications}</span>
            )}
          </div>
          <div className="mb-2">
            <label>
              Do you have any immediate health concerns that you think may
              affect your performance? Please specify *
            </label>
            <textarea
              name="healthConcerns"
              value={form.healthConcerns}
              onChange={handleChange}
              className="input"
              rows={2}
            />
            {errors.healthConcerns && (
              <span className="text-red-500 text-xs">
                {errors.healthConcerns}
              </span>
            )}
          </div>
        </section>
        {/* Declaration & Signatures */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Declaration and Data Subject Consent
          </h2>
          <div className="mb-2 text-gray-700 text-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Name and Signature of Player *</label>
              <input
                name="playerName"
                value={form.playerName}
                onChange={handleChange}
                className="input mb-2"
              />
              <SignaturePad
                ref={playerSigRef}
                penColor="#ed3227"
                canvasProps={{
                  width: 300,
                  height: 80,
                  className: "border rounded",
                }}
              />
              {errors.playerSig && (
                <span className="text-red-500 text-xs">{errors.playerSig}</span>
              )}
            </div>
            <div>
              <label>Name and Signature of Guardian *</label>
              <input
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                className="input mb-2"
              />
              <SignaturePad
                ref={guardianSigRef}
                penColor="#ed3227"
                canvasProps={{
                  width: 300,
                  height: 80,
                  className: "border rounded",
                }}
              />
              {errors.guardianSig && (
                <span className="text-red-500 text-xs">
                  {errors.guardianSig}
                </span>
              )}
            </div>
          </div>
        </section>
        <div className="text-center mt-6">
          <Button
            type="submit"
            className="bg-[#ed3227] text-white px-8 py-3 text-lg"
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
