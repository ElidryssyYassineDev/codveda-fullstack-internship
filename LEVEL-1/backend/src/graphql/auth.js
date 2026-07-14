// backend/src/graphql/auth.js
// Purpose: resolver-level authorization. GraphQL resolvers have no
// middleware chain to attach protect/adminOnly to (Phase 2, Q3) —
// these two functions are that exact same logic, called explicitly
// instead of chained. requireAdmin calls requireAuth first, mirroring
// how adminOnly only ever runs after protect already succeeded.

const { GraphQLError } = require('graphql');

function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('Not authenticated. Please log in.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
}

function requireAdmin(context) {
  const user = requireAuth(context);
  if (user.role !== 'admin') {
    throw new GraphQLError('Admin privileges required.', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  return user;
}

module.exports = { requireAuth, requireAdmin };