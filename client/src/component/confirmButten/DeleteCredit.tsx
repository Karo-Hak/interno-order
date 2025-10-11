import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../app/hooks';
import { deleteCredit } from '../../strechCeining/features/StrechBuyer/strechBuyerApi';

interface DeleteCreditProps {
  buyerId: string;
  creditSum: number;
  creditDate: string; // лучше ISO
}

const DeleteCredit: React.FC<DeleteCreditProps> = ({ buyerId, creditSum, creditDate }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const handleConfirmation = async () => {
    const isConfirmed = window.confirm('Հաստատ !!!!? Հեռացնելուց հետո անհնար կլինի վերականգնելը');
    if (!isConfirmed) return;

    try {
      const res = await dispatch(
        deleteCredit({ cookies, buyerId, creditSum, creditDate })
      ).unwrap();

      // безопасная проверка, чтобы TS не ругался на `in`
      if (res && typeof res === 'object' && 'error' in res) {
        alert((res as any).error ?? 'Սխալ');
        return;
      }
      if (res && typeof res === 'object' && 'removed' in res) {
        alert((res as any).removed ? 'Կրեդիտը հեռացվեց' : 'Գրառում չի գտնվել');
        return;
      }

      alert('Անսպասելի պատասխան սերվերից');
    } catch (err: any) {
      // unwrap бросает при rejectWithValue
      const msg = err?.error || err?.message || 'Սերվերի սխալ';
      alert(msg);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleConfirmation}>Հեռացնել</button>
    </div>
  );
};

export default DeleteCredit;
