// backend/src/controllers/auth.controller.js
// Purpose: Handles signup, login, and current-user retrieval.
// signToken is a private helper — not exported, only used internally.

const User = require('../models/user.model.js')
const jwt  = require('jsonwebtoken')
const ApiError      = require('../utils/ApiError.js')
const AsyncHandler  = require('../utils/AsyncHandler.js')

// ── Private helper ────────────────────────────────────────────────────
// Centralised token signing — signup and login both call this.
// If you ever change token shape or options, you change it in one place.
const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    // ↑ userId matches exactly what protect middleware reads: decoded.userId
    // ↑ role is embedded so adminOnly never needs a DB lookup
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// ── Helper: shape the user response ──────────────────────────────────
// Reused by signup and login — ensures password hash is never
// accidentally included in any response body.
const userResponse = (user) => ({
  _id:   user._id,
  name:  user.name,
  email: user.email,
  role:  user.role,
})

// ── POST /api/auth/signup ─────────────────────────────────────────────
const signup = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validate required fields before touching the database
  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password')
  }

  // Check for duplicate email manually — gives a clean error message
  // instead of exposing MongoDB's raw duplicate key error (code 11000)
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists')
  }

  // Create user — password is hashed by the pre-save hook in the model.
  // The controller never sees or touches the plain password after this line.
  const user = await User.create({ name, email, password })

  const token = signToken(user)

  res.status(201).json({
    success: true,
    token,
    data: userResponse(user),
  })
})

// ── POST /api/auth/login ──────────────────────────────────────────────
const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password')
  }

  // .select('+password') overrides select: false on the password field.
  // Without this, user.password would be undefined and
  // comparePassword would always return false.
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    // Deliberately vague — prevents user enumeration attacks.
    // Attacker cannot tell whether the email exists or the password was wrong.
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = signToken(user)

  res.status(200).json({
    success: true,
    token,
    data: userResponse(user),
  })
})

// ── GET /api/auth/me ──────────────────────────────────────────────────
// Protected — protect middleware runs first and sets req.user.
// No database call needed — user is already on the request object.
const getMe = AsyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  })
})

module.exports = { signup, login, getMe }