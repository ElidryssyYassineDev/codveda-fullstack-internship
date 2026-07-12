const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/AsyncHandler');

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, inStock } = req.body;

  if (!name || price === undefined) {
    throw new ApiError(400, 'Name and price are required fields');
  }

  const product = await Product.create({ 
    name, 
    price, 
    description, 
    inStock,
    createdBy: req.user._id,
   });

   const io = req.app.get('io');
   io.emit('productCreated', product);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('createdBy', 'name email role');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('createdBy', 'name email role');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT/PATCH /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, inStock } = req.body;


  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }
  const wasInStock = existingProduct.inStock;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, description, inStock },
    { new: true, runValidators: true, omitUndefined: true }
  );

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const io = req.app.get('io');
  io.emit('productUpdated', product);
  // Only fires on a genuine true → false transition. omitUndefined
  // means a request that doesn't include inStock at all (a partial
  // PATCH, say) leaves the field untouched — so product.inStock would
  // just equal wasInStock, and this condition correctly never fires
  // for updates that never touched stock status.
  if (wasInStock && product.inStock === false) {
    io.to('admins').emit('lowStockAlert', {
      productId: product._id,
      name: product.name,
    });
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const io = req.app.get('io');
  io.emit('productDeleted', product._id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: product,
  });
});