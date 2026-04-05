import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BookOpenCheck,
  Coins,
  GraduationCap,
  MapPinned,
  Users,
} from "lucide-react";
import PageShell from "../components/PageShell";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Tutors",
    description: "Carefully reviewed tutors so parents feel confident from day one.",
  },
  {
    icon: BookOpenCheck,
    title: "Online + Offline Classes",
    description: "Pick live online lessons or nearby home tuition based on your schedule.",
  },
  {
    icon: Coins,
    title: "Affordable Pricing",
    description: "Match with tutors that fit your budget and learning goals.",
  },
  {
    icon: Users,
    title: "Group & Solo Learning",
    description: "Choose focused one-to-one support or a social group learning vibe.",
  },
];

const locations = ["Jalandhar", "Phagwara", "Ludhiana", "Moga", "Amritsar"];

function LandingPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="section-shell relative grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700"
            >
              Trusted tuition support for Classes 1-10
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight text-brand-900 sm:text-5xl"
            >
              Find the Perfect Tutor Near You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-xl text-lg text-slate-600"
            >
              Online & Offline Tuition for Classes 1-10 with playful learning,
              caring tutors, and family-friendly pricing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/student-register"
                className="pill-button bg-gradient-to-r from-brand-600 to-skyplay text-white shadow-playful hover:shadow-xl"
              >
                Find Tutor
              </Link>
              <Link
                to="/tutor-register"
                className="pill-button border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50"
              >
                Become Tutor
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 }}
            className="glass-card relative p-6 sm:p-8"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-lemon/70 blur-2xl" />
            <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-peach/70 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="TuitionRider"
                  className="h-20 w-20 rounded-[28px] border border-brand-100 bg-white p-2 shadow-md"
                />
                <div>
                  <p className="text-xl font-bold text-brand-900">TuitionRider Match Hub</p>
                  <p className="text-sm text-slate-500">
                    Helping students connect with the right guide faster.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {features.slice(0, 2).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-3xl bg-white p-4 shadow-sm">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                        <Icon size={20} />
                      </div>
                      <p className="font-semibold text-slate-800">{feature.title}</p>
                      <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-3xl bg-gradient-to-r from-brand-600 to-skyplay p-5 text-white">
                <div className="flex items-center gap-3">
                  <GraduationCap className="animate-floaty" />
                  <p className="text-lg font-semibold">Better learning, happier parents</p>
                </div>
                <p className="mt-2 text-sm text-white/90">
                  Flexible tuition plans for school support, exam prep, and subject confidence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
            <BookOpenCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">
              Why families choose us
            </p>
            <h2 className="text-3xl font-bold text-brand-900">Features built for student success</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-sky-100 text-brand-700">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-shell py-6 pb-16">
        <div className="glass-card overflow-hidden p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">
                Locations we serve
              </p>
              <h2 className="mt-3 text-3xl font-bold text-brand-900">
                Growing across Punjab city by city
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {locations.map((location) => (
                <div
                  key={location}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  <MapPinned size={16} className="text-brand-600" />
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default LandingPage;
