import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../app/hooks';
import { deleteCredit } from '../../strechCeining/features/StrechBuyer/strechBuyerApi';

interface DeleteCreditProps {
  buyerId: string;
  creditSum: number;
  creditDate: string; 
  orderId: string;
}

const DeleteCredit: React.FC<DeleteCreditProps> = ({ buyerId, creditSum, creditDate, orderId }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const handleConfirmation = async () => {
    const isConfirmed = window.confirm('Հաստատ !!!!? Հեռացնելուց հետո անհնար կլինի վերականգնելը');
    if (!isConfirmed) return;

    try {
      const res = await dispatch(
        deleteCredit({ cookies, buyerId, creditSum, creditDate, orderId })
      ).unwrap();

      if (res && typeof res === 'object' && 'error' in res) {
        alert((res as any).error ?? 'Սխալ');
        return;
      }
      if (res && typeof res === 'object' && 'removed' in res) {
        alert((res as any).removed ? 'Կրեդիտը հեռացվեց' : 'Գրառում չի գտնվել');
        return;
      }

    } catch (err: any) {
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
