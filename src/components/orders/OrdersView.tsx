import React, { useState } from 'react';
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  QrCode,
  Zap,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';

interface OrdersViewProps {
  orders: Order[];
  onOpenProductDetails?: (productId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  const [searchId, setSearchId] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchId.toLowerCase().trim()) ||
    o.customerName.toLowerCase().includes(searchId.toLowerCase().trim()) ||
    o.phone.includes(searchId.trim())
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'новый':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'в обработке':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'отправлен':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'в пути':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'доставлен':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'отменен':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'новый':
        return 0;
      case 'в обработке':
        return 1;
      case 'отправлен':
        return 2;
      case 'в пути':
        return 3;
      case 'доставлен':
        return 4;
      default:
        return 0;
    }
  };

  const statusSteps = ['Принят', 'В сборке', 'Отправлен', 'В пути', 'Доставлен'];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-400" />
            <span>История и отслеживание заказов</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Отслеживайте статус доставки ваших товаров в тенге по Казахстану
          </p>
        </div>

        {/* Search by Order ID */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Номер заказа (KZ-7819)..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {searchId && (
            <button
              onClick={() => setSearchId('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Заказы не найдены</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchId ? 'Проверьте правильность введенного номера' : 'У вас пока нет оформленных заказов'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStep = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition overflow-hidden shadow-lg"
              >
                {/* Order Summary Line */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(order.createdAt)} • {order.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-extrabold text-white">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} тов. •{' '}
                        {order.paymentMethod === 'kaspi_qr' ? 'Kaspi QR' : order.paymentMethod === 'kaspi_installment' ? 'Kaspi Рассрочка' : 'Картой'}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-950/70 border-t border-slate-800 space-y-6 animate-in fade-in">
                    {/* Status Stepper */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Статус доставки
                      </h4>
                      <div className="grid grid-cols-5 gap-1 relative">
                        {statusSteps.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step} className="flex flex-col items-center text-center">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                                  isDone
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                                } ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 animate-pulse' : ''}`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs leading-tight ${
                                  isDone ? 'text-white font-semibold' : 'text-slate-500'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer & Delivery address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                          Получатель
                        </span>
                        <p className="font-semibold text-white">{order.customerName}</p>
                        <p className="text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" /> {order.phone}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                          Адрес доставки
                        </span>
                        <p className="font-semibold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{order.city}, {order.address}</span>
                        </p>
                        <p className="text-slate-400">
                          Способ: {order.deliveryMethod === 'express' ? 'Экспресс за 2 часа' : order.deliveryMethod === 'pickup' ? 'Самовывоз / Kaspi Postomat' : 'Курьерская доставка'}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Товары в заказе
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {item.product.title}
                                </p>
                                <span className="text-[10px] text-slate-400">
                                  {formatPrice(item.product.price)} × {item.quantity} шт
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-white shrink-0">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Financials */}
                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="text-slate-400">
                        {order.promoCodeUsed && (
                          <span className="text-emerald-400 mr-2">
                            Промокод: {order.promoCodeUsed} (-{formatPrice(order.discountAmount)})
                          </span>
                        )}
                        <span>Доставка: {order.shippingFee === 0 ? 'Бесплатно' : formatPrice(order.shippingFee)}</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        Итого: <span className="text-cyan-400">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
