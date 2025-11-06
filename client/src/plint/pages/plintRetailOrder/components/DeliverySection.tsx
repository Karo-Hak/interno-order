import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '../RetailOrderPage';

type Props = {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const DeliverySection: React.FC<Props> = ({ register, watch }) => {
  const delivery = !!watch('delivery');

  return (
    <section>
      <h3 style={{ marginTop: 0 }}>Դիլիվերի / Доставка</h3>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" {...register('delivery')} />
          Պահանջվում է առաքում / Нужна доставка
        </label>
        <div />
        <input placeholder="Адрес доставки" {...register('deliveryAddress')} disabled={!delivery} />
        <input placeholder="Телефон доставки" {...register('deliveryPhone')} disabled={!delivery} />
        <div style={{ gridColumn: '1 / span 2' }}>
          <input placeholder="Сумма доставки" type="number" step="0.01" {...register('deliverySum', { valueAsNumber: true })} disabled={!delivery} />
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;
