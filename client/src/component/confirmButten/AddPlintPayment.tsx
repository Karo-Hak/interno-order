import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';

// retail
import { addPlintOrderPayment as addRetailPayment } from '../../plint/features/plintRetailOrder/plintRetailOrderApi';
// wholesale
import { addPlintWholesaleOrderPayment as addWholesalePayment } from '../../plint/features/plintWholesaleOrder/plintWholesaleOrderApi';

type Kind = 'retail' | 'wholesale';

const AddPlintPayment: React.FC<{
  id?: string;
  onDone?: () => void;
  kind: Kind;                     
}> = ({ id, onDone, kind }) => {
  const [cookies] = useCookies(['access_token']);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');

  const userFromStore = useAppSelector(selectUser);
  const userId: string = (userFromStore as any)?.profile?.userId ?? '';

  const submit = async () => {
    if (!id) return;
    const v = Number.parseFloat(amount);
    if (!Number.isFinite(v) || v <= 0) {
      alert('Մուտքագրեք ճիշտ գումար');
      return;
    }
    try {
      if (kind === 'retail') {
        await dispatch(
          addRetailPayment({ cookies, id, amount: v, date: date || undefined, userId })
        ).unwrap();
      } else {
        await dispatch(
          addWholesalePayment({ cookies, id, amount: v, date: date || undefined, userId })
        ).unwrap();
      }
      setOpen(false);
      setAmount('');
      setDate('');
      onDone?.();
    } catch (e: any) {
      alert(e?.message || 'Չհաջողվեց ավելացնել վճարում');
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ padding: '4px 10px' }}>
        Ավելացնել վճարում
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'grid', placeItems: 'center', zIndex: 30
    }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 12, width: 320, boxShadow: '0 10px 30px rgba(0,0,0,.2)' }}>
        <h4 style={{ margin: '4px 0 10px' }}>
          Նոր վճարում ({kind === 'retail' ? 'Retail' : 'Wholesale'})
        </h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <input
            type="number"
            placeholder="Գումար, AMD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setOpen(false)}>Փակել</button>
            <button type="button" onClick={submit}>Ավելացնել</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlintPayment;
