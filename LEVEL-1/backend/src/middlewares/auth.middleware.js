// backend/src/middlewares/auth.middleware.js
// Purpose: Two middleware functions that protect Express routes.
// protect   → verifies JWT, attaches user to req.user
// adminOnly → checks req.user.role, blocks non-admins with 403

const jwt =require('jsonwebtoken') 
const User =require('../models/user.model.js') 
const ApiError =require('../utils/ApiError.js') 
const AsyncHandler =require('../utils/AsyncHandler.js') 
// ↑ These assume default exports — confirm before using

// ── protect ──────────────────────────────────────────────────────────
// Runs on every protected route.
// Extracts the JWT from the Authorization header, verifies it,
// finds the matching user in MongoDB, and attaches them to req.user.
const protect = AsyncHandler(async (req, res, next) => {

  // Step 1 — Extract token from header
  // Expected format: "Authorization: Bearer eyJhbGci..."
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
    // split(' ') gives ["Bearer", "eyJhbGci..."]
    // index [1] gives just the token string
  }

  // Step 2 — Reject if no token present
  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.')
  }

  // Step 3 — Verify token signature and expiry
  // jwt.verify throws JsonWebTokenError if tampered with
  // jwt.verify throws TokenExpiredError if past the exp claim
  // We catch both and convert to readable ApiError messages
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { userId: "...", role: "admin", iat: ..., exp: ... }
    // The shape matches exactly what we'll put in jwt.sign() in Milestone 3
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Your session has expired. Please log in again.')
    }
    throw new ApiError(401, 'Invalid token. Please log in again.')
  }

  // Step 4 — Confirm the user still exists in the database
  // The token could be valid but the user account deleted since it was issued
  const currentUser = await User.findById(decoded.userId)
  if (!currentUser) {
    throw new ApiError(401, 'The user belonging to this token no longer exists.')
  }

  // Step 5 — Attach user to request and pass control downstream
  req.user = currentUser
  // req.user is now available in every subsequent middleware and controller
  // on this request — no extra database lookups needed
  next()
})

// ── adminOnly ─────────────────────────────────────────────────────────
// Runs AFTER protect on admin-only routes.
// protect already verified the token and set req.user.
// adminOnly simply checks whether that user has the admin role.
// Not async — no database calls needed, role is already on req.user.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  // next(error) — correct pattern for synchronous middleware errors.
  // Throwing in a sync function not wrapped in AsyncHandler
  // would crash Express without reaching the error handler.
  next(new ApiError(403, 'Access denied. Admin privileges required.'))
}

module.exports = {protect, adminOnly}