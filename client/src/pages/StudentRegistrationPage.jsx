import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FormCard from "../components/FormCard";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { api } from "../config/api";

const initialState = {
  name: "",
  studentClass: "",
  parentContact: "",
  email: "",
  budget: "",
  subjects: "",
  timeSlot: "",
};

function StudentRegistrationPage() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const onChange = (event) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const onSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      toast.error("Please complete every field before submitting.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/student/register", {
        name: formData.name,
        class: formData.studentClass,
        parentContact: formData.parentContact,
        email: formData.email,
        budget: Number(formData.budget),
        timeSlot: formData.timeSlot,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s),
      });
      toast.success("Your tutor request has been submitted.");
      setFormData(initialState);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="section-shell flex min-h-[calc(100vh-180px)] items-center justify-center py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <FormCard
            title="Student Registration"
            subtitle="Share your learning needs and we’ll help you find a matching tutor."
          >
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
              <input
                className="input-field sm:col-span-2"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Student name"
              />
              <select
                className="input-field"
                name="studentClass"
                value={formData.studentClass}
                onChange={onChange}
              >
                <option value="">Select class</option>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => (
                  <option key={level} value={level}>
                    Class {level}
                  </option>
                ))}
              </select>
              <input
                className="input-field"
                name="parentContact"
                value={formData.parentContact}
                onChange={onChange}
                placeholder="Parent contact number"
              />
              <input
                type="email"
                className="input-field"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email address"
              />
              <input
                className="input-field"
                name="subjects"
                value={formData.subjects}
                onChange={onChange}
                placeholder="Subjects (comma separated, e.g., Mathematics, Physics)"
              />
              <input
                className="input-field"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={onChange}
                placeholder="Time slot (e.g. 10:00 AM - 12:00 PM)"
              />
              <input
                type="number"
                className="input-field"
                name="budget"
                value={formData.budget}
                onChange={onChange}
                placeholder="Budget per hour (INR)"
              />

              <button
                type="submit"
                disabled={loading}
                className="pill-button sm:col-span-2 w-full bg-gradient-to-r from-brand-600 to-skyplay text-white disabled:opacity-70"
              >
                {loading ? <Loader label="Submitting request..." /> : "Submit Request"}
              </button>
            </form>
          </FormCard>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default StudentRegistrationPage;
