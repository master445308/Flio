import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../../types';
import { CATEGORIES, BRANDS } from '../../data/initialData';
import { formatPrice } from '../../utils/formatters';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onAddProduct,
  onDeleteProduct,
  onResetData,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products'>('orders');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newCategory, setNewCategory] = useState('smartphones');
  const [newPrice, setNewPrice] = useState(299990);
  const [newOldPrice, setNewOldPrice] = useState(349990);
  const [newStock, setNewStock] = useState(15);
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
  );
  const [newDesc, setNewDesc] = useState('');

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const inStockCount = products.filter((p) => p.inStock).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle.trim(),
      brand: newBrand,
      category: newCategory,
      price: Number(newPrice),
      oldPrice: newOldPrice ? Number(newOldPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      inStock: newStock > 0,
      stockCount: Number(newStock),
      badge: 'Новинка',
      image: newImage.trim(),
      images: [newImage.trim()],
      description: newDesc.trim() || 'Флагманская новинка в каталоге ElectroNova с официальной гарантией.',
      specs: {
        Категория: newCategory,
        Бренд: newBrand,
        Гарантия: '12 месяцев',
      },
      createdAt: new Date().toISOString(),
    };

    onAddProduct(created);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const statusOptions: OrderStatus[] = [
    'новый',
    'в обработке',
    'отправлен',
    'в пути',
    'доставлен',
    'отменен',
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Панель администратора ElectroNova
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Управление заказами, товарами и ценами в казахстанских тенге (₸)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
            title="Восстановить исходные данные"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Сброс базы</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Общая выручка</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{formatPrice(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
            {orders.length} заказов оформлено
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Средний чек</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{formatPrice(averageCheck)}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Kaspi QR и рассрочка</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Товаров на складе</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{inStockCount} шт</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Из {products.length} моделей</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Kaspi Рассрочка</span>
            <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
              0-0-12
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">Активна</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Без переплат клиенту</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition ${
              activeAdminTab === 'orders'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Заказы покупателей ({orders.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('products')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition ${
              activeAdminTab === 'products'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Управление товарами ({products.length})
          </button>
        </div>

        {activeAdminTab === 'products' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition mb-2"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>
        )}
      </div>

      {/* Orders Manager Tab */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">#{o.id}</span>
                  <span className="text-xs text-slate-400">• {o.customerName}</span>
                  <span className="text-xs text-cyan-400">({o.phone})</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  г. {o.city}, {o.address} • Доставка: {o.deliveryMethod}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {o.items.map((it, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300"
                    >
                      {it.product.title} (x{it.quantity})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div className="text-right">
                  <p className="text-base font-extrabold text-white">{formatPrice(o.totalAmount)}</p>
                  <p className="text-[10px] text-slate-400">
                    Оплата: {o.paymentMethod === 'kaspi_qr' ? 'Kaspi QR' : o.paymentMethod === 'kaspi_installment' ? 'Kaspi 0-0-12' : 'Карта'}
                  </p>
                </div>

                {/* Status Selector */}
                <div>
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Manager Tab */}
      {activeAdminTab === 'products' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Поиск по товарам в каталоге..."
              className="w-full max-w-sm bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products
              .filter(
                (p) =>
                  p.title.toLowerCase().includes(searchProduct.toLowerCase()) ||
                  p.brand.toLowerCase().includes(searchProduct.toLowerCase())
              )
              .map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-12 h-12 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        {p.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-white truncate">{p.title}</h4>
                      <p className="text-xs font-bold text-white mt-0.5">{formatPrice(p.price)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                    title="Удалить товар"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 animate-in zoom-in-95"
          >
            <h3 className="text-base font-bold text-white mb-4">Добавление товара (Цены в тенге)</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Название модели</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Sony PlayStation 5 Pro 2TB"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Бренд</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Категория</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Цена (₸)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Старая цена (₸)</label>
                  <input
                    type="number"
                    value={newOldPrice}
                    onChange={(e) => setNewOldPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Остаток (шт)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">URL изображения</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Краткое описание</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Официальная сертифицированная модель для Казахстана..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  Сохранить товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
