import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FormCard from "../components/FormCard";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { api } from "../config/api";

const initialState = {
  name: "",
  qualification: "",
  subjects: "",
  email: "",
  phone: "",
  fees: "",
};

function TutorRegistrationPage() {
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
      await api.post("/tutor/register", {
        ...formData,
        subjects: formData.subjects
          .split(",")
          .map((subject) => subject.trim())
          .filter(Boolean),
        fees: Number(formData.fees),
      });
      toast.success("Your tutor profile request has been submitted.");
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
            title="Tutor Registration"
            subtitle="Join TuitionRider and connect with students looking for your expertise."
          >
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
              <input
                className="input-field sm:col-span-2"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Tutor name"
              />
              <input
                className="input-field"
                name="qualification"
                value={formData.qualification}
                onChange={onChange}
                placeholder="Qualification"
              />
              <input
                className="input-field"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder="Phone number"
              />
              <input
                className="input-field sm:col-span-2"
                name="subjects"
                value={formData.subjects}
                onChange={onChange}
                placeholder="Subjects (comma separated)"
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
                type="number"
                className="input-field"
                name="fees"
                value={formData.fees}
                onChange={onChange}
                placeholder="Expected fees per hour (INR)"
              />

              <button
                type="submit"
                disabled={loading}
                className="pill-button sm:col-span-2 w-full bg-gradient-to-r from-brand-600 to-skyplay text-white disabled:opacity-70"
              >
                {loading ? <Loader label="Submitting request..." /> : "Submit Tutor Form"}
              </button>
            </form>
          </FormCard>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default TutorRegistrationPage;
