import React, { useState, useEffect } from 'react';
import { Package, Star, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { getProductsBySeller, deleteProduct, saveProduct } from '../../utils/storage';
import { User, Product } from '../../types';

interface MyProductsProps {
  user: User;
}

const MyProducts: React.FC<MyProductsProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [user.id]);

  const loadProducts = () => {
    setProducts(getProductsBySeller(user.id));
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      loadProducts();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    saveProduct(updatedProduct);
    setEditingProduct(null);
    loadProducts();
  };

  const handleViewReviews = (product: Product) => {
    setSelectedProduct(product);
    setShowReviews(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your product listings and reviews</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="pulses">Pulses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? "You haven't added any products yet." 
              : `No products found in ${selectedCategory} category.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 capitalize">{product.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">₹{product.price}/kg</span>
                  <span className="text-sm text-gray-500">{product.quantity}kg available</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewReviews(product)}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Reviews</span>
                  </button>
                  
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Reviews for {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowReviews(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {selectedProduct.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProduct.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.buyerName}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveEdit}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

// Edit Product Modal Component
interface EditProductModalProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    price: product.price,
    quantity: product.quantity,
    description: product.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹/kg)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Add product description..."
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProducts;