export const PlintMaterialSearchLogic = (
  ordersListFilter: Array<object>,
  status: string,
  ordersList: Array<object>,
  setOrdersList: any,
  searchBuyer: string
) => {
  let resultOrders = ordersListFilter;

  if (status !== "") {
    resultOrders = ordersListFilter.filter((element: any) => element.status === status);
  }

  if (searchBuyer !== "") {
    const normalizedSearchName = searchBuyer.toLowerCase();
    resultOrders = resultOrders.filter((element: any) =>
      element.buyer.buyerName.toLowerCase().includes(normalizedSearchName) ||
      element.buyer.buyerPhone1.toLowerCase().includes(normalizedSearchName) ||
      element.buyer.buyerPhone2.toLowerCase().includes(normalizedSearchName) 
    );
  }

  setOrdersList(resultOrders);

  return { ordersList: resultOrders };
};
