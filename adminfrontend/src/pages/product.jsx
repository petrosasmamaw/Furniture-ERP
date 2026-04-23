import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, createProduct, deleteProduct } from '../slice/productsSlice';
// framer-motion removed

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status } = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rating: 0,
  });
  const [images, setImages] = useState([]);
  const productsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('rating', formData.rating);

    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    await dispatch(createProduct(formDataToSend));

    setFormData({ title: '', description: '', price: '', rating: 0 });
    setImages([]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000"
          alt="Furniture Products"
          className="product-header-image"
        />
        <div className="product-header-content">
          <h1>
            <span className="product-title-icon" aria-hidden="true"><i className="fas fa-couch" /></span>
            Discover Our Furniture Collection
          </h1>
          <p>
            Explore our carefully curated selection of premium furniture pieces that combine elegance, comfort, and durability. Each product is handpicked to ensure the highest quality and style.
          </p>
          <p>
            From modern minimalist designs to classic timeless pieces, we offer something for every taste and space. Transform your home with our exquisite furniture collection today.
          </p>
        </div>
      </div>

      {/* Create Product Button */}
      <div className="product-action-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus-circle'}`} aria-hidden="true" style={{ marginRight: 8 }} />
          {showForm ? 'Close' : 'Create Product'}
        </button>
      </div>

      {/* Create Product Form */}
      {showForm && (
        <div className="product-form-container">
          <form onSubmit={handleSubmit} className="product-form">
            <h3>
              <span className="section-icon" aria-hidden="true"><i className="fas fa-box-open" /></span>
              Add New Product
            </h3>

            <div className="form-group">
              <label><i className="fas fa-tag" aria-hidden="true" /> Product Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="form-group">
              <label><i className="fas fa-align-left" aria-hidden="true" /> Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label><i className="fas fa-dollar-sign" aria-hidden="true" /> Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label><i className="fas fa-star" aria-hidden="true" /> Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label><i className="fas fa-images" aria-hidden="true" /> Upload Images (1-3)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <p className="form-hint">{images.length} image(s) selected</p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fas fa-check-circle" aria-hidden="true" style={{ marginRight: 8 }} />
              Create Product
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="products-section" ref={productsRef}>
        <h2>
          <span className="section-icon" aria-hidden="true"><i className="fas fa-store" /></span>
          Our Products
        </h2>
        {status === 'loading' ? (
          <p className="loading-text">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products available yet.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {/* Product Images */}
                {product.images && product.images.length > 0 && (
                  <div className="product-images-carousel">
                    {product.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${product.title}-${idx}`} />
                    ))}
                  </div>
                )}

                {/* Product Info */}
                <div className="product-info">
                  <h3>
                    <span className="product-card-title-icon" aria-hidden="true"><i className="fas fa-cube" /></span>
                    {product.title}
                  </h3>
                  <p className="product-description">{product.description}</p>

                  <div className="product-meta">
                    <span className="product-price"><i className="fas fa-coins" aria-hidden="true" /> ${parseFloat(product.price).toFixed(2)}</span>
                    <span className="product-rating"><i className="fas fa-star" aria-hidden="true" /> {product.rating}/5</span>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    <i className="fas fa-trash" aria-hidden="true" style={{ marginRight: 6 }} />
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginLeft: 8 }}
                    onClick={() => navigate('/recommendation', { state: { product } })}
                  >
                    <i className="fas fa-chart-pie" aria-hidden="true" style={{ marginRight: 6 }} />
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
