import React from 'react';
import { Sprout, Users, TrendingUp, Shield, ArrowRight, Leaf } from 'lucide-react';

interface LandingPageProps {
  onAuthModeChange: (mode: 'login' | 'register') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthModeChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-green-600 p-4 rounded-full shadow-lg">
                <Sprout className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Farm</span>Market
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting farmers directly with vendors. Fresh produce, fair prices, sustainable farming.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => onAuthModeChange('login')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onAuthModeChange('register')}
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Join as New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FarmMarket?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionizing the agricultural supply chain with technology and trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Direct Connection</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect farmers directly with vendors, eliminating middlemen and ensuring fair prices for everyone.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Better Profits</h3>
              <p className="text-gray-600 leading-relaxed">
                Farmers get better prices for their produce while vendors access fresh products at competitive rates.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Quality verification, reviews, and ratings ensure you get the best produce every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fresh Categories</h2>
            <p className="text-xl text-gray-600">Discover a wide variety of fresh produce</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fresh Vegetables"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Fresh Vegetables</h3>
                <p className="text-green-200">Farm-fresh vegetables daily</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fresh Fruits"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Seasonal Fruits</h3>
                <p className="text-orange-200">Sweet and nutritious fruits</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Pulses and Grains"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Pulses & Grains</h3>
                <p className="text-yellow-200">Premium quality grains</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Leaf className="w-16 h-16 text-green-200 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of farmers and vendors who are already benefiting from our platform.
            Start your journey towards sustainable and profitable farming today.
          </p>
          <button
            onClick={() => onAuthModeChange('register')}
            className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Join FarmMarket Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;