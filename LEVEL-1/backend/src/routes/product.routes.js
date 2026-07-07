const express = require('express');
const router  = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const validateObjectId         = require('../middlewares/validateObjectId');
const { protect, adminOnly }   = require('../middlewares/auth.middleware');

// ── Public routes ─────────────────────────────────────────────────────
// No token required — anyone can read products
router.get('/',    getProducts);
router.get('/:id', validateObjectId, getProductById);

// ── Protected + admin-only routes ─────────────────────────────────────
// Token required AND role must be admin
router.post('/',    protect, adminOnly, createProduct);
router.put('/:id',  validateObjectId, protect, adminOnly, updateProduct);
router.patch('/:id',validateObjectId, protect, adminOnly, updateProduct);
router.delete('/:id',validateObjectId, protect, adminOnly, deleteProduct);

module.exports = router;