import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  FieldValues, // 👈 добавили
} from 'react-hook-form';
import BuyerSection from '../../addCoopCeilingOrder/components/BuyerSection';

type BuyerShort = { _id: string; name: string; phone1?: string };

type Props<TFormValues extends FieldValues> = {
  buyerMode: 'existing' | 'new';
  setBuyerMode: (m: 'existing' | 'new') => void;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  buyers: BuyerShort[];
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  onlyExisting?: boolean;
};

function ReturnBuyerBlock<TFormValues extends FieldValues>(props: Props<TFormValues>) {
  const { onlyExisting, ...rest } = props;
  return (
    <div className="card dense">
      <BuyerSection
        {...(rest as any)}
        hideNewBuyer={onlyExisting}
      />
    </div>
  );
}

export default ReturnBuyerBlock;
