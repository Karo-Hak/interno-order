import React from 'react';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldValues, // 👈
} from 'react-hook-form';
import PhotoUrls from '../../addCoopCeilingOrder/components/PhotoUrls';

type Props<TFormValues extends FieldValues> = {
  register: UseFormRegister<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  total: number;
};

function ReturnSidebar<TFormValues extends FieldValues>({
  register, setValue, watch, total,
}: Props<TFormValues>) {
  return (
    <aside className="col-side">
      <div className="card dense">
        <PhotoUrls
          register={register as any}
          setValue={setValue as any}
          watch={watch as any}
        />
      </div>

      <div className="card dense">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>Ընդհանուր վերադարձ</span>
          <span>{total.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}

export default ReturnSidebar;
