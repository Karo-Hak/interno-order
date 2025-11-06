// src/plint/pages/plintBuyerWallet/components/utilsPlint.ts
import { PlintBuyerItem } from '../../../features/plintBuyer/plintBuyerSlice';
import { DerivedPlintBuyer } from './typesPlint';

export const fmtMoney = (n = 0) =>
  new Intl.NumberFormat('hy-AM', { maximumFractionDigits: 0 }).format(n);

export const normalizeStr = (s?: string) => (s ?? '').toLocaleLowerCase();

/** Нормализация любых id: string | { $oid } | ObjectId-like */
export const toId = (x: any): string => {
  if (typeof x === 'string') return x;
  if (x && typeof x === 'object') {
    if ('$oid' in x && x.$oid) return String(x.$oid); // Mongo Extended JSON
    if (typeof (x as any).toString === 'function') return String((x as any).toString());
  }
  return String(x ?? '');
};

/** Безопасный парсер дат: string | Date | { $date } | Date-like */
export const toSafeDate = (d: any): Date => {
  if (d instanceof Date && !Number.isNaN(d.getTime())) return d;

  if (typeof d === 'string' && d.trim()) {
    const dt = new Date(d);
    if (!Number.isNaN(dt.getTime())) return dt;
  }

  if (d && typeof d === 'object') {
    if ('$date' in d) {
      const val = (d as any).$date;
      if (typeof val === 'string' || typeof val === 'number') {
        const dt = new Date(val);
        if (!Number.isNaN(dt.getTime())) return dt;
      }
      if (val && typeof val === 'object' && '$numberLong' in val) {
        const ms = Number(val.$numberLong);
        if (Number.isFinite(ms)) {
          const dt = new Date(ms);
          if (!Number.isNaN(dt.getTime())) return dt;
        }
      }
    }
    if (typeof (d as any).toISOString === 'function') {
      const dt = new Date((d as any).toISOString());
      if (!Number.isNaN(dt.getTime())) return dt;
    }
  }
  return new Date(0);
};

// безопасная длина массива
const safeLen = (arr: unknown[] | undefined) =>
  Array.isArray(arr) ? arr.length : 0;

// сумма .amount в массивах покупок
const sumBuyArr = (arr: any[] | undefined) =>
  Array.isArray(arr)
    ? arr.reduce((acc, x) => acc + (Number(x?.amount) || 0), 0)
    : 0;

// сумма .amount в кредитах
const sumCreditArr = (arr: any[] | undefined) =>
  Array.isArray(arr)
    ? arr.reduce((acc, x) => acc + (Number(x?.amount) || 0), 0)
    : 0;

export const deriveBuyer = (b: PlintBuyerItem): DerivedPlintBuyer => {
  const retailCount = safeLen(b.retailOrder as any[]);
  const wholesaleCount = safeLen(b.wholesaleOrder as any[]);
  const ordersCount = retailCount + wholesaleCount;

  const dkCount = safeLen(b.debetKredit as any[]);

  const buyRetailLen = safeLen(b.buyRetail as any[]);
  const buyWholesaleLen = safeLen(b.buyWholesale as any[]);
  const buyCount = buyRetailLen + buyWholesaleLen;

  const creditCount = safeLen(b.credit as any[]);

  const buySum = sumBuyArr(b.buyRetail as any[]) + sumBuyArr(b.buyWholesale as any[]);
  const creditSum = sumCreditArr(b.credit as any[]);

  const total = Number(b.balanceAMD ?? 0);

  return {
    _id: toId(b._id), // ВАЖНО: всегда строка
    name: String(b.name ?? ''),
    phone1: b.phone1,
    phone2: b.phone2,
    region: b.region,
    address: b.address,

    ordersCount,
    dkCount,
    buyCount,
    creditCount,
    buySum,
    creditSum,
    total,

    buyRetail: b.buyRetail as any[],
    buyWholesale: b.buyWholesale as any[],
    credit: b.credit as any[],
  };
};

export const compareBuyer = (
  a: DerivedPlintBuyer,
  b: DerivedPlintBuyer,
  key: string,
  dir: 'asc' | 'desc'
) => {
  const mul = dir === 'asc' ? 1 : -1;
  const num = (x: any) => Number(x ?? 0);
  const str = (x: any) => String(x ?? '').toLocaleLowerCase();

  switch (key) {
    case 'name':         return str(a.name).localeCompare(str(b.name)) * mul;
    case 'phone1':       return str(a.phone1).localeCompare(str(b.phone1)) * mul;
    case 'region':       return str(a.region).localeCompare(str(b.region)) * mul;
    case 'address':      return str(a.address).localeCompare(str(b.address)) * mul;
    case 'ordersCount':  return (num(a.ordersCount) - num(b.ordersCount)) * mul;
    case 'dkCount':      return (num(a.dkCount) - num(b.dkCount)) * mul;
    case 'buySum':       return (num(a.buySum) - num(b.buySum)) * mul;
    case 'creditSum':    return (num(a.creditSum) - num(b.creditSum)) * mul;
    case 'total':        return (num(a.total) - num(b.total)) * mul;
    default:             return 0;
  }
};

export const sortIndicator = (active: boolean, dir: 'asc' | 'desc') =>
  active ? (dir === 'asc' ? '↑' : '↓') : '';
