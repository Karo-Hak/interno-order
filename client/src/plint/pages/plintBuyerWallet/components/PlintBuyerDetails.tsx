import React from 'react';
import { fmtMoney } from './utilsPlint';
import { PlintBuyEntry, PlintCreditEntry } from './typesPlint';
import { useNavigate } from 'react-router-dom';
import { Credit } from '../../../../strechCeining/coopStretch/pages/stretchWallet/components/types';

type Props = {
  buy: PlintBuyEntry[];
  credit: PlintCreditEntry[];
  buySum: number;
  creditSum: number;
  total: number;
  onDeleteCredit?: (c: Credit, index: number) => void;
};

const PlintBuyerDetails: React.FC<Props> = ({
  buy,
  credit,
  buySum,
  creditSum,
  total,
  onDeleteCredit
}) => {
  let navigate = useNavigate();
  const del = (c: Credit, idx: number) => () => onDeleteCredit?.(c, idx);
  function viewOrder(type: string, id: string) {
    if (type === "retail") {
      navigate(`/plint/orders/view/${id}`)
    } else {
      navigate(`/plint/wholesale/orders/view/${id}`)
    }
  }

  return (
    <div style={{ padding: 8 }}>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Գնումներ */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Գնումներ</div>
          <table style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Պատվեր</th>
              </tr>
            </thead>
            <tbody>
              {buy.map((b, i) => (
                <tr key={`${b.orderId}-${b.date.getTime()}-${i}`}>
                  <td>{b.date.toLocaleString('hy-AM')}</td>
                  <td >{fmtMoney(b.sum)}</td>
                  <td>
                    <button className='btn' onClick={() => viewOrder(b.type, b.orderId)}>Դիտել</button>

                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 700 }} colSpan={2}>
                  Ընդհանուր
                </td>
                <td style={{ fontWeight: 700 }}>
                  {fmtMoney(buySum)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Վճարումներ */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Վճարումներ</div>
          <table style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Նշում</th>
              </tr>
            </thead>
            <tbody>
              {credit.map((c, i) => (
                <tr key={`${c.note ?? ''}-${c.date.getTime()}-${i}`}>
                  <td>{c.date.toLocaleString('hy-AM')}</td>
                  <td>{fmtMoney(c.sum)}</td>
                  <td> <button
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
                  </button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  Ընդհանուր
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  {fmtMoney(creditSum)}
                </td>
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

export default PlintBuyerDetails;
