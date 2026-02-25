import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, rating } = req.body;
    const files = req.files || [];

    if (!title || !description || !price) {
      return res.status(400).json({ message: 'Title, description, and price are required' });
    }

    const images = files.map((file) => file.path); // Cloudinary URLs

    const product = new Product({
      title,
      description,
      price,
      rating: rating || 0,
      images,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, rating } = req.body;
    const files = req.files || [];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (rating !== undefined) product.rating = rating;

    // Add new images (keep existing ones if no new files)
    if (files.length > 0) {
      product.images = files.map((file) => file.path);
    }

    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
