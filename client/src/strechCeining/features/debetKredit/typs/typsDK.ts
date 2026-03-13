export type DebetKreditItem = {
  _id?: string;               
  date: string | Date;
  type: 'Գնում' | 'Վճարում' | string;
  amount: number;
  order: any;                 
  buyer: string;              
  sumDebet?: number;
  kredit?: number;
};
