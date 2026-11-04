/**
 * Formats a number to Kazakhstan Tenge (₸) currency format
 * e.g., 749990 -> "749 990 ₸"
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '0 ₸';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

/**
 * Calculates and formats monthly installment payment
 * e.g., 749990, 12 -> "62 499 ₸/мес"
 */
export function formatInstallment(amount: number, months: number = 12): string {
  if (isNaN(amount) || months <= 0) return '0 ₸/мес';
  const monthly = Math.round(amount / months);
  return formatPrice(monthly) + '/мес';
}

/**
 * Formats phone number into Kazakhstan standard format (+7 (7XX) XXX-XX-XX)
 */
export function formatPhone(val: string): string {
  // Strip non-digits
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  if (normalized.startsWith('8')) {
    normalized = '7' + normalized.slice(1);
  } else if (!normalized.startsWith('7')) {
    normalized = '7' + normalized;
  }

  // Slice to max 11 digits
  const d = normalized.slice(0, 11);
  let res = '+7';

  if (d.length > 1) {
    res += ' (' + d.slice(1, 4);
  }
  if (d.length >= 4) {
    res += ') ';
  }
  if (d.length >= 5) {
    res += d.slice(4, 7);
  }
  if (d.length >= 8) {
    res += '-' + d.slice(7, 9);
  }
  if (d.length >= 10) {
    res += '-' + d.slice(9, 11);
  }

  return res;
}

/**
 * Localized date formatter
 */
export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-KZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}
