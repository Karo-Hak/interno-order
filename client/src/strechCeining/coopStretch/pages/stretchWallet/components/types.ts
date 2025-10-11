// types.ts (или блок типов рядом с utils)

export type CoopBuyerEntry = {
  date?: string;   // ISO
  sum: number;
  orderId?: string;

  // для credit
  dkId?: string | null;
  returnId?: string | null;
  type?: 'payment' | 'return';
};

export type Buy = { date: string | Date; sum: number; orderId: string };

// теперь кредит может содержать returnId (для возврата) и dkId (для платежа)
export type Credit = {
  date: string | Date;
  sum: number;
  dkId?: string;
  returnId?: string;
  type?: 'payment' | 'return'; // опционально — если бек уже присылает
};

export type DerivedBuyer = {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;

  ordersCount: number;
  dkCount: number;
  buyCount: number;
  creditCount: number;

  buySum: number;
  creditSum: number;
  total: number;

  buy?: any[];    // «как есть» от API
  credit?: any[]; // «как есть» от API
  order?: Array<string | { _id: string }>;
};

export type FilterMode = 'all' | 'nonzero';
export type SortKey =
  | 'buyerName'
  | 'buyerRegion'
  | 'buyerAddress'
  | 'ordersCount'
  | 'dkCount'
  | 'buySum'
  | 'creditSum'
  | 'total';
export type SortDir = 'asc' | 'desc';
