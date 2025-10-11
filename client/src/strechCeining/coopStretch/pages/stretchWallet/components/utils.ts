import { CoopStretchBuyerModel } from '../../../features/coopStrechBuyer/coopStrechBuyerApi';
import { DerivedBuyer, CoopBuyerEntry } from './types';

export const fmtMoney = (n = 0) =>
  new Intl.NumberFormat('hy-AM', { maximumFractionDigits: 0 }).format(n);

export const fmtDate = (s?: string) => {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('hy-AM', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const safeLen = (arr?: unknown[]) => (Array.isArray(arr) ? arr.length : 0);

export const sumBy = (arr?: CoopBuyerEntry[]) =>
  Array.isArray(arr) ? arr.reduce((acc, e) => acc + (Number(e?.sum) || 0), 0) : 0;

export const normalize = (s?: string) => (s ?? '').toLocaleLowerCase();

export const derive = (r: CoopStretchBuyerModel): DerivedBuyer => {
  const ordersCount = safeLen(r.order);
  const dkCount = safeLen(r.debetKredit);
  const buyCount = safeLen(r.buy);
  const creditCount = safeLen(r.credit);
  const buySum = sumBy(r.buy);
  const creditSum = sumBy(r.credit);
  const total = Number(r.totalSum ?? 0);

  return { ...r, ordersCount, dkCount, buyCount, creditCount, buySum, creditSum, total };
};

export const compare = (a: DerivedBuyer, b: DerivedBuyer, key: string, dir: 'asc' | 'desc') => {
  const mul = dir === 'asc' ? 1 : -1;

  const num = (x: any) => Number(x ?? 0);
  const str = (x: any) => String(x ?? '').toLocaleLowerCase();

  switch (key) {
    case 'name':     return str(a.name).localeCompare(str(b.name)) * mul;
    case 'region':   return str(a.region).localeCompare(str(b.region)) * mul;
    case 'address':  return str(a.address).localeCompare(str(b.address)) * mul;
    case 'ordersCount':   return (num(a.ordersCount) - num(b.ordersCount)) * mul;
    case 'dkCount':       return (num(a.dkCount) - num(b.dkCount)) * mul;
    case 'buySum':        return (num(a.buySum) - num(b.buySum)) * mul;
    case 'creditSum':     return (num(a.creditSum) - num(b.creditSum)) * mul;
    case 'total':         return (num(a.total) - num(b.total)) * mul;
    default:              return 0;
  }
};

export const sortIndicator = (active: boolean, dir: 'asc'|'desc') =>
  active ? (dir === 'asc' ? '↑' : '↓') : '';
