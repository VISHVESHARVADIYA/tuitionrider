const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id || "admin-user",
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const adminEmail = process.env.ADMIN_EMAIL || "admin@tuitionrider.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({ name, email, password, role: "student" });
  const token = createToken(user);

  return res.status(201).json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    const adminUser = {
      name: "TuitionRider Admin",
      email,
      role: "admin",
    };

    return res.json({
      token: createToken(adminUser),
      user: adminUser,
    });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    token: createToken(user),
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const googleCallback = (req, res) => {
  const token = createToken(req.user);
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const redirectUrl = `${clientUrl}/auth?token=${encodeURIComponent(token)}&name=${encodeURIComponent(
    req.user.name
  )}&email=${encodeURIComponent(req.user.email)}`;

  return res.redirect(redirectUrl);
};

module.exports = { signup, login, googleCallback };
