
export type StretchBuyerEntry = {
  date?: string;   // ISO
  sum: number;
  orderId?: string;
};

export type StretchBuyerModel = {
  _id: string;
  buyerName: string;
  buyerPhone1: string;
  buyerPhone2?: string;
  buyerRegion?: string;
  buyerAddress?: string;
  order?: string[];
  debetKredit?: string[];
  buy?: StretchBuyerEntry[];
  credit?: StretchBuyerEntry[];
  totalSum?: number;
};

export type DerivedBuyer = StretchBuyerModel & {
  ordersCount: number;
  dkCount: number;
  buyCount: number;
  creditCount: number;
  buySum: number;
  creditSum: number;
  total: number; // Number(totalSum ?? 0)
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
