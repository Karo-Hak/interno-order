import React from 'react';
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { FormValues } from '../AddCoopCeilinOrder';

export type SimpleRow = {
  sku: string;
  itemId?: string;
  name: string;
  qty: number;
  price: number;
  sum: number;
  catalogQuery?: string;
};

type CatalogItem = { _id: string; name: string; price: number };

type GroupName =
  | 'groupedStretchProfilData'
  | 'groupedLightPlatformData'
  | 'groupedLightRingData'
  | 'groupedAdditionalData';

type Props = {
  title: string;
  control: Control<FormValues>;
  name: GroupName;
  catalog: CatalogItem[];
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
};

const toNum = (v: unknown, d = 0) => {
  const s = String(v ?? '').trim();
  if (s === '') return d;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : d;
};

const normalized = (s: string) => s.toLowerCase().trim();

const recalcRow = (row: SimpleRow): SimpleRow => {
  const qty = toNum(row.qty, 0);
  const price = toNum(row.price, 0);
  const sum = +(qty * price).toFixed(2);
  return { ...row, qty, price, sum };
};

const emptyRow = (): SimpleRow => ({
  sku: '',
  itemId: '',
  name: '',
  qty: 0,
  price: 0,
  sum: 0,
  catalogQuery: '',
});

const SimpleGroup: React.FC<Props> = ({
  title,
  control,
  name,
  catalog,
  setValue,
  getValues,
}) => {
  const byId = React.useMemo(() => {
    const m = new Map<string, CatalogItem>();
    catalog.forEach((c) => m.set(c._id, c));
    return m;
  }, [catalog]);

  const patchRow = (idx: number, patch: Partial<SimpleRow>) => {
    const rows = ((getValues(name) as SimpleRow[]) ?? []).slice();
    const base = rows[idx] ?? emptyRow();
    const nextRow = recalcRow({ ...base, ...patch } as SimpleRow);
    rows[idx] = nextRow;

    setValue(name, rows as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const onSelectItem = (idx: number, itemId: string) => {
    const item = byId.get(itemId);
    patchRow(idx, {
      itemId,
      name: item?.name ?? '',
      price: toNum(item?.price ?? 0, 0),
      catalogQuery: item ? `${item.name} (${item.price})` : '',
    });
  };

  const getFiltered = (query: string) => {
    const q = normalized(query);
    if (!q) return catalog.slice(0, 20);
    return catalog
      .filter((c) =>
        [c.name, String(c.price)]
          .map((x) => normalized(String(x)))
          .some((x) => x.includes(q)),
      )
      .slice(0, 20);
  };

  const handleQueryChange = (idx: number, val: string) => {
    patchRow(idx, { catalogQuery: val });

    const exact = catalog.find(
      (c) => `${c.name} (${c.price})`.trim().toLowerCase() === val.trim().toLowerCase(),
    );
    if (exact) onSelectItem(idx, exact._id);
  };

  const addRow = () => {
    const rows = (getValues(name) as SimpleRow[]) ?? [];
    const next: SimpleRow[] = [...rows, emptyRow()];
    setValue(name, next as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const removeRow = (idx: number) => {
    const rows = ((getValues(name) as SimpleRow[]) ?? []).slice();
    rows.splice(idx, 1);
    setValue(name, rows as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const rows: SimpleRow[] = (getValues(name) as SimpleRow[]) ?? [];
  const listIdBase = React.useId();

  const lastQueryRef = React.useRef<HTMLInputElement | null>(null);

  const addRowAndFocus = () => {
    addRow();
    requestAnimationFrame(() => {
      lastQueryRef.current?.focus();
    });
  };

  const onEnterAddRow: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // не сабмитим форму
      addRowAndFocus();
    }
  };

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        <button type="button" onClick={addRowAndFocus}>+ Add row</button>
      </div>

      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
            <tr>
              <th style={{ textAlign: 'left' }}>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Sum</th>
              <th />
            </tr>
          </thead>

          <tbody>
            <Controller
              control={control}
              name={name}
              render={() => (
                <>
                  {rows.map((row, idx) => {
                    const filtered = getFiltered(row.catalogQuery ?? '');

                    return (
                      <tr key={idx}>
                        <td style={{ minWidth: 260 }}>
                          <div style={{ display: 'grid', gap: 6 }}>
                            <input
                              ref={idx === rows.length - 1 ? lastQueryRef : undefined}
                              list={`simple-catalog-${listIdBase}-${idx}`}
                              placeholder="Search by name or price…"
                              value={row.catalogQuery ?? ''}
                              onChange={(e) => handleQueryChange(idx, e.target.value)}
                              onKeyDown={onEnterAddRow}
                            />
                            <datalist id={`simple-catalog-${listIdBase}-${idx}`}>
                              {filtered.map((c) => (
                                <option key={c._id} value={`${c.name} (${c.price})`} />
                              ))}
                            </datalist>

                            <input type="hidden" value={row.name ?? ''} readOnly />
                            <input type="hidden" value={row.itemId ?? ''} readOnly />
                          </div>
                        </td>

                        <td style={{ width: 120 }}>
                          <input
                            className="inputButton"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            value={row.qty ?? 0}
                            onChange={(e) => patchRow(idx, { qty: toNum(e.target.value, 0) })}
                            onKeyDown={onEnterAddRow}
                          />
                        </td>

                        <td style={{ width: 140 }}>
                          <input
                            className="inputButton"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            value={row.price ?? 0}
                            onChange={(e) => patchRow(idx, { price: toNum(e.target.value, 0) })}
                            onKeyDown={onEnterAddRow}
                          />
                        </td>

                        <td style={{ width: 140 }}>
                          <input
                            className="inputButton"
                            type="number"
                            value={row.sum ?? 0}
                            readOnly
                          />
                        </td>

                        <td style={{ width: 60, textAlign: 'right' }}>
                          <button type="button" onClick={() => removeRow(idx)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ opacity: 0.6, padding: 8 }}>
                        No rows
                      </td>
                    </tr>
                  )}
                </>
              )}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SimpleGroup;
