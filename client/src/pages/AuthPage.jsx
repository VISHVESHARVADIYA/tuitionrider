import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const initialState = { name: "", email: "", password: "" };

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password || (mode === "signup" && !formData.name)) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "login") {
        const data = await login({
          email: formData.email,
          password: formData.password,
        });

        toast.success(`Welcome back, ${data.user.name}!`);

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        await signup(formData);
        toast.success("Your account is ready.");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="section-shell flex min-h-[calc(100vh-180px)] items-center justify-center py-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <FormCard
            title={mode === "login" ? "Welcome back" : "Create your account"}
            subtitle="Login with email to save your tuition preferences."
          >
            <div className="mb-6 grid grid-cols-2 rounded-full bg-brand-50 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "login" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "signup" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Signup
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {mode === "signup" ? (
                <input
                  className="input-field"
                  placeholder="Full name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                />
              ) : null}

              <input
                type="email"
                className="input-field"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={onChange}
              />

              <input
                type="password"
                className="input-field"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={onChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="pill-button w-full bg-gradient-to-r from-brand-600 to-skyplay text-white disabled:opacity-70"
              >
                {loading ? <Loader label="Processing..." /> : mode === "login" ? "Login" : "Signup"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Need admin access?{" "}
              <Link className="font-semibold text-brand-700" to="/admin/login">
                Admin login
              </Link>
            </p>
          </FormCard>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default AuthPage;
