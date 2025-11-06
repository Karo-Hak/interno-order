import React from 'react';
import { DerivedPlintBuyer, PlintBuyEntry, PlintCreditEntry } from './typesPlint';
import { fmtMoney, toId, toSafeDate } from './utilsPlint';
import PlintBuyerDetails from './PlintBuyerDetails';
import { useAppDispatch } from '../../../../app/hooks';
import { useCookies } from 'react-cookie';
import { deletePaymentByDateSum } from '../../../features/plintBuyer/plintBuyerApi';
import { Credit } from '../../../../strechCeining/coopStretch/pages/stretchWallet/components/types';

const COLS = 11;

function toBuyRows(retail?: any[], wholesale?: any[]): PlintBuyEntry[] {
  const out: PlintBuyEntry[] = [];

  const pushArr = (type: 'retail' | 'wholesale', arr?: any[]) => {
    if (!Array.isArray(arr)) return;
    for (const it of arr.filter(Boolean)) {
      out.push({
        type,
        date: toSafeDate(it?.date),
        sum: Number(it?.amount ?? 0),
        orderId: toId(it?.orderId ?? it?.orderID ?? it?.order_id ?? it?._id ?? ''),
      });
    }
  };

  pushArr('retail', retail);
  pushArr('wholesale', wholesale);

  out.sort((a, b) => b.date.getTime() - a.date.getTime());
  return out;
}


function toCreditRows(src?: any[]): PlintCreditEntry[] {
  if (!Array.isArray(src)) return [];
  const rows = src
    .filter(Boolean)
    .map((c) => ({
      date: toSafeDate(c?.date),
      sum: Number(c?.amount ?? 0),
      note: c?.note ?? '',
    }));
  rows.sort((a, b) => b.date.getTime() - a.date.getTime());
  return rows;
}

type Props = {
  r: DerivedPlintBuyer;
  isOpen: boolean;
  toggle: () => void;
  onPaymentDeleted?: () => void;
};

const PlintRow: React.FC<Props> = ({ r, isOpen, toggle, onPaymentDeleted }) => {

  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const buyRows = React.useMemo(
    () => toBuyRows(r.buyRetail, r.buyWholesale),
    [r.buyRetail, r.buyWholesale]
  );


  const creditRows = React.useMemo(
    () => toCreditRows(r.credit),
    [r.credit]
  );

  const rows: JSX.Element[] = [];

  const handleDeleteCredit = async (c: Credit, idx: number) => {
    const ok = typeof window !== 'undefined' && window.confirm('Ջնջե՞լ այս վճարումը');
    if (!ok) return;
    try {
      const iso = (c.date instanceof Date ? c.date : new Date(c.date)).toISOString();
      await dispatch(deletePaymentByDateSum({ cookies, buyerId: r._id, date: iso, sum: c.sum })).unwrap();
      onPaymentDeleted?.(); 
    } catch (e: any) {
      alert(e?.message || 'Չհաջողվեց ջնջել վճարումը');
    }
  };
  rows.push(
    <tr key={`${r._id}__main`}>
      <td>
        <input
          aria-label={`expand ${r.name}`}
          type="checkbox"
          checked={isOpen}
          onChange={toggle}
        />
      </td>
      <td>{r.name}</td>
      <td>{r.phone1 || '—'}</td>
      <td>{r.phone2 || '—'}</td>
      <td>{r.region || '—'}</td>
      <td>{r.address || '—'}</td>
      <td>{r.ordersCount}</td>
      <td>{r.dkCount}</td>
      <td>
        {r.buyCount} / {fmtMoney(r.buySum)}
      </td>
      <td>
        {r.creditCount} / {fmtMoney(r.creditSum)}
      </td>
      <td style={{ fontWeight: 600 }}>{fmtMoney(r.total)}</td>
    </tr>
  );

  if (isOpen) {
    rows.push(
      <tr key={`${r._id}__details`}>
        <td colSpan={COLS} style={{ background: '#fafafa' }}>
          <PlintBuyerDetails
            buy={buyRows}
            credit={creditRows}
            buySum={r.buySum ?? 0}
            creditSum={r.creditSum ?? 0}
            total={r.total ?? 0}
             onDeleteCredit={handleDeleteCredit}
          />
        </td>
      </tr>
    );
  }

  return rows as unknown as JSX.Element;
};

export default PlintRow;
