export type PlintBuyEntry = {
   type: 'retail' | 'wholesale';
  date: Date;
  sum: number;
  orderId: string;
};

// одно событие "платёж" для деталки
export type PlintCreditEntry = {
  date: Date;
  sum: number;
  note?: string;
};

export type DerivedPlintBuyer = {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;

  ordersCount: number;  // retailOrder.length + wholesaleOrder.length
  dkCount: number;      // debetKredit.length
  buyCount: number;     // buyRetail.length + buyWholesale.length
  creditCount: number;  // credit.length

  buySum: number;       // сумма amount по buyRetail + buyWholesale
  creditSum: number;    // сумма amount по credit
  total: number;        // balanceAMD

  buyRetail?: any[];
  buyWholesale?: any[];
  credit?: any[];
};

export type FilterMode = 'all' | 'nonzero';
export type SortKey =
  | 'name'
  | 'phone1'
  | 'region'
  | 'address'
  | 'ordersCount'
  | 'dkCount'
  | 'buySum'
  | 'creditSum'
  | 'total';
export type SortDir = 'asc' | 'desc';
