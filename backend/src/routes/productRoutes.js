import express from 'express';
import upload from '../middleware/uploadImage.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/ProductController.js';

const router = express.Router();

// Create product with 1-3 image uploads
router.post('/', upload.array('images', 3), createProduct);

// Get all products
router.get('/', getAllProducts);

// Get single product
router.get('/:id', getProductById);

// Update product with new images (replaces old ones)
router.put('/:id', upload.array('images', 3), updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;
