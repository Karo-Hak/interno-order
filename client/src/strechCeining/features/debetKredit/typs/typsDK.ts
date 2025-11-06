// Общий тип для движений дебет/кредит
export type DebetKreditItem = {
  _id?: string;                // может отсутствовать
  date: string | Date;
  type: 'Գնում' | 'Վճարում' | string;
  amount: number;
  order: any;                  // строка или объект {_id}
  buyer: string;               // buyerId
  sumDebet?: number;
  kredit?: number;
};
