import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopBuyerTable } from './components/CoopBuyerTable';
import { allCoopBuyerThunk, CoopStretchBuyerModel } from '../../features/coopStrechBuyer/coopStrechBuyerApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';

export const CoopBuyerWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const [rows, setRows] = React.useState<CoopStretchBuyerModel[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(allCoopBuyerThunk(cookies)).unwrap();
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
      <CoopStretchMenu />
      {loading && <div style={{ marginBottom: 8 }}>Բեռնվում է…</div>}
      <CoopBuyerTable rows={rows} onRefresh={load} />
    </div>
  );
};
