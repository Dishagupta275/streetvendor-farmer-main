import React, { useState, useEffect } from 'react';
import { Star, Filter, MapPin, ShoppingCart, Plus, Minus, Eye } from 'lucide-react';
import { getProducts, getCart, saveCart } from '../../utils/storage';
import { User, Product, CartItem } from '../../types';
import { mandalsList } from '../../data/products';

interface ProductsProps {
  user: User;
}

const Products: React.FC<ProductsProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    mandal: 'all',
    sortBy: 'name'
  });

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    setCart(getCart());
    
    // Initialize quantities
    const initialQuantities: { [key: string]: number } = {};
    allProducts.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        } else {
          return p.price >= min;
        }
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(10, prev[productId] + change))
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const existingItem = cart.find(item => item.productId === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        quantity,
        product
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    
    // Reset quantity to 1 after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600 mt-1">Browse fresh produce from local farmers</p>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="pulses">Pulses</option>
          </select>
          
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Prices</option>
            <option value="0-50">₹0 - ₹50</option>
            <option value="50-100">₹50 - ₹100</option>
            <option value="100-200">₹100 - ₹200</option>
            <option value="200">₹200+</option>
          </select>
          
          <select
            value={filters.mandal}
            onChange={(e) => handleFilterChange('mandal', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            {mandalsList.map((mandal) => (
              <option key={mandal} value={mandal}>{mandal}</option>
            ))}
          </select>
          
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => viewProductDetails(product)}
                  className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
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
                
                <div className="flex items-center space-x-2 mb-3">
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
                    {product.averageRating.toFixed(1)} ({product.reviews.length})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>By {product.sellerName}</span>
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                )}
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity (kg):</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantities[product.id] || 1}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full capitalize">
                      {selectedProduct.category}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-3xl font-bold text-green-600">₹{selectedProduct.price}/kg</span>
                    <p className="text-gray-500">{selectedProduct.quantity}kg available</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedProduct.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {selectedProduct.averageRating.toFixed(1)} ({selectedProduct.reviews.length} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Sold by {selectedProduct.sellerName}</span>
                  </div>
                  
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reviews */}
              {selectedProduct.reviews.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Customer Reviews</h4>
                  <div className="space-y-4">
                    {selectedProduct.reviews.slice(0, 3).map((review) => (
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
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setShowDetails(false);
                }}
                disabled={selectedProduct.quantity === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{selectedProduct.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;