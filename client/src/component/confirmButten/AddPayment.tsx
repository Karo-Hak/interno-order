import React from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addPayed } from '../../strechCeining/features/debetKredit/debetKreditApi';

type AddPaymentProps = {
  variant: 'tag' | 'coop';
  id?: string;
  onSuccess?: () => void; 
};

const AddPayment: React.FC<AddPaymentProps> = ({ variant, id, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);
  const params = useParams<{ id?: string }>();

  const handleConfirmation: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const orderId = id ?? params.id ?? '';
    if (!orderId) {
      alert('Order id not found');
      return;
    }

    const input = window.prompt('Մուտքագրեք գումարը');
    if (input === null) return; 
    const sumToSend = Number.parseFloat(input);
    if (!Number.isFinite(sumToSend) || sumToSend <= 0) {
      alert('միայն թիվ');
      return;
    }

    try {
      if (variant === 'tag') {
        await dispatch(
          addPayed({ cookies, id: orderId, sum: sumToSend })
        ).unwrap();
      }

      alert('Գրանցված');

     
      onSuccess?.();

    } catch (err: any) {
      alert(err?.message ?? 'Սխալ');
    }
  };

  return (
    <div>
      <button type="button" onClick={handleConfirmation}>
        Վճարում
      </button>
    </div>
  );
};

export default AddPayment;
