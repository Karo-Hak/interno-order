export const DebetKreditSearchLogic = (
  ordersListFilter: Array<any>,
  status: string,
  ordersList: Array<any>,
  setOrdersList: (rows: any[]) => void,
  searchBuyer: string
) => {
  let resultOrders = ordersListFilter;

  if (searchBuyer !== '') {
    const q = searchBuyer.toLowerCase();
    resultOrders = resultOrders.filter((el: any) =>
      el?.buyerName?.toLowerCase?.().includes(q) ||
      el?.buyerPhone1?.toLowerCase?.().includes(q) ||
      el?.buyerPhone2?.toLowerCase?.().includes(q)
    );
  }

  setOrdersList(resultOrders);
  return { ordersList: resultOrders };
};
