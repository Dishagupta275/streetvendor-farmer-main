import React, { useState } from 'react';
import Layout from './Layout';
import SellerHome from './seller/SellerHome';
import MyProducts from './seller/MyProducts';
import OrdersReceived from './seller/OrdersReceived';
import AddProduct from './seller/AddProduct';
import SellerProfile from './seller/SellerProfile';
import { User } from '../types';

interface SellerDashboardProps {
  user: User;
  onLogout: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <SellerHome user={user} />;
      case 'my-products':
        return <MyProducts user={user} />;
      case 'orders-received':
        return <OrdersReceived user={user} />;
      case 'add-product':
        return <AddProduct user={user} />;
      case 'profile':
        return <SellerProfile user={user} />;
      default:
        return <SellerHome user={user} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default SellerDashboard;