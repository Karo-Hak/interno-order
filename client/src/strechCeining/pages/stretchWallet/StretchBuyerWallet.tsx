import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { allStretchBuyerThunk, StretchBuyerModel } from '../../features/StrechBuyer/strechBuyerApi';
import { StretchBuyerTable } from './components/StretchBuyerTable';
import { StretchMenu } from '../../../component/menu/StretchMenu';

export const StretchBuyerWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const [rows, setRows] = React.useState<StretchBuyerModel[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(allStretchBuyerThunk(cookies)).unwrap();
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err?.error || err?.message || 'Սխալ');
    } finally {
      setLoading(false);
    }
  }, [dispatch, cookies]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <StretchMenu />
      {loading && <div style={{ marginBottom: 8 }}>Բեռնվում է…</div>}
      <StretchBuyerTable rows={rows} onRefresh={load} />
    </div>
  );
};
