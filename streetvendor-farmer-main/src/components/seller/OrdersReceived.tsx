import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, User, MapPin, Phone } from 'lucide-react';
import { getOrdersBySeller, saveOrder, getProducts } from '../../utils/storage';
import { User as UserType, Order, Product } from '../../types';

interface OrdersReceivedProps {
  user: UserType;
}

const OrdersReceived: React.FC<OrdersReceivedProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [user.id]);

  const loadOrders = () => {
    setOrders(getOrdersBySeller(user.id));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleOrderAction = (orderId: string, action: 'accepted' | 'rejected') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Update product quantities if accepting order
    if (action === 'accepted') {
      const products = getProducts();
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          // Save updated product
          const updatedProducts = products.map(p => p.id === product.id ? product : p);
          localStorage.setItem('marketplace_products', JSON.stringify(updatedProducts));
        }
      });
    }

    const updatedOrder = { ...order, status: action };
    saveOrder(updatedOrder);
    loadOrders();
  };

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
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Received</h1>
          <p className="text-gray-600 mt-1">Manage incoming orders from buyers</p>
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
              ? "You haven't received any orders yet." 
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

                {/* Buyer Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Buyer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{order.buyerName}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">
                        {order.buyerAddress.village}, {order.buyerAddress.mandal}, {order.buyerAddress.district}
                      </span>
                    </div>
                  </div>
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

                {/* Action Buttons */}
                {order.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOrderAction(order.id, 'rejected')}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Order</span>
                    </button>
                    <button
                      onClick={() => handleOrderAction(order.id, 'accepted')}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Order</span>
                    </button>
                  </div>
                )}

                {order.status === 'accepted' && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOrderAction(order.id, 'delivered')}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Mark as Delivered</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersReceived;