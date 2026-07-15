const { GraphQLError } = require('graphql');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { requireAdmin } = require('./auth');
const { signToken } = require('../controllers/auth.controller');


function handleMongooseError(err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    throw new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });
  }
  throw err;
  // Anything else (a real server-side failure) rethrows as-is —
  // this only reshapes the ONE error type that's actually the
  // client's fault, same instinct as ApiError vs. an uncaught 500.
}
const resolvers = {
  Query: {
    products: async () => await Product.find(),
    product: async (parent, args) => await Product.findById(args.id),
  },

  Mutation: {
    createProduct: async (parent, args, context) => {
      const user = requireAdmin(context);
      try {
        const product = await Product.create({...args, createdBy: user._id});
        context.io.emit('productCreated', product);
        return product;
      } catch (error) {
        handleMongooseError(error);
      }
    },

    updateProduct: async (parent, args, context) => {
      requireAdmin(context);
      const { id, ...updates } = args;

      try {
        const product = await Product.findByIdAndUpdate(id, updates, {
          new: true,
          runValidators: true,
        });
  
        if (!product) {
          throw new GraphQLError('Product not found', { extensions: { code: 'NOT_FOUND' } });
        }
        context.io.emit('productUpdated', product);
        return product;
        
      } catch (error) {
        handleMongooseError(error);
      }
    },

    deleteProduct: async (parent, args, context) => {
      requireAdmin(context);
      const product = await Product.findByIdAndDelete(args.id);

      if (!product) {
        throw new GraphQLError('Product not found', { extensions: { code: 'NOT_FOUND' } });
      }
      context.io.emit('productDeleted', product._id);
      return product;
    },

    signup: async (parent, args) => {
      const { name, email, password } = args;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('An account with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let user;
      try {
        user = await User.create({ name, email, password });
      } catch (err) {
        // Same race-condition safety net as REST's signup (Task 2, Phase 6) —
        // catches a duplicate email slipping past the check above.
        if (err.code === 11000) {
          throw new GraphQLError('An account with this email already exists', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        handleMongooseError(err);
      }

      const token = signToken(user);
      return { token, user };
      // Raw Mongoose document, not a hand-shaped object — the User type
      // only declares id/name/email/role, so password is never serialized
      // regardless of it sitting on this document in memory. Same
      // "undeclared field is unreachable" guarantee from Phase 3, now
      // actually exercised. user.id resolves via Mongoose's built-in
      // virtual, same as Product.id already does.
    },

    login: async (parent, args) => {
      const { email, password } = args;

      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const token = signToken(user);
      return { token, user };
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