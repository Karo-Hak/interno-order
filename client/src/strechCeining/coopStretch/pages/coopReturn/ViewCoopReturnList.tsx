import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import ReturnToolbar from './components/ReturnToolbar';
import ReturnTable, { ReturnRow } from './components/ReturnTable';
import { listCoopReturns, deleteCoopReturn } from '../../features/coopReturn/coopReturnApi';

const ViewCoopReturnList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const [rows, setRows] = React.useState<ReturnRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [buyerQuery, setBuyerQuery] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(listCoopReturns({ cookies, from, to })).unwrap();
      setRows((data as any[]).map(x => ({
        _id: String(x._id),
        date: x.date,
        buyer: x.buyer ? {
          _id: String(x.buyer._id ?? ''),
          name: String(x.buyer.name ?? ''),
          phone1: String(x.buyer.phone1 ?? ''),
        } : undefined,
        order: x.order ? {
          _id: String(x.order._id ?? ''),
          date: x.order.date,
        } : undefined,
        amount: Number(x.amount || 0),
        reason: x.reason,
        comment: x.comment,
      })));
    } catch {
      alert('Չհաջողվեց բեռնել վերադարձները');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, cookies, from, to]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = React.useMemo(() => {
    const q = buyerQuery.trim().toLowerCase();
    return rows.filter(r =>
      !q ||
      (r?.buyer?.name ?? '').toLowerCase().includes(q) ||
      (r?.buyer?.phone1 ?? '').toLowerCase().includes(q)
    );
  }, [rows, buyerQuery]);

  const del = async (id: string) => {
    if (!window.confirm('Ջնջե՞լ վերադարձը')) return;
    try {
      await dispatch(deleteCoopReturn({ cookies, id })).unwrap();
      setRows(prev => prev.filter(r => r._id !== id));
    } catch (e: any) {
      alert(e?.message || 'Չստացվեց ջնջել');
    }
  };

  return (
    <div>
      <CoopStretchMenu />
      <ReturnToolbar
        loading={loading}
        from={from}
        to={to}
        buyerQuery={buyerQuery}
        setFrom={setFrom}
        setTo={setTo}
        setBuyerQuery={setBuyerQuery}
        onRefresh={load}
      />
      <div style={{ padding: '8px 8px 0', textAlign: 'right', fontWeight: 600 }}>
        Ընդհանուր ({filtered.length} վերադարձ)
      </div>
      <ReturnTable rows={filtered} loading={loading} onDelete={del} />
    </div>
  );
};

export default ViewCoopReturnList;
