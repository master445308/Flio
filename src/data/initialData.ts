import { Category, Order, Product, PromoCode } from '../types';
import rawProducts from './products.json';

export const INITIAL_PRODUCTS: Product[] = ((rawProducts as unknown) as Product[]).map((p) => ({
  ...p,
  price: p.price || 99990,
  inStock: p.inStock ?? true,
  stockCount: p.stockCount ?? 10,
}));

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Все товары', icon: 'Grid' },
  { id: 'smartphones', label: 'Смартфоны', icon: 'Smartphone' },
  { id: 'laptops', label: 'Ноутбуки и ПК', icon: 'Laptop' },
  { id: 'audio', label: 'Аудио и наушники', icon: 'Headphones' },
  { id: 'gaming', label: 'Гейминг и консоли', icon: 'Gamepad2' },
  { id: 'wearables', label: 'Смарт-часы', icon: 'Watch' },
  { id: 'monitors', label: 'Мониторы и ТВ', icon: 'Tv' },
  { id: 'accessories', label: 'Аксессуары', icon: 'Cpu' },
];

export const BRANDS: string[] = [
  'Apple',
  'Samsung',
  'Sony',
  'ASUS',
  'LG',
  'DJI',
  'Logitech',
  'Marshall',
  'Bose',
  'Canon',
];

export const KAZAKHSTAN_CITIES: string[] = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Атырау',
  'Костанай',
  'Кызылорда',
  'Уральск',
  'Актау',
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'MONIS05',
    discountPercent: 15,
    description: 'Эксклюзивная скидка 15% от создателя monis05',
  },
  {
    code: 'ELECTRO10',
    discountPercent: 10,
    description: 'Скидка 10% на все заказы в приложении ElectroNova',
  },
  {
    code: 'KASPI5',
    discountPercent: 5,
    description: 'Приветственная скидка 5% при оплате через Kaspi',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KZ-7819',
    customerName: 'Азамат Султанов',
    phone: '+7 (777) 234-56-78',
    email: 'azamat.s@example.kz',
    city: 'Алматы',
    address: 'ул. Достык, д. 85, кв. 42',
    deliveryMethod: 'courier',
    paymentMethod: 'kaspi_installment',
    installmentMonths: 12,
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }, // iPhone 16 Pro Max
      { product: INITIAL_PRODUCTS[5], quantity: 1 }, // AirPods Pro 2
    ],
    subtotal: 879980,
    discountAmount: 131997,
    shippingFee: 0,
    totalAmount: 747983,
    promoCodeUsed: 'MONIS05',
    status: 'в обработке',
    createdAt: '2026-11-03T14:22:00Z',
    notes: 'Позвонить за 1 час до доставки курьером',
  },
  {
    id: 'KZ-7820',
    customerName: 'Динара Нурланова',
    phone: '+7 (701) 555-88-99',
    email: 'dinara.n@example.kz',
    city: 'Астана',
    address: 'пр. Мәңгілік Ел, д. 20, блок Б',
    deliveryMethod: 'express',
    paymentMethod: 'kaspi_qr',
    items: [{ product: INITIAL_PRODUCTS[4], quantity: 1 }], // Sony WH-1000XM5
    subtotal: 184990,
    discountAmount: 0,
    shippingFee: 2500,
    totalAmount: 187490,
    status: 'отправлен',
    createdAt: '2026-11-03T11:05:00Z',
    notes: 'Срочная доставка в офис до 18:00',
  },
  {
    id: 'KZ-7821',
    customerName: 'Ербол Ахметов',
    phone: '+7 (705) 123-45-67',
    email: 'yerbol.a@example.kz',
    city: 'Шымкент',
    address: 'Пункт выдачи ElectroNova / Kaspi Postomat №14',
    deliveryMethod: 'pickup',
    paymentMethod: 'kaspi_qr',
    items: [{ product: INITIAL_PRODUCTS[6], quantity: 1 }], // PS5 Pro
    subtotal: 449990,
    discountAmount: 44999,
    shippingFee: 0,
    totalAmount: 404991,
    promoCodeUsed: 'ELECTRO10',
    status: 'доставлен',
    createdAt: '2026-11-01T17:40:00Z',
  },
];
