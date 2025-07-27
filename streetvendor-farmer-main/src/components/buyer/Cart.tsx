import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, CreditCard } from 'lucide-react';
import { getCart, saveCart, clearCart, saveOrder, generateId, getCurrentUser } from '../../utils/storage';
import { CartItem, Order } from '../../types';

interface CartProps {
  user: any;
}

const Cart: React.FC<CartProps> = ({ user }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.min(newQuantity, item.product.quantity) }
        : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    if (!user.profile?.address?.village || !user.profile?.address?.pincode) {
      alert('Please complete your profile with address details before placing an order.');
      return;
    }

    setLoading(true);

    try {
      // Group items by seller
      const ordersBySeller: { [sellerId: string]: CartItem[] } = {};
      
      cart.forEach(item => {
        const sellerId = item.product.sellerId;
        if (!ordersBySeller[sellerId]) {
          ordersBySeller[sellerId] = [];
        }
        ordersBySeller[sellerId].push(item);
      });

      // Create separate orders for each seller
      Object.entries(ordersBySeller).forEach(([sellerId, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        const order: Order = {
          id: generateId(),
          buyerId: user.id,
          buyerName: user.name,
          sellerId: sellerId,
          items: items,
          totalAmount: totalAmount,
          status: 'pending',
          orderDate: new Date().toLocaleDateString(),
          buyerAddress: user.profile?.address || {
            village: '',
            pincode: '',
            mandal: '',
            district: '',
            state: 'Telangana'
          }
        };

        saveOrder(order);
      });

      // Clear cart
      clearCart();
      setCart([]);
      
      alert(`Order placed successfully! ${Object.keys(ordersBySeller).length} order(s) sent to seller(s).`);
      
    } catch (error) {
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">Your cart is currently empty</p>
        </div>
        
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">{getTotalItems()} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">{item.product.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>By {item.product.sellerName}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full capitalize">
                      {item.product.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.product.quantity}kg available
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600 mb-2">
                    ₹{item.product.price}/kg
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}kg</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.quantity}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 p-1 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-700 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({getTotalItems()})</span>
                <span>₹{getTotalAmount().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{getTotalAmount().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
              {user.profile?.address?.village ? (
                <div className="text-sm text-gray-600">
                  <p>{user.name}</p>
                  <p>{user.profile.address.houseNo} {user.profile.address.street}</p>
                  <p>{user.profile.address.village}, {user.profile.address.mandal}</p>
                  <p>{user.profile.address.district}, {user.profile.address.state}</p>
                  <p>{user.profile.address.pincode}</p>
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  Please complete your profile with address details
                </p>
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !user.profile?.address?.village}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>
                {loading ? 'Placing Order...' : 'Place Order'}
              </span>
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;