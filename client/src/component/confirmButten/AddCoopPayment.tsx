// ✅ AddCoopPayment.tsx
import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCoopPayed } from '../../strechCeining/coopStretch/features/coopDebetKredit/coopDebetKreditApi';
import { selectUser } from '../../features/user/userSlice';

export type AddCoopPaymentProps = {
  buyerId: string;          // ✅ ОБЯЗАТЕЛЬНО
  orderId?: string;         // ✅ ОПЦИОНАЛЬНО
  disabled?: boolean;
  className?: string;
  onDone?: () => void;
};

const AddCoopPayment: React.FC<AddCoopPaymentProps> = ({
  buyerId,
  orderId,
  disabled,
  className,
  onDone,
}) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);
  const user = useAppSelector(selectUser);
  console.log(user.profile.userId);


  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    if (disabled) return;

    if (!buyerId) {
      window.alert('Buyer id not found');
      return;
    }

    const raw = window.prompt('Введите сумму платежа');
    if (raw === null) return;

    const sum = Number.parseFloat(String(raw ?? '').trim());
    if (!Number.isFinite(sum) || sum <= 0) {
      window.alert('Сумма должна быть положительным числом');
      return;
    }

    try {
      await dispatch(
        addCoopPayed({
          cookies,
          buyerId,
          sum,
          ...(orderId ? { id: orderId } : {}),
        })
      ).unwrap();

      window.alert('Վճարումը հաջողությամբ կատարվեց');
      onDone?.();
    } catch (err: any) {
      window.alert(err?.message ?? err ?? 'Ошибка при проведении платежа');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{ padding: '4px 10px', borderRadius: 6 }}
      title={orderId ? undefined : 'Վճարում առանց պատվերի'}
    >
      Վճարում
    </button>
  );
};

export default AddCoopPayment;
