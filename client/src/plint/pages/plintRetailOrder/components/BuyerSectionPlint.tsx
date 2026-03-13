import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { BuyerMode, FormValues } from '../RetailOrderPage';

type BuyerShort = { _id: string; name: string; phone1?: string };

export type BuyerSectionPlintProps = {
  buyerMode: BuyerMode;
  setBuyerMode: (m: BuyerMode) => void;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  buyers: BuyerShort[];
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
};

const BuyerSectionPlint: React.FC<BuyerSectionPlintProps> = ({
  buyerMode,
  setBuyerMode,
  register,
  errors,
  buyers,
  setValue,
  watch,
}) => {
  const [query, setQuery] = React.useState('');
  const selectedBuyerId = watch('buyerId');

  const normalized = (s: string) => s.toLowerCase().trim();
  const filtered = React.useMemo(() => {
    const q = normalized(query);
    if (!q) return buyers.slice(0, 20);
    return buyers
      .filter((b) =>
        [b.name, b.phone1 ?? ''].map(normalized).some((x) => x.includes(q)),
      )
      .slice(0, 20);
  }, [buyers, query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const exact = buyers.find(
      (b) => `${b.name} ${b.phone1 ?? ''}`.trim().toLowerCase() === val.trim().toLowerCase(),
    );
    if (exact) {
      setValue('buyerId', exact._id, { shouldDirty: true });
    }
  };

  const clearSelection = () => {
    setQuery('');
    setValue('buyerId', '', { shouldDirty: true });
  };

  return (
    <section className="card" style={{ padding: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
        <strong>Գնորդ / Buyer</strong>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" value="existing" checked={buyerMode === 'existing'} onChange={() => setBuyerMode('existing')} />
          Existing
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" value="new" checked={buyerMode === 'new'} onChange={() => setBuyerMode('new')} />
          New
        </label>
      </div>

      {buyerMode === 'existing' ? (
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr auto' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <input
              list="plint-buyer-list"
              placeholder="Search by name or phone…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
            <datalist id="plint-buyer-list">
              {filtered.map((b) => (
                <option key={b._id} value={`${b.name} ${b.phone1 ?? ''}`.trim()} />
              ))}
            </datalist>

            <input type="hidden" {...register('buyerId', { required: buyerMode === 'existing' })} />
            {errors.buyerId && <span style={{ color: 'crimson' }}>Ընտրեք գնորդին ցանկից</span>}

            {!!selectedBuyerId && (
              <small style={{ opacity: 0.7 }}>
                Selected ID: <code>{selectedBuyerId}</code>
              </small>
            )}
          </div>
          <button type="button" onClick={clearSelection}>Clear</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          <input placeholder="Անուն" {...register('buyer.name', { required: true, minLength: 2, maxLength: 200 })} />
          <input placeholder="Հեռ․ 1" {...register('buyer.phone1', { required: true, pattern: /^[0-9+()\-\s]{6,20}$/ })} />
          <input placeholder="Հեռ․ 2" {...register('buyer.phone2', { pattern: /^[0-9+()\-\s]{6,20}$/ })} />
          <input placeholder="Մարզ" {...register('buyer.region', { maxLength: 120 })} />
          <input placeholder="Հասցե" {...register('buyer.address', { maxLength: 300 })} style={{ gridColumn: '1 / span 2' }} />
          {(errors?.buyer?.name || errors?.buyer?.phone1) && (
            <span style={{ color: 'crimson' }}>Անունը և Հեռ․ 1 պարտադիր են</span>
          )}
        </div>
      )}
    </section>
  );
};

export default BuyerSectionPlint;
