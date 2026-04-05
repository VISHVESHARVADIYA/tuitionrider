import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormCard from "../components/FormCard";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

function AdminLoginPage() {
  const [email, setEmail] = useState("admin@tuitionrider.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await login({ email, password });
      toast.success("Admin access granted.");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="section-shell flex min-h-[calc(100vh-180px)] items-center justify-center py-10">
        <FormCard
          title="Admin Login"
          subtitle="Use the hardcoded admin credentials to review tutor and student requests."
        >
          <form className="space-y-4" onSubmit={onSubmit}>
            <input
              type="email"
              className="input-field"
              placeholder="Admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="pill-button w-full bg-brand-700 text-white disabled:opacity-70"
            >
              {loading ? <Loader label="Logging in..." /> : "Enter Dashboard"}
            </button>
          </form>
        </FormCard>
      </section>
    </PageShell>
  );
}

export default AdminLoginPage;
