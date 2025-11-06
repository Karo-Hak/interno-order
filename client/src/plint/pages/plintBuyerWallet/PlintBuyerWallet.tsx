// src/plint/pages/plintBuyerWallet/PlintBuyerWallet.tsx
import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getPlintBuyers } from '../../features/plintBuyer/plintBuyerApi';
import { selectPlintBuyer } from '../../features/plintBuyer/plintBuyerSlice';
import PlintBuyerTable from './components/PlintBuyerTable';
import { PlintMenu } from '../../../component/menu/PlintMenu';

const PlintBuyerWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);
  const { items, loading } = useAppSelector(selectPlintBuyer);

  const load = React.useCallback(async () => {
    try {
      await dispatch(
        getPlintBuyers({
          cookies,
          q: '',
          skip: 0,
          limit: 999,
        })
      ).unwrap();
    } catch (err: any) {
      alert(err?.error || err?.message || 'Սխալ');
    }
  }, [dispatch, cookies]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <PlintMenu />
      {loading && <div style={{ marginBottom: 8 }}>Բեռնվում է…</div>}
      <PlintBuyerTable rows={items} onRefresh={load} />
    </div>
  );
};

export default PlintBuyerWallet;
