export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number; // in Tenge (₸)
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: string; // 'Хит' | 'Новинка' | 'Скидка' | 'Kaspi Red'
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string | undefined>;
  createdAt: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'новый' | 'в обработке' | 'отправлен' | 'в пути' | 'доставлен' | 'отменен';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  deliveryMethod: 'courier' | 'express' | 'pickup';
  paymentMethod: 'kaspi_qr' | 'kaspi_installment' | 'card_online' | 'cash_on_delivery';
  installmentMonths?: number;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  promoCodeUsed?: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}

export type ActiveTab = 'home' | 'catalog' | 'favorites' | 'cart' | 'orders' | 'admin';
