import React from 'react';
import { Link } from 'react-router-dom';
import { fmtMoney } from './utils';
import type { Buy, Credit } from './types';

type Props = {
  buy: Buy[];
  credit: Credit[];
  buySum: number;
  creditSum: number;
  total: number;
  onDeleteCredit?: (c: Credit, index: number) => void;
  buildReturnLink?: (returnId: string) => string;
};

export const BuyerDetails: React.FC<Props> = ({
  buy, credit, buySum, creditSum, total, onDeleteCredit, buildReturnLink,
}) => {
  const del = (c: Credit, idx: number) => () => onDeleteCredit?.(c, idx);

  const mkReturnLink = (id: any) =>
    (buildReturnLink ? buildReturnLink(String(id)) : `/coopStretchceiling/return/${String(id)}`);

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        {/* Գնումներ */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Գնումներ</div>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Պատվեր</th>
              </tr>
            </thead>
            <tbody>
              {buy.map((b, i) => (
                <tr key={i}>
                  <td>{new Date(b.date).toLocaleString('hy-AM')}</td>
                  <td >{fmtMoney(b.sum)}</td>
                  <td>
                    <Link to={`/coopStretchceiling/viewCoopStretchOrder/${b.orderId}`}>Դիտել</Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 700 }} colSpan={2}>Ընդհանուր</td>
                <td style={{ fontWeight: 700 }}>{fmtMoney(buySum)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Վճարումներ / Վերադարձներ /  Վեր․ Գումար */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Վճարումներ / Վերադարձներ / Վեր․ Գումար</div>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Տիպ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {credit.map((c, i) => {
                const anyC = c as any;
                const returnId = anyC.returnId;
                const dkId = anyC.dkId;
                const typeCrefit = anyC.type



                const isReturn = !!returnId;
                const isPayment = !isReturn && !!dkId && typeCrefit === "payment"; 
                const isReturnPayment = !isReturn && !!dkId && typeCrefit === "returnPayment";  

                return (
                  <tr key={i}>
                    <td>{new Date(c.date).toLocaleString('hy-AM')}</td>
                    <td style={{ textAlign: 'right' }}>{fmtMoney(c.sum)}</td>
                    <td>{isReturn ? 'Վերադարձ' : isPayment ? 'Վճարում' : isReturnPayment ? 'Վճ․ Գումար' : '-'}</td>
                    <td style={{ width: 1, whiteSpace: 'nowrap' }}>
                      {isReturn ? (
                        <Link
                          to={mkReturnLink(returnId)}
                          title="Դիտել վերադարձը"
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            border: '1px solid #b7d7f5',
                            background: '#eef6ff',
                            borderRadius: 6,
                            textDecoration: 'none',
                          }}
                        >
                          Դիտել վերադարձը
                        </Link>
                      ) : isPayment ? (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); del(c, i)(); }}
                          title="Ջնջել վճարումը"
                          style={{
                            padding: '2px 8px',
                            border: '1px solid #f2b1b1',
                            background: '#ffecec',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          Ջնջել
                        </button>
                      ) : <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); del(c, i)(); }}
                        title="Ջնջել վճարումը"
                        style={{
                          padding: '2px 8px',
                          border: '1px solid #f2b1b1',
                          background: '#ffecec',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Ջնջել
                      </button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>Ընդհանուր</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmtMoney(creditSum)}</td>
                <td />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 8, textAlign: 'right', fontWeight: 700 }}>
        Մնացորդ: {fmtMoney(total)}
      </div>
    </div>
  );
};
