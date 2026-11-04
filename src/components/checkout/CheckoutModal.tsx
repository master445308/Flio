import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building,
  Check,
} from 'lucide-react';
import { CartItem, Order, PromoCode } from '../../types';
import { KAZAKHSTAN_CITIES } from '../../data/initialData';
import { formatPrice, formatPhone, formatInstallment } from '../../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: PromoCode | null;
  currentCity: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  currentCity,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+7 (7');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(currentCity || 'Алматы');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'express' | 'pickup'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'kaspi_qr' | 'kaspi_installment' | 'card_online' | 'cash_on_delivery'>('kaspi_qr');
  const [installmentMonths, setInstallmentMonths] = useState<number>(12);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Kaspi QR Simulator states
  const [kaspiTimer, setKaspiTimer] = useState(300);
  const [kaspiPaid, setKaspiPaid] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const freeThreshold = 30000;
  const shippingFee = deliveryMethod === 'pickup' || subtotal >= freeThreshold ? 0 : deliveryMethod === 'express' ? 2500 : 1500;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || phone.length < 16) {
      alert('Пожалуйста, заполните имя и корректный номер телефона (+7 (7XX) XXX-XX-XX)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `KZ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@client.kz`,
        city,
        address: deliveryMethod === 'pickup' ? `Шоурум ElectroNova / Kaspi Postomat в г. ${city}` : address.trim() || `г. ${city}`,
        deliveryMethod,
        paymentMethod,
        installmentMonths: paymentMethod === 'kaspi_installment' ? installmentMonths : undefined,
        items,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        promoCodeUsed: appliedPromo?.code,
        status: 'новый',
        createdAt: new Date().toISOString(),
        notes: notes.trim() || undefined,
      };

      setIsSubmitting(false);
      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {createdOrder ? 'Заказ успешно оформлен' : 'Оформление заказа в тенге'}
              </h2>
              <p className="text-[11px] text-slate-400">Быстрая доставка по Казахстану</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {createdOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Номер заказа: {createdOrder.id}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                  Рахмет, {createdOrder.customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  Ваш заказ принят в обработку. Мы отправили детали на телефон{' '}
                  <span className="text-white font-medium">{createdOrder.phone}</span>.
                </p>
              </div>

              {/* Payment specific details */}
              {createdOrder.paymentMethod === 'kaspi_qr' && (
                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 mb-2">
                    <QrCode className="w-4 h-4" /> Kaspi QR оплата
                  </div>
                  <div className="p-3 bg-white rounded-xl inline-block shadow-lg my-1">
                    {/* SVG mockup of clean QR code */}
                    <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-20 h-20 text-cyan-400" />
                      <span className="text-[10px] font-mono text-cyan-200 mt-1">KASPI-{createdOrder.id}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-2">
                    Сумма к оплате: <strong className="text-white">{formatPrice(createdOrder.totalAmount)}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Откройте приложение Kaspi.kz и отсканируйте код
                  </p>
                </div>
              )}

              {createdOrder.paymentMethod === 'kaspi_installment' && (
                <div className="max-w-sm mx-auto p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs">
                  <span className="text-red-400 font-bold block mb-1">
                    Kaspi Рассрочка {createdOrder.installmentMonths} месяцев
                  </span>
                  <span className="text-white font-semibold">
                    Ежемесячный платеж: {formatInstallment(createdOrder.totalAmount, createdOrder.installmentMonths || 12)}
                  </span>
                </div>
              )}

              {/* Order breakdown */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Город и адрес:</span>
                  <span className="text-white font-medium text-right">{createdOrder.city}, {createdOrder.address}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Способ доставки:</span>
                  <span className="text-white font-medium">
                    {createdOrder.deliveryMethod === 'express' ? 'Экспресс (2 часа)' : createdOrder.deliveryMethod === 'pickup' ? 'Самовывоз / Kaspi Postomat' : 'Курьер'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Итоговая сумма:</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatPrice(createdOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg transition"
                >
                  Вернуться в магазин
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Step 1: Customer details */}
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">1</span>
                  Контактные данные
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Имя и фамилия <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Алихан Ибрагимов"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Телефон (Казахстан) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (701) 234-56-78"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">Email для чека</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.kz"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery */}
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">2</span>
                  Способ и адрес доставки
                </h4>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-3 rounded-xl border text-left transition ${
                      deliveryMethod === 'courier'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-cyan-400 mb-1" />
                    <p className="text-xs font-bold">Курьер</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">1-2 дня ({subtotal >= freeThreshold ? '0 ₸' : '1 500 ₸'})</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-3 rounded-xl border text-left transition ${
                      deliveryMethod === 'express'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-emerald-400 mb-1" />
                    <p className="text-xs font-bold">Экспресс</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">За 2 часа ({subtotal >= freeThreshold ? '0 ₸' : '2 500 ₸'})</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-xl border text-left transition ${
                      deliveryMethod === 'pickup'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-purple-400 mb-1" />
                    <p className="text-xs font-bold">Самовывоз</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Kaspi Postomat (0 ₸)</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Город</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      {KAZAKHSTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">
                      {deliveryMethod === 'pickup' ? 'Пункт выдачи / Postomat' : 'Улица, дом, квартира'}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={
                        deliveryMethod === 'pickup'
                          ? 'Kaspi Postomat №14 (ТРЦ Достык Плаза)'
                          : 'пр. Абая, д. 45, кв. 18'
                      }
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">3</span>
                  Способ оплаты (Казахстан)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kaspi_qr')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'kaspi_qr'
                        ? 'bg-red-500/15 border-red-500 text-white shadow-md shadow-red-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <span className="font-bold block">Kaspi QR</span>
                    <span className="text-[10px] text-slate-400">Мгновенно</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kaspi_installment')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'kaspi_installment'
                        ? 'bg-red-500/15 border-red-500 text-white shadow-md shadow-red-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <span className="font-bold block">Рассрочка 0-0-12</span>
                    <span className="text-[10px] text-red-400 font-semibold">Kaspi Red</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_online')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'card_online'
                        ? 'bg-cyan-500/15 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <span className="font-bold block">Картой</span>
                    <span className="text-[10px] text-slate-400">Visa / MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <span className="font-bold block">При получении</span>
                    <span className="text-[10px] text-slate-400">Курьеру</span>
                  </button>
                </div>

                {/* Kaspi Installment selector */}
                {paymentMethod === 'kaspi_installment' && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-red-400">Выберите срок рассрочки:</span>
                      <span className="font-bold text-white">
                        {formatInstallment(totalAmount, installmentMonths)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 6, 12, 24].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setInstallmentMonths(m)}
                          className={`py-1.5 rounded-lg font-bold transition ${
                            installmentMonths === m
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {m} мес
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order total & CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Итого к оплате:</span>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {formatPrice(totalAmount)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Создание заказа...</span>
                  ) : (
                    <>
                      <span>Подтвердить заказ</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
