// backend/src/graphql/resolvers.js

const { GraphQLError } = require('graphql');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { requireAdmin } = require('./auth');

const resolvers = {
  Query: {
    products: async () => {
      return await Product.find();
    },
    product: async (parent, args) => {
      return await Product.findById(args.id);
    },
  },

  Mutation: {
    createProduct: async (parent, args, context) => {
      const user = requireAdmin(context);
      // createdBy set from the AUTHENTICATED user, never from args —
      // and there's no createdBy field in the schema's createProduct
      // arguments at all, so there's structurally nothing for a
      // client to even attempt to fake here. Stricter than REST's
      // req.body, which can carry arbitrary extra keys the controller
      // has to deliberately filter out via destructuring.
      return await Product.create({ ...args, createdBy: user._id });
    },

    updateProduct: async (parent, args, context) => {
      requireAdmin(context);

      const { id, ...updates } = args;
      // Unlike REST's req.body, GraphQL never sends "undefined" for
      // an argument the client omitted — an omitted optional argument
      // simply isn't a key on `args` at all. So `updates` only ever
      // contains fields the client actually included — no equivalent
      // of REST's omitUndefined option needed here.

      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return product;
    },

    deleteProduct: async (parent, args, context) => {
      requireAdmin(context);

      const product = await Product.findByIdAndDelete(args.id);

      if (!product) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return product;
    },
  },

  Product: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),

    createdBy: async (parent) => {
      if (!parent.createdBy) return null;
      return await User.findById(parent.createdBy);
    },
  },
};

module.exports = resolvers;