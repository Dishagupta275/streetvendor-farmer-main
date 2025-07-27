import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Star } from 'lucide-react';
import { getOrdersByBuyer, saveOrder, saveProduct, getProducts } from '../../utils/storage';
import { User, Order, Review } from '../../types';

interface OrdersProps {
  user: User;
}

const Orders: React.FC<OrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<{ [productId: string]: { rating: number; comment: string } }>({});

  useEffect(() => {
    loadOrders();
  }, [user.id]);

  const loadOrders = () => {
    const userOrders = getOrdersByBuyer(user.id);
    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    setOrders(userOrders);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is waiting for seller confirmation';
      case 'accepted':
        return 'Your order has been accepted and is being prepared';
      case 'rejected':
        return 'Your order was rejected by the seller';
      case 'delivered':
        return 'Your order has been delivered successfully';
      default:
        return '';
    }
  };

  const handleReviewSubmit = (order: Order) => {
    const products = getProducts();
    
    // Add reviews to products
    order.items.forEach(item => {
      const review = reviews[item.productId];
      if (review && review.rating > 0) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const newReview: Review = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            buyerId: user.id,
            buyerName: user.name,
            rating: review.rating,
            comment: review.comment,
            date: new Date().toLocaleDateString()
          };
          
          product.reviews.push(newReview);
          
          // Recalculate average rating
          const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
          product.averageRating = totalRating / product.reviews.length;
          
          saveProduct(product);
        }
      }
    });

    // Clear reviews state
    setReviews({});
    setReviewingOrder(null);
    
    alert('Thank you for your review!');
  };

  const updateReview = (productId: string, field: 'rating' | 'comment', value: number | string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders & Delivery</h1>
          <p className="text-gray-600 mt-1">Track your orders and delivery status</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-500">{order.orderDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className="text-lg font-bold text-green-600">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Message */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{getStatusMessage(order.status)}</p>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{item.product.name}</p>
                            <p className="text-sm text-gray-500">₹{item.product.price}/kg</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{item.quantity}kg</p>
                          <p className="text-sm text-gray-500">₹{(item.quantity * item.product.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Information */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Seller Information</h4>
                  <p className="text-sm text-blue-800">
                    This order will be fulfilled by the respective sellers of each product.
                  </p>
                </div>

                {/* Action Buttons */}
                {order.status === 'delivered' && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setReviewingOrder(order)}
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Star className="w-4 h-4" />
                      <span>Write Review</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Write Review for Order #{reviewingOrder.id.slice(-8)}
                </h3>
                <button
                  onClick={() => setReviewingOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-6">
                {reviewingOrder.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}kg</p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => updateReview(item.productId, 'rating', rating)}
                            className={`w-8 h-8 ${
                              (reviews[item.productId]?.rating || 0) >= rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            <Star className="w-full h-full fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment (Optional)
                      </label>
                      <textarea
                        value={reviews[item.productId]?.comment || ''}
                        onChange={(e) => updateReview(item.productId, 'comment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                        placeholder="Share your experience with this product..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={() => setReviewingOrder(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewSubmit(reviewingOrder)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;