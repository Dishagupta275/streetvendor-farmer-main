import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { saveProduct, generateId } from '../../utils/storage';
import { User, Product } from '../../types';
import { productImages, productCategories } from '../../data/products';

interface AddProductProps {
  user: User;
}

const AddProduct: React.FC<AddProductProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    category: 'vegetables' as 'vegetables' | 'fruits' | 'pulses',
    name: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset name when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        name: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const product: Product = {
        id: generateId(),
        sellerId: user.id,
        sellerName: user.name,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        image: productImages[formData.name as keyof typeof productImages] || productImages.tomato,
        description: formData.description,
        reviews: [],
        averageRating: 0
      };

      saveProduct(product);
      
      // Reset form
      setFormData({
        category: 'vegetables',
        name: '',
        price: '',
        quantity: '',
        description: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableProducts = productCategories[formData.category] || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">List your fresh produce for buyers</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="bg-green-100 p-1 rounded-full">
            <Plus className="w-4 h-4 text-green-600" />
          </div>
          <span>Product added successfully!</span>
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="pulses">Pulses</option>
              </select>
            </div>

            {/* Product Name Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <select
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a product</option>
                {availableProducts.map((product) => (
                  <option key={product} value={product} className="capitalize">
                    {product.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Preview */}
            {formData.name && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Product Preview</h4>
                <div className="flex items-center space-x-4">
                  <img
                    src={productImages[formData.name as keyof typeof productImages]}
                    alt={formData.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {formData.name.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      Category: {formData.category}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per kg (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter price per kg"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity (kg) *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter available quantity"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Describe your product quality, farming methods, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Tips for Better Sales</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Set competitive prices based on market rates</li>
          <li>• Provide accurate quantity information</li>
          <li>• Write detailed descriptions about quality and freshness</li>
          <li>• Update quantities regularly to avoid overselling</li>
          <li>• Respond quickly to buyer inquiries</li>
        </ul>
      </div>
    </div>
  );
};

export default AddProduct;