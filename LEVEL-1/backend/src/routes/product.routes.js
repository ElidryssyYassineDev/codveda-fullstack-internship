const express = require('express');
const router = express.Router();
const { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
     } = require('../controllers/product.controller');

const validateObjectId = require('../middlewares/validateObjectId');

router.route('/').post(createProduct).get(getProducts);

router
     .route('/:id')
     .get(validateObjectId, getProductById)
     .put(validateObjectId, updateProduct)
     .patch(validateObjectId, updateProduct)
     .delete(validateObjectId, deleteProduct);

module.exports = router;