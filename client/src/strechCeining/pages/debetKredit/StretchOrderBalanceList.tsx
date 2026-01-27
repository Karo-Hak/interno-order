import React, { FC, useState } from 'react';
import AddPayment from '../../../component/confirmButten/AddPayment';

interface StretchOrders {
  _id: string;
  date: string;
  buyer: {
    buyerName?: string;
    buyerPhone1?: string;
    region?: string;
    address?: string;
  };
  prepayment: number;
  balance: number;
  groundTotal: number;
  address: string;
  region: string;
}

interface DebetKreditSectionProps {
  parseDate: (date: string) => string;
  orders: StretchOrders[];
  onReloadOrders?: () => void; // 👈 новый проп
}

const StretchOrderBalanceList: FC<DebetKreditSectionProps> = ({
  parseDate,
  orders,
  onReloadOrders,
}) => {
  const [showOrderMaterialList, setShowOrderMaterialList] = useState<{ [key: string]: boolean }>(() => {
    const initialState: { [key: string]: boolean } = {};
    orders.forEach((order: StretchOrders) => {
      initialState[order._id] = false;
    });
    return initialState;
  });

  const toggleOrderMaterialList = (orderId: string) => {
    setShowOrderMaterialList(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const isOrderMaterialListVisible = (orderId: string) => {
    return showOrderMaterialList[orderId];
  };

  function viewOrder(id: string) {
    window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
  }

  return (
    <div>
      {orders.length > 0 && (
        <div>
          <div className='newStretchOrderSection_head'>
            <div className='newStretchOrderSection_head_name'>
              Ձգվող առաստաղ (Դեբետ/Կրեդիտ)
            </div>
          </div>
          <div>
            <table className="newStretchOrders">
              <thead>
                <tr>
                  <th></th>
                  <th>Ամսաթիվ</th>
                  <th>Անուն Ազգանուն</th>
                  <th>Հեռախոս</th>
                  <th>Հասցե</th>
                  <th>Գնում</th>
                  <th>Վճարում</th>
                  <th>Մնացորդ</th>
                  <th>Մուտք</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((e: StretchOrders) => (
                  <React.Fragment key={e._id}>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!isOrderMaterialListVisible(e._id)}
                          onChange={() => toggleOrderMaterialList(e._id)}
                        />
                      </td>
                      <td><p>{parseDate(e.date)}</p></td>
                      <td><p>{e.buyer.buyerName}</p></td>
                      <td>
                        <div style={{ display: "flex", border: "none", gap: "5px" }}>
                          <p style={{ minWidth: "100px" }}>{e.buyer.buyerPhone1}</p>
                        </div>
                      </td>
                      <td><p>{e.region} / {e.address}</p></td>
                      <td><p>{e.balance}</p></td>
                      <td><p>{e.prepayment}</p></td>
                      {e.groundTotal <= 0 ? (
                        <td style={{ backgroundColor: "lightgreen" }}>
                          <p>{e.groundTotal}</p>
                        </td>
                      ) : (
                        <td style={{ backgroundColor: "red" }}>
                          <p>{e.groundTotal}</p>
                        </td>
                      )}
                      <td>
                        <AddPayment
                          id={e._id.toString()}
                          variant="tag"
                          onSuccess={onReloadOrders} // 👈 сюда
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StretchOrderBalanceList;
