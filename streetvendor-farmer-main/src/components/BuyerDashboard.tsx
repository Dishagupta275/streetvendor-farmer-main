import React, { useState } from 'react';
import Layout from './Layout';
import BuyerHome from './buyer/BuyerHome';
import Products from './buyer/Products';
import Cart from './buyer/Cart';
import Orders from './buyer/Orders';
import BuyerProfile from './buyer/BuyerProfile';
import { User } from '../types';

interface BuyerDashboardProps {
  user: User;
  onLogout: () => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <BuyerHome user={user} onPageChange={setCurrentPage} />;
      case 'products':
        return <Products user={user} />;
      case 'cart':
        return <Cart user={user} />;
      case 'orders':
        return <Orders user={user} />;
      case 'profile':
        return <BuyerProfile user={user} />;
      default:
        return <BuyerHome user={user} onPageChange={setCurrentPage} />;
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

export default BuyerDashboard;