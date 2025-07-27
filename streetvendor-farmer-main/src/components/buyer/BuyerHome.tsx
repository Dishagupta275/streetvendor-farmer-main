import React, { useState, useEffect } from 'react';
import { Star, Filter, MapPin, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { getProducts, getCart, saveCart } from '../../utils/storage';
import { User, Product, CartItem } from '../../types';
import { mandalsList } from '../../data/products';

interface BuyerHomeProps {
  user: User;
  onPageChange: (page: string) => void;
}

const BuyerHome: React.FC<BuyerHomeProps> = ({ user, onPageChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    mandal: 'all'
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    setCart(getCart());
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

    // Filter by mandal (location)
    if (filters.mandal !== 'all') {
      // In a real app, you'd filter by seller's mandal
      // For now, we'll show all products
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
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
  };

  const bestOffers = products.slice(0, 6);
  const categories = [
    { id: 'vegetables', name: 'Vegetables', icon: '🥬', count: products.filter(p => p.category === 'vegetables').length },
    { id: 'fruits', name: 'Fruits', icon: '🍎', count: products.filter(p => p.category === 'fruits').length },
    { id: 'pulses', name: 'Pulses', icon: '🌾', count: products.filter(p => p.category === 'pulses').length }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
            <p className="text-green-100 text-lg">Discover fresh produce from local farmers</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onPageChange('products')}
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Browse Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Products</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items in Cart</p>
              <p className="text-3xl font-bold text-gray-900">{cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sellers</p>
              <p className="text-3xl font-bold text-gray-900">{new Set(products.map(p => p.sellerId)).size}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  handleFilterChange('category', category.id);
                  onPageChange('products');
                }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} products available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
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
              </div>
              
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
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.slice(0, 9).map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">{product.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full capitalize">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
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
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>By {product.sellerName}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts.length > 9 && (
            <div className="text-center mt-8">
              <button
                onClick={() => onPageChange('products')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;