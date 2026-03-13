import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { addPlintAgentPayment } from '../../plint/features/plintWholesaleOrder/plintWholesaleOrderApi';

const AddPlintAgentPayment: React.FC<{
  agentId?: string;   
  buyerId?: string;   
  orderId?: string;
  onDone?: () => void;
}> = ({ agentId, buyerId, orderId, onDone }) => {
  const [cookies] = useCookies(['access_token']);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');

  const user = useAppSelector(selectUser);
  const userId: string = (user as any)?.profile?.userId ?? '';

  const submit = async () => {
    const v = Number.parseFloat(amount);
    if (!orderId) { alert('Պատվեր отсутствует'); return; }
    if (!agentId) { alert('Ագենտը բացակայում է'); return; }

    if (!Number.isFinite(v) || v <= 0) { alert('Մուտքագրեք ճիշտ գումար'); return; }
    try {
      await dispatch(
        addPlintAgentPayment({
          cookies,
          orderId,         
          amount: v,
          date: date || undefined,
          userId,
        })
      ).unwrap();
      setOpen(false);
      setAmount('');
      setDate('');
      onDone?.();
    } catch (e: any) {
      alert(e?.message || 'Չհաջողվեց ավելացնել վճարում (գործակալ)');
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ padding: '4px 10px' }}>
        Ավելացնել վճարում (Ագենտ)
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'grid', placeItems: 'center', zIndex: 30
    }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 12, width: 320, boxShadow: '0 10px 30px rgba(0,0,0,.2)' }}>
        <h4 style={{ margin: '4px 0 10px' }}>Նոր վճարում (Ագենտ)</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <input
            type="number"
            placeholder="Գումар, AMD"
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

export default AddPlintAgentPayment;
