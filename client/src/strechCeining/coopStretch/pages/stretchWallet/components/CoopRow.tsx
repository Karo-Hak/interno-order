import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../../app/hooks';
import { DerivedBuyer, Buy, Credit } from './types';
import { fmtMoney } from './utils';
import { BuyerDetails } from './CoopDetails';
import AddCoopPayment from '../../../../../component/confirmButten/AddCoopPayment';
import { deleteCoopPaymentByDkId, deleteCoopPaymentByDateSum } from '../../../features/coopDebetKredit/coopDebetKreditApi';
import AddCoopReturnPayment from '../../../../../component/confirmButten/AddReturnPayment';

type Props = {
  r: DerivedBuyer;
  isOpen: boolean;
  toggle: () => void;
  onRowClick?: (id: string) => void;
  onPaymentDeleted?: () => void; 
};

const COLS = 12;

function toValidDate(d?: string | Date): Date {
  if (d instanceof Date) return d;
  if (typeof d === 'string' && d.trim()) {
    const dt = new Date(d);
    if (!Number.isNaN(dt.getTime())) return dt;
  }
  return new Date(0);
}

function toBuyRows(arr: any[] | undefined): Buy[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((b) => ({
    date: toValidDate(b?.date),
    sum : Number(b?.sum ?? 0),
    orderId: String(b?.orderId ?? b?.orderID ?? b?.order_id ?? b?._id ?? ''),
  }));
}

function toCreditRows(arr: any[] | undefined): Credit[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((c) => {
    const rawDk = c?.dkId ?? c?.dk_id ?? c?.dk ?? c?._id ?? c?.id ?? null;
    const rawRet = c?.returnId ?? c?.return_id ?? null;
    const type = c?.type as ('payment' | 'return' | undefined);

    return {
      date: toValidDate(c?.date),
      sum : Number(c?.sum ?? 0),
      dkId: rawDk ? String(rawDk) : undefined,
      returnId: rawRet ? String(rawRet) : undefined,
      type, // не обязателен; BuyerDetails работает по returnId/dkId
    };
  });
}

export const CoopRow: React.FC<Props> = ({ r, isOpen, toggle, onRowClick, onPaymentDeleted }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const handleRowClick = onRowClick ? () => onRowClick(r._id) : undefined;

  const lastOrderId: string | undefined = React.useMemo(() => {
    if (!Array.isArray(r.order) || r.order.length === 0) return undefined;
    const last = r.order[r.order.length - 1] as any;
    const id = typeof last === 'string' ? last : last?._id;
    return id ? String(id) : undefined;
  }, [r.order]);

  const buyRows    = React.useMemo(() => toBuyRows(r.buy), [r.buy]);
  const creditRows = React.useMemo(() => toCreditRows(r.credit), [r.credit]);

  const handleDeleteCredit = async (c: Credit, idx: number) => {
    const ok = typeof window !== 'undefined' && window.confirm('Ջնջե՞լ այս վճարումը');
    if (!ok) return;

    try {
      if (c.dkId) {
        await dispatch(deleteCoopPaymentByDkId({ cookies, dkId: c.dkId })).unwrap();
      } else {
        // fallback — удаление по дате/сумме
        const iso = (c.date instanceof Date ? c.date : new Date(c.date)).toISOString();
        await dispatch(deleteCoopPaymentByDateSum({ cookies, buyerId: r._id, date: iso, sum: c.sum })).unwrap();
      }
      onPaymentDeleted?.(); // ← дёрнем перезагрузку наверх
    } catch (e: any) {
      alert(e?.message || 'Չհաջողվեց ջնջել վճարումը');
    }
  };

  return (
    <>
      <tr
        style={onRowClick ? { cursor: 'pointer' } : undefined}
        onClick={handleRowClick}
      >
        <td onClick={(e) => e.stopPropagation()}>
          <input
            aria-label={`expand ${r.name}`}
            type="checkbox"
            checked={isOpen}
            onChange={toggle}
          />
        </td>
        <td>{r.name}</td>
        <td>{r.phone1}</td>
        <td>{r.region || '—'}</td>
        <td>{r.address || '—'}</td>
        <td>{r.ordersCount}</td>
        <td>{r.dkCount}</td>
        <td>{r.buyCount} / {fmtMoney(r.buySum)}</td>
        <td>{r.creditCount} / {fmtMoney(r.creditSum)}</td>
        <td style={{ fontWeight: 600 }}>{fmtMoney(r.total)}</td>
        <td onClick={(e) => e.stopPropagation()}>
          <AddCoopPayment buyerId={r._id} orderId={lastOrderId} />
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <AddCoopReturnPayment id={lastOrderId}  />
        </td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={COLS} style={{ background: '#fafafa' }}>
            <BuyerDetails
              buy={buyRows}
              credit={creditRows}
              buySum={r.buySum ?? 0}
              creditSum={r.creditSum ?? 0}
              total={r.total ?? 0}
              onDeleteCredit={handleDeleteCredit}
            />
          </td>
        </tr>
      )}
    </>
  );
};
