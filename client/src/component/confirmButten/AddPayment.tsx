// AddPayment.tsx
import React from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addPayed } from '../../strechCeining/features/debetKredit/debetKreditApi';

type AddPaymentProps = {
  variant: 'tag' | 'coop';
  id?: string;
  onSuccess?: () => void;   // 👈 новый проп
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

    const input = window.prompt('Введите сумму платежа');
    if (input === null) return; // Отмена
    const sumToSend = Number.parseFloat(input);
    if (!Number.isFinite(sumToSend) || sumToSend <= 0) {
      alert('Сумма должна быть положительным числом');
      return;
    }

    try {
      if (variant === 'tag') {
        await dispatch(
          addPayed({ cookies, id: orderId, sum: sumToSend })
        ).unwrap();
      }

      alert('Պлатёж проведён');

      // 👉 говорим родителю "обнови данные"
      onSuccess?.();

    } catch (err: any) {
      alert(err?.message ?? 'Ошибка при проведении платежа');
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
