import React from 'react';
import { StretchBuyerEntry } from './types';
import { fmtDate, fmtMoney } from './utils';

type Props = {
  buy?: StretchBuyerEntry[];
  credit?: StretchBuyerEntry[];
  buySum: number;
  creditSum: number;
  total: number;
};

export const BuyerDetails: React.FC<Props> = ({ buy, credit, buySum, creditSum, total }) => {
  const sortedBuy = [...(buy ?? [])].sort((a, b) =>
    new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
  );
  const sortedCredit = [...(credit ?? [])].sort((a, b) =>
    new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
  );

  function viewOrder(id: string) {
    window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
  }

  return (
    <td colSpan={11} style={{ background: '#fafafa', padding: 12 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* BUY */}
        <div style={{ minWidth: 320, flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Գնումներ</div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Պատվեր</th>
              </tr>
            </thead>
            <tbody>
              {sortedBuy.length === 0 ? (
                <tr><td colSpan={3} style={{ opacity: 0.7 }}>—</td></tr>
              ) : sortedBuy.map((b, i) => (
                <tr key={`buy_${i}`}>
                  <td>{fmtDate(b.date)}</td>
                  <td>{fmtMoney(b.sum)}</td>
                  <td>
                    <button type='button' className='btn' style={{ color: "black" }}
                      onClick={() => viewOrder(b.orderId || '—')}>
                      Դիտել
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 600 }}>Ընդամենը</td>
                <td style={{ fontWeight: 600 }}>{fmtMoney(buySum)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CREDIT */}
        <div style={{ minWidth: 320, flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Վճարումներ</div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
              </tr>
            </thead>
            <tbody>
              {sortedCredit.length === 0 ? (
                <tr><td colSpan={2} style={{ opacity: 0.7 }}>—</td></tr>
              ) : sortedCredit.map((c, i) => (
                <tr key={`credit_${i}`}>
                  <td>{fmtDate(c.date)}</td>
                  <td>{fmtMoney(c.sum)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 600 }}>Ընդամենը</td>
                <td style={{ fontWeight: 600 }}>{fmtMoney(creditSum)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Итоги */}
      <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div>Մնացորդ (totalSum): <b>{fmtMoney(total)}</b></div>
        <div style={{ opacity: 0.7 }}>
          (Գնումներ − Վճարումներ = {fmtMoney(buySum - creditSum)})
        </div>
      </div>
    </td>
  );
};
