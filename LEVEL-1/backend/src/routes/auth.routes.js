// backend/src/routes/auth.routes.js
// Purpose: Maps HTTP methods + paths to auth controller functions.
// /me is the only protected route here — signup and login are public
// by definition (you can't require a token to get a token).

const express = require('express')
const router  = express.Router()

const { signup, login, getMe } = require('../controllers/auth.controller.js')
const { protect }               = require('../middlewares/auth.middleware.js')

router.post('/signup', signup)
router.post('/login',  login)
router.get('/me',      protect, getMe)

module.exports = router