import React, { FC, useEffect, useState } from 'react';
import DeleteCredit from '../../../component/confirmButten/DeleteCredit';
import { DebetKreditItem } from '../../features/debetKredit/typs/typsDK';

type Props = {
  order: ReadonlyArray<DebetKreditItem>;
  parseDate: (date: string) => string;
};

export const BuyerDebetKreditSection: FC<Props> = ({ order, parseDate }) => {
  const [kredit, setKredit] = useState(0);
  const [debet, setDebet] = useState(0);

  useEffect(() => {
    let k = 0, d = 0;
    order?.forEach((e) => {
      if (e.type === 'Գնում') k += e.amount;
      else d += e.amount;
    });
    setKredit(k);
    setDebet(d);
  }, [order]);

  const viewOrder = (id: string) => {
    window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
  };

  if (!order?.length) return null;

  return (
    <tr style={{ marginTop: '15px' }}>
      <td colSpan={11}>
        <div style={{ margin: '15px', border: '3px solid black', width: '500px' }}>
          <table className="tableName">
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գնում</th>
                <th>Վճարում</th>
                <th>Դիտել</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {order.map((e, i) => {
                const orderId = String((e as any).order?._id ?? e.order ?? '');
                const key = e._id ?? `${orderId}_${i}_${e.amount}_${String(e.date)}`;
                return (
                  <tr key={key}>
                    <td>{parseDate(String(e.date))}</td> {/* ← тут БЕЗ лишней скобки */}
                    <td>{e.type === 'Գնում' ? e.amount : ''}</td>
                    <td>{e.type === 'Վճարում' ? e.amount : ''}</td>
                    <td>
                      <button type="button" className="btn" style={{ color: 'black' }} onClick={() => viewOrder(orderId)}>
                        Ավելին
                      </button>
                    </td>
                    <td>
                      {e.type !== 'Գնում' && (
                        <DeleteCredit
                          buyerId={e.buyer}
                          creditSum={e.amount}
                          creditDate={String(e.date)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Ընդամենը ( )</td>
                <td>{kredit}</td>
                <td>{debet}</td>
                <td>{kredit - debet}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};
