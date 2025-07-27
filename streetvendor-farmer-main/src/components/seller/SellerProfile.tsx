import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Edit, Trash2, MapPin, Phone, CreditCard, Building } from 'lucide-react';
import { getCurrentUser, saveUser } from '../../utils/storage';
import { User as UserType } from '../../types';
import { mandalsList } from '../../data/products';

interface SellerProfileProps {
  user: UserType;
}

const SellerProfile: React.FC<SellerProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    mobile: user.mobile,
    profilePhoto: user.profile?.profilePhoto || '',
    panCard: user.profile?.panCard || '',
    bankAccount: user.profile?.bankAccount || '',
    businessName: user.profile?.businessName || '',
    gstNumber: user.profile?.gstNumber || '',
    address: {
      houseNo: user.profile?.address?.houseNo || '',
      street: user.profile?.address?.street || '',
      village: user.profile?.address?.village || '',
      pincode: user.profile?.address?.pincode || '',
      mandal: user.profile?.address?.mandal || '',
      district: user.profile?.address?.district || '',
      state: user.profile?.address?.state || 'Telangana'
    }
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updatedUser: UserType = {
        ...user,
        name: formData.name,
        mobile: formData.mobile,
        profile: {
          profilePhoto: formData.profilePhoto,
          panCard: formData.panCard,
          bankAccount: formData.bankAccount,
          businessName: formData.businessName,
          gstNumber: formData.gstNumber,
          address: formData.address
        }
      };
      
      saveUser(updatedUser);
      setIsEditing(false);
      
      // Update current user in localStorage
      localStorage.setItem('marketplace_current_user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      // In a real app, you would delete the user account
      alert('Profile deletion would be implemented here');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your seller profile and business information</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">Seller • {formData.businessName || 'Business Name Not Set'}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{formData.mobile}</span>
                </div>
                {formData.address.village && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.address.village}, {formData.address.mandal}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Shop Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your business name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Financial Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card Number
                </label>
                <input
                  type="text"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter bank account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Address Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House/Shop Number
                </label>
                <input
                  type="text"
                  name="address.houseNo"
                  value={formData.address.houseNo}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="H.No. 123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Street name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village *
                </label>
                <input
                  type="text"
                  name="address.village"
                  value={formData.address.village}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Village name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="500001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mandal *
                </label>
                <select
                  name="address.mandal"
                  value={formData.address.mandal}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select Mandal</option>
                  {mandalsList.map((mandal) => (
                    <option key={mandal} value={mandal}>{mandal}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="District name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <button
                onClick={handleDelete}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;