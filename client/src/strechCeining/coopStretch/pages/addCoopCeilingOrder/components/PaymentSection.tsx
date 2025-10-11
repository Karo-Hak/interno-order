import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../AddCoopCeilinOrder';

type Props = {
  total: number; // вычисленный total приходит сверху
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const round2 = (n: number) =>
  Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 100) / 100 : 0;

const PaymentSection: React.FC<Props> = ({ total, register, setValue }) => {
  // Синхронизируем balance с total при каждом изменении total
  React.useEffect(() => {
    const v = round2(total);
    setValue('balance', v, { shouldValidate: true, shouldDirty: true });
  }, [total, setValue]);

  const display = round2(total).toFixed(2);

  return (
    <section className="card" style={{ padding: 12, marginBottom: 12 }}>
      <h3>Վճարում / Payment</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {/* Отображаемое поле: всегда равно total, readOnly */}
        <div>
          <label>Balance (auto = Total)</label>
          <input value={display} readOnly />
        </div>

        {/* Скрытое "истинное" поле формы, чтобы balance попал в submit */}
        <input
          type="hidden"
          {...register('balance', { valueAsNumber: true })}
        />

        <div>
          <label>Payment method</label>
          <select {...register('paymentMethod')}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <input type="datetime-local" {...register('date')} />
        </div>

        <div style={{ gridColumn: '1 / span 2' }}>
          <label>Comment</label>
          <input placeholder="Buyer comment" {...register('buyerComment')} />
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
