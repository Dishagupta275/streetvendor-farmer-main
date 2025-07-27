export interface User {
  id: string;
  name: string;
  mobile: string;
  password: string;
  userType: 'buyer' | 'seller';
  profile?: UserProfile;
}

export interface UserProfile {
  profilePhoto?: string;
  gender?: string;
  panCard?: string;
  bankAccount?: string;
  businessName?: string;
  gstNumber?: string;
  address: {
    houseNo?: string;
    street?: string;
    village: string;
    pincode: string;
    mandal: string;
    district: string;
    state: string;
  };
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'pulses';
  price: number;
  quantity: number;
  image: string;
  description?: string;
  reviews: Review[];
  averageRating: number;
}

export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  orderDate: string;
  buyerAddress: UserProfile['address'];
}