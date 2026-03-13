import React from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addCoopReturnPayed } from '../../strechCeining/coopStretch/features/coopDebetKredit/coopDebetKreditApi';

export type AddReturnPaymentProps = {
  id?: string;                 
  disabled?: boolean;          
  className?: string;          
  onDone?: () => void;         
};

const AddCoopReturnPayment: React.FC<AddReturnPaymentProps> = ({
  id,
  disabled,
  className,
  onDone,
}) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);
  const params = useParams<{ id?: string }>();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation(); 
    if (disabled) return;

    const orderId = id ?? params.id ?? '';
    if (!orderId) {
      window.alert('Order id not found');
      return;
    }

    const raw = window.prompt('Մուտքագրեք գումարը');
    if (raw === null) return; 
    const sum = Number.parseFloat((raw ?? '').toString().trim());
    if (!Number.isFinite(sum) || sum <= 0) {
      window.alert('միայն դրական թիվ');
      return;
    }

    try {
      await dispatch(
        addCoopReturnPayed({ cookies, id: orderId, sum })
      ).unwrap();

      window.alert('Գրանցված');
      onDone?.();
    } catch (err: any) {
      window.alert(err?.message ?? 'Սխալ');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      title={!id && !params.id ? 'Պատվերը բացակայում է' : undefined}
      style={{ padding: '4px 10px', borderRadius: 6 }}
    >
      Վճարում
    </button>
  );
};

export default AddCoopReturnPayment;
