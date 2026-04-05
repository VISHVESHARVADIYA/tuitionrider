const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { passport } = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  cookieSession({
    name: "tuitionrider-session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET || "session-secret"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "TuitionRider API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

module.exports = app;
