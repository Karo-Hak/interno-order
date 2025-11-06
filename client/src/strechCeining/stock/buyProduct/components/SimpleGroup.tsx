// src/strechCeining/coopStretch/pages/addCoopCeilinOrder/components/SimpleGroup.tsx
import React from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { FormValues } from '../BuyProduct';

export type SimpleRow = {
  sku: string;
  itemId?: string;
  name: string;
  qty: number;
};

type CatalogItem = { _id: string; name: string};

type GroupName =
  | 'groupedStretchProfilData'
  | 'groupedLightPlatformData'
  | 'groupedLightRingData';

type Props = {
  title: string;
  control: Control<FormValues>;
  name: GroupName;
  catalog: CatalogItem[];

  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
};

const SimpleGroup: React.FC<Props> = ({
  title,
  control,
  name,
  catalog,
  setValue,
  getValues,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  const byId = React.useMemo(() => {
    const m = new Map<string, CatalogItem>();
    catalog.forEach(c => m.set(c._id, c));
    return m;
  }, [catalog]);

  const addRow = () =>
    append({ itemId: '', name: '', qty: 0, sku: '' });
  
  const recalcDerived = (idx: number) => {
    const base = getValues(`${name}.${idx}`) as SimpleRow | undefined;
    if (!base) return;
    const qty = Number(base.qty) || 0;
  };

  const onSelectItem = (idx: number, itemId: string) => {
    const item = byId.get(itemId);
    setValue(`${name}.${idx}.itemId`, itemId, { shouldDirty: true, shouldValidate: false });
    setValue(`${name}.${idx}.name`, item?.name ?? '', { shouldDirty: true, shouldValidate: false });
    recalcDerived(idx);
  };

  return (
    <section className="card" >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        <button type="button" onClick={addRow}>+ Add row</button>
      </div>

      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
            <tr>
              <th style={{ textAlign: 'left' }}>Item</th>
              <th>Qty</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.map((f, idx) => (
              <tr key={f.id}>
                <td>
                  <Controller
                    name={`${name}.${idx}.itemId` as const}
                    control={control}
                    defaultValue={(f as any).itemId || ''}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => onSelectItem(idx, e.target.value)}
                      >
                        <option value="">— select —</option>
                        {catalog.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <Controller
                    name={`${name}.${idx}.name` as const}
                    control={control}
                    defaultValue={(f as any).name || ''}
                    render={({ field }) => (
                      <input type="hidden" {...field} readOnly style={{ marginTop: 4, opacity: 0.8 }} />
                    )}
                  />
                </td>

                <td style={{ width: 10 }}>
                  <Controller
                    name={`${name}.${idx}.qty` as const}
                    control={control}
                    defaultValue={(f as any).qty ?? 0}
                    render={({ field }) => (
                      <input
                        className='inputButton'
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="1"
                        {...field}
                        onChange={(e) => {
                          const v = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(v === '' ? '' : (Number.isFinite(v) ? v : 0));
                          recalcDerived(idx);
                        }}
                      />
                    )}
                  />
                </td>

                <td style={{ width: 60, textAlign: 'right' }}>
                  <button type="button" onClick={() => remove(idx)}>✕</button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr><td colSpan={5} style={{ opacity: 0.6, padding: 8 }}>No rows</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SimpleGroup;
