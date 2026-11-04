import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryBar } from './components/catalog/CategoryBar';
import { ProductCard } from './components/catalog/ProductCard';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrdersView } from './components/orders/OrdersView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import {
  INITIAL_PRODUCTS,
  CATEGORIES,
  BRANDS,
  PROMO_CODES,
  INITIAL_ORDERS,
} from './data/initialData';
import { Product, CartItem, Order, OrderStatus, PromoCode, ActiveTab } from './types';
import { formatPrice } from './utils/formatters';

export default function App() {
  // State: Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_products_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // State: Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }, // iPhone 16 Pro Max
      { product: INITIAL_PRODUCTS[4], quantity: 1 }, // Sony WH-1000XM5
    ];
  });

  // State: Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_favs_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-1', 'prod-6'];
  });

  // State: Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  // State: Settings & Navigation
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem('electronova_city') || 'Алматы';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // State: Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // State: Active Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(PROMO_CODES[0]); // default MONIS05 15%

  // State: Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('electronova_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('electronova_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('electronova_favs_v2', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('electronova_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('electronova_city', currentCity);
  }, [currentCity]);

  // Toast helper
  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    addToast('success', 'Товар добавлен в корзину', `${product.title} (${qty} шт)`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('info', 'Товар удален из корзины');
  };

  const handleClearCart = () => {
    setCart([]);
    addToast('info', 'Корзина очищена');
  };

  // Favorites actions
  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        addToast('info', 'Удалено из избранного', product.title);
        return prev.filter((id) => id !== product.id);
      } else {
        addToast('success', 'Добавлено в избранное ❤️', product.title);
        return [...prev, product.id];
      }
    });
  };

  // Promo code actions
  const handleApplyPromo = (code: string): boolean => {
    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedPromo(found);
      addToast('success', `Промокод ${found.code} активирован!`, `Скидка ${found.discountPercent}% на весь заказ`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('info', 'Промокод отменен');
  };

  // Order created
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    addToast('success', `Заказ #${newOrder.id} оформлен!`, `Сумма: ${formatPrice(newOrder.totalAmount)}`);
  };

  // Admin actions
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast('success', `Статус заказа #${orderId} изменен`, `Новый статус: ${status}`);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', 'Товар добавлен в каталог', newProduct.title);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('info', 'Товар удален из каталога');
  };

  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem('electronova_products_v2');
    localStorage.removeItem('electronova_orders_v2');
    addToast('info', 'Каталог и заказы сброшены к начальным значениям');
  };

  // Category counts
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && !p.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesSpecs = Object.values(p.specs || {}).some(
            (v) => typeof v === 'string' && v.toLowerCase().includes(q)
          );
          if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesSpecs) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // 'popular'
        return b.reviewsCount - a.reviewsCount;
      });
  }, [products, selectedCategory, selectedBrand, onlyInStock, searchQuery, sortBy]);

  // Favorite products list
  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  // Cart total items count
  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col pb-20 sm:pb-8 selection:bg-cyan-500 selection:text-white">
      {/* Offline Connectivity Warning */}
      <OfflineIndicator />

      {/* PWA Mobile App Promo Banner */}
      <PWAInstallBanner />

      {/* Main Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        cartCount={cartTotalItems}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          if (!isAdmin) {
            setActiveTab('admin');
            addToast('info', 'Режим администратора включен', 'Доступно управление товарами и заказами');
          } else {
            setActiveTab('home');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-10">
            {/* Hero Banner Carousel */}
            <HeroBanner
              onGoToCatalog={(cat) => {
                if (cat) setSelectedCategory(cat);
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onApplyPromo={handleApplyPromo}
              currentCity={currentCity}
            />

            {/* Quick Categories Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Популярные категории
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveTab('catalog');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  Весь каталог <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <CategoryBar
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  setActiveTab('catalog');
                }}
                productCounts={productCounts}
              />
            </div>

            {/* Hit Sales Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Zap className="w-4 h-4 fill-amber-400" />
                    </span>
                    Хиты продаж в Казахстане
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Флагманские гаджеты в наличии в {currentCity} с ценами в тенге
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {products
                  .filter((p) => p.badge === 'Хит' || p.rating >= 4.8)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      isInCart={cart.some((item) => item.product.id === product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToCart={handleAddToCart}
                      onOpenDetails={setSelectedProduct}
                    />
                  ))}
              </div>
            </div>

            {/* Kaspi 0-0-12 Special Banner */}
            <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-red-500/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold mb-3">
                  <Zap className="w-3.5 h-3.5 fill-red-400" /> Kaspi Red & Kaspi Рассрочка 0-0-12
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  Покупайте любую технику в рассрочку до 24 месяцев!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Оформление онлайн за 1 минуту прямо в корзине. Без переплат, без процентов, без первого взноса.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('smartphones');
                      setActiveTab('catalog');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition cursor-pointer"
                  >
                    Выбрать смартфон в рассрочку
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('gaming');
                      setActiveTab('catalog');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition cursor-pointer"
                  >
                    PlayStation 5 и гейминг
                  </button>
                </div>
              </div>
            </div>

            {/* New Arrivals Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    Новинки 2026 года
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Свежие поступления электроники с официальной гарантией
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setActiveTab('catalog');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Смотреть все новинки
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {products
                  .filter((p) => p.badge === 'Новинка' || p.badge === 'Скидка')
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      isInCart={cart.some((item) => item.product.id === product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToCart={handleAddToCart}
                      onOpenDetails={setSelectedProduct}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="py-4 space-y-5">
            {/* Category horizontal scroll */}
            <CategoryBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productCounts={productCounts}
            />

            {/* Controls Bar: Brands, Filters, Sorting, Search Results Counter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Brand select */}
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="all">Все бренды ({BRANDS.length})</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                {/* In stock toggle */}
                <button
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`text-xs px-3 py-2 rounded-xl font-semibold border transition cursor-pointer ${
                    onlyInStock
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  В наличии в {currentCity}
                </button>

                {/* Reset filters button if active */}
                {(selectedCategory !== 'all' || selectedBrand !== 'all' || onlyInStock || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setOnlyInStock(false);
                      setSearchQuery('');
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Сбросить
                  </button>
                )}
              </div>

              {/* Sorting and Results count */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-400">
                  Найдено: <strong className="text-white">{filteredProducts.length}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price_asc">Сначала дешевле (₸)</option>
                    <option value="price_desc">Сначала дороже (₸)</option>
                    <option value="rating">По рейтингу</option>
                    <option value="newest">Сначала новинки</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Товары не найдены</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Попробуйте изменить поисковый запрос, выбрать другую категорию или сбросить фильтры.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setOnlyInStock(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Показать все товары
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    isInCart={cart.some((item) => item.product.id === product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>Избранные товары</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {favoriteProducts.length} сохраненных товаров с ценами в тенге
                </p>
              </div>
              {favoriteProducts.length > 0 && (
                <button
                  onClick={() => setFavorites([])}
                  className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                >
                  Очистить список
                </button>
              )}
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 max-w-lg mx-auto">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Список избранного пуст</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Нажимайте на сердечко у любого товара, чтобы не потерять интересные предложения!
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg"
                >
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={true}
                    isInCart={cart.some((item) => item.product.id === product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CART */}
        {activeTab === 'cart' && (
          <CartDrawer
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onContinueShopping={() => setActiveTab('catalog')}
            currentCity={currentCity}
          />
        )}

        {/* TAB 5: ORDERS & PROFILE */}
        {activeTab === 'orders' && <OrdersView orders={orders} />}

        {/* TAB 6: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            products={products}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        isInCart={selectedProduct ? cart.some((i) => i.product.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        currentCity={currentCity}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromo={appliedPromo}
        currentCity={currentCity}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Floating Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Mobile App Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
        cartCount={cartTotalItems}
        ordersCount={orders.length}
      />
    </div>
  );
}
