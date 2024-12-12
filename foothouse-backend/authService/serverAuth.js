const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


dotenv.config();


require('./passport'); // Google OAuth Strategy

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));
// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Google OAuth Routes
app.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("[Auth] Token generated:", token);

    // Redirect to the frontend with token
    res.redirect(`http://103.147.92.133:5173/inventory?token=${token}`);
  }
);

// Health Check Route
app.get('/health', (req, res) => res.json({ status: 'Auth Service is running' }));

// Start the Auth Service
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
