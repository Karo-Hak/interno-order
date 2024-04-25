export const DebetKreditSearchLogic = (
  ordersListFilter: Array<object>,
  status: string,
  ordersList: Array<object>,
  setOrdersList: any,
  searchBuyer: string
) => {
  let resultOrders = ordersListFilter;


  if (searchBuyer !== "") {
    const normalizedSearchName = searchBuyer.toLowerCase();
    resultOrders = resultOrders.filter((element: any) =>
      element.buyerName.toLowerCase().includes(normalizedSearchName) ||
      element.buyerPhone1.toLowerCase().includes(normalizedSearchName) ||
      element.buyerPhone2.toLowerCase().includes(normalizedSearchName) 
    );
  }

  setOrdersList(resultOrders);

  return { ordersList: resultOrders };
};
