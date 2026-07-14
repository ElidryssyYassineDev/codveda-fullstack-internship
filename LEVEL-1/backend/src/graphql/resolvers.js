// backend/src/graphql/resolvers.js
// Purpose: Query resolvers only, this milestone. Same Mongoose models
// your REST controllers already use — no new database layer, just a
// new way in.

const Product = require('../models/product.model');
const User = require('../models/user.model');

const resolvers = {
  Query: {
    products: async () => {
      return await Product.find();
      // Identical call to REST's getProducts. This resolver has no
      // idea whether the client's query asked for one field or ten —
      // Apollo strips whatever wasn't requested, AFTER this returns
      // (Phase 2, Q4).
    },

    product: async (parent, args) => {
      // args carries whatever the client's query passed — here, { id }.
      return await Product.findById(args.id);
      // Returns null if not found. Nullable field resolving to null
      // is valid GraphQL — no manual 404 needed, unlike REST.
    },
  },

  Product: {
    // Explicit field resolvers — only needed where the default
    // "just read parent[fieldName]" behavior isn't correct as-is.

    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
    // Mongoose stores these as real JS Date objects. GraphQL's built-in
    // String type can only serialize actual strings, booleans, or
    // finite numbers — handing it a raw Date throws a runtime error.
    // Converting explicitly avoids that.

    // No createdBy resolver yet — that's Milestone 2. See the testing
    // notes below for exactly what that means right now.

    // No `id` resolver needed at all: Mongoose documents carry a
    // built-in virtual `id` getter (a string version of `_id`) by
    // default, so `product.id` already resolves correctly on its own.

    createdBy: async (parent) => {
      if(!parent.createdBy) return null;


      return await User.findById(parent.createdBy);
    }
  },
};

module.exports = resolvers;