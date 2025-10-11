import React from 'react';
import { DerivedBuyer } from './types';
import { fmtMoney } from './utils';
import { BuyerDetails } from './BuyerDetails';

type Props = {
  r: DerivedBuyer;
  isOpen: boolean;
  toggle: () => void;
  onRowClick?: (id: string) => void;
};

export const BuyerRow: React.FC<Props> = ({ r, isOpen, toggle, onRowClick }) => {
  const handleCellClick = onRowClick ? () => onRowClick(r._id) : undefined;

  return (
    <>
      <tr
        style={onRowClick ? { cursor: 'pointer' } : undefined }
        onClick={handleCellClick}
      >
        <td onClick={(e) => e.stopPropagation()}>
          <input
            aria-label={`expand ${r.buyerName}`}
            type="checkbox"
            checked={isOpen}
            onChange={toggle}
          />
        </td>
        <td>{r.buyerName}</td>
        <td>{r.buyerPhone1}</td>
        <td>{r.buyerPhone2}</td>
        <td>{r.buyerRegion || '—'}</td>
        <td>{r.buyerAddress || '—'}</td>
        <td>{r.ordersCount}</td>
        <td>{r.dkCount}</td>
        <td>{r.buyCount} / {fmtMoney(r.buySum)}</td>
        <td>{r.creditCount} / {fmtMoney(r.creditSum)}</td>
        <td style={{ fontWeight: 600 }}>{fmtMoney(r.total)}</td>
      </tr>

      {isOpen && (
        <tr>
          <BuyerDetails
            buy={r.buy}
            credit={r.credit}
            buySum={r.buySum}
            creditSum={r.creditSum}
            total={r.total}
          />
        </tr>
      )}
    </>
  );
};
