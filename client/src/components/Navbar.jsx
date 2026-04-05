import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Find Tutor", to: "/student-register" },
  { label: "Become Tutor", to: "/tutor-register" },
  { label: "Login", to: "/auth" },
  { label: "Admin", to: "/admin/login" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/65 backdrop-blur-xl">
      <nav className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            whileHover={{ rotate: -6, scale: 1.04 }}
            src="/logo.png"
            alt="TuitionRider logo"
            className="h-12 w-12 rounded-2xl border border-brand-100 bg-white p-1 shadow-md"
          />
          <div>
            <p className="text-lg font-bold text-brand-800">TuitionRider</p>
            <p className="text-xs text-slate-500">Learn your way, nearby or online</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="rounded-full border border-brand-100 bg-white p-3 text-brand-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open ? (
        <div className="section-shell flex flex-col gap-2 pb-4 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
