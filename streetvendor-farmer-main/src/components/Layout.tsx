import React from 'react';
import { User, LogOut, Home, Package, ShoppingCart, FileText, UserCircle, Plus } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange, onLogout }) => {
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logout();
    onLogout();
  };

  const sellerPages = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'my-products', label: 'My Products', icon: Package },
    { id: 'orders-received', label: 'Orders Received', icon: FileText },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'profile', label: 'My Profile', icon: UserCircle }
  ];

  const buyerPages = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'orders', label: 'Orders & Delivery', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: UserCircle }
  ];

  const pages = user?.userType === 'seller' ? sellerPages : buyerPages;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FarmMarket</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                  {user?.userType}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => onPageChange(page.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    currentPage === page.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;