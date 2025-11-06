import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../wholesaleOrderPage';

type Props = {
  total: number;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const round2 = (n: number) =>
  Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 100) / 100 : 0;

const PaymentSectionPlint: React.FC<Props> = ({ total, register, setValue }) => {
  React.useEffect(() => {
    setValue('balance', round2(total), { shouldValidate: true, shouldDirty: true });
  }, [total, setValue]);

  const display = round2(total).toFixed(2);

  return (
    <section className="card" style={{ padding: 12, marginBottom: 12 }}>
      <h3>Վճարում / Payment</h3>

      <div>
        <div style={{ margin: 10 }}>
          <label>Balance (auto = Total)</label>
          <input value={display} readOnly />
        </div>

        <input type="hidden" {...register('balance', { valueAsNumber: true })} />

        <div style={{ margin: 10 }}>
          <label>Payment method</label>
          <select {...register('paymentMethod')}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ margin: 10 }}>
          <label>Date</label>
          <input type="datetime-local" {...register('date')} />
        </div>

        <div style={{ margin: 10 }}>
          <label>Comment</label>
          <input placeholder="Buyer comment" {...register('buyerComment')} />
        </div>
      </div>
    </section>
  );
};

export default PaymentSectionPlint;
