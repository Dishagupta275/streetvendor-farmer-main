import { User, Product, Order, CartItem } from '../types';

const STORAGE_KEYS = {
  USERS: 'marketplace_users',
  CURRENT_USER: 'marketplace_current_user',
  PRODUCTS: 'marketplace_products',
  ORDERS: 'marketplace_orders',
  CART: 'marketplace_cart'
};

// User Management
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUserByCredentials = (name: string, password: string, userType: string): User | null => {
  const users = getUsers();
  return users.find(u => u.name === name && u.password === password && u.userType === userType) || null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Product Management
export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return products ? JSON.parse(products) : [];
};

export const getProductsByCategory = (category: string): Product[] => {
  return getProducts().filter(p => p.category === category);
};

export const getProductsBySeller = (sellerId: string): Product[] => {
  return getProducts().filter(p => p.sellerId === sellerId);
};

export const deleteProduct = (productId: string): void => {
  const products = getProducts().filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Order Management
export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  const existingIndex = orders.findIndex(o => o.id === order.id);
  
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }
  
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return orders ? JSON.parse(orders) : [];
};

export const getOrdersByBuyer = (buyerId: string): Order[] => {
  return getOrders().filter(o => o.buyerId === buyerId);
};

export const getOrdersBySeller = (sellerId: string): Order[] => {
  return getOrders().filter(o => o.sellerId === sellerId);
};

// Cart Management
export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
};

export const clearCart = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};