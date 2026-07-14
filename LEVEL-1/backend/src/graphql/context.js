// backend/src/graphql/context.js
// Purpose: builds the context object ONCE per incoming GraphQL request.
// Same JWT verification protect already does — just relocated to run
// here instead of as Express middleware, and once per request rather
// than once per resolver (Phase 2, Section C / Q5).

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function context({ req }) {
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId);
    } catch (err) {
      // Invalid or expired token — user stays null. Not thrown here:
      // whether a token is even required depends on which resolver
      // ends up running (products() needs none, createProduct() does)
      // — that decision belongs inside the resolver, not this shared step.
    }
  }

  return { user };
}

module.exports = context;