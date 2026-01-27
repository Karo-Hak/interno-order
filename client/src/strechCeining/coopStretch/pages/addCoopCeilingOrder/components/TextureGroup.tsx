import React from 'react';
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormGetValues,
  FieldValues,
  Path,
} from 'react-hook-form';

export type TextureRow = {
  itemId?: string;
  name?: string;
  width?: number;
  height?: number;
  qty?: number;
  price?: number;
  sum?: number;

  // UI-строка поиска как у BuyerSection (value input)
  catalogQuery?: string;
};

type CatalogItem = { _id: string; name: string; price: number };

type Props<TFormValues extends FieldValues> = {
  title: string;
  control: Control<TFormValues>;
  name: Path<TFormValues>; // массив TextureRow[] в форме
  catalog: CatalogItem[];
  setValue: UseFormSetValue<TFormValues>;
  getValues: UseFormGetValues<TFormValues>;
  forceQtyVisible?: boolean;
};

function toNum(v: any, d = 0) {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : d;
}

const normalized = (s: string) => s.toLowerCase().trim();

function TextureGroup<TFormValues extends FieldValues>(props: Props<TFormValues>) {
  const { title, control, name, catalog, setValue, getValues, forceQtyVisible } = props;

  const recalcSum = (row: TextureRow, useQty: boolean) => {
    const price = toNum(row.price);
    if (useQty) {
      const qty = toNum(row.qty);
      return +(qty * price).toFixed(2);
    } else {
      const h = toNum(row.height);
      const w = toNum(row.width);
      return +(((h / 100) * (w / 100)) * price).toFixed(2);
    }
  };

  const addRow = () => {
    const rows = (getValues(name) as TextureRow[]) ?? [];
    setValue(name, [...rows, {}] as any, { shouldDirty: true });
  };

  const removeRow = (idx: number) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    rows.splice(idx, 1);
    setValue(name, rows as any, { shouldDirty: true });
  };

  const setRow = (idx: number, patch: Partial<TextureRow>) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    const row = { ...(rows[idx] ?? {}), ...patch };
    row.sum = recalcSum(row, !!forceQtyVisible);
    rows[idx] = row;
    setValue(name, rows as any, { shouldDirty: true });
  };

  const applyCatalogItem = (idx: number, item: CatalogItem) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    const row = rows[idx] ?? {};

    row.itemId = item._id;
    row.name = item.name;
    row.catalogQuery = `${item.name} (${item.price})`;

    // если цена не задана вручную — подставим
    if (!row.price || row.price === 0) row.price = item.price;

    row.sum = recalcSum(row, !!forceQtyVisible);
    rows[idx] = row;
    setValue(name, rows as any, { shouldDirty: true });
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
    setRow(idx, { catalogQuery: val });

    const exact = catalog.find(
      (c) => `${c.name} (${c.price})`.trim().toLowerCase() === val.trim().toLowerCase(),
    );
    if (exact) applyCatalogItem(idx, exact);
  };

  const rows: TextureRow[] = ((getValues(name) as TextureRow[]) ?? []);
  const listIdBase = React.useId(); // чтобы datalist id был уникален на странице

  // фокус на поле товара последней строки после добавления
  const lastQueryRef = React.useRef<HTMLInputElement | null>(null);

  const addRowAndFocus = () => {
    addRow();
    requestAnimationFrame(() => {
      lastQueryRef.current?.focus();
    });
  };

  // Enter добавляет строку (как просил)
  const onEnterAddRow: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // не сабмитим форму
      addRowAndFocus();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', paddingBottom: 10, justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button type="button" onClick={addRowAndFocus}>+ Ավելացնել</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Ապրանք</th>
              {!forceQtyVisible && <th>Երկ․</th>}
              {!forceQtyVisible && <th>Լայն․</th>}
              {forceQtyVisible && <th>Քանակ</th>}
              <th style={{ textAlign: 'right' }}>Գին</th>
              <th style={{ textAlign: 'right' }}>Գումար</th>
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
                          <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr auto' }}>
                            <div style={{ display: 'grid', gap: 6 }}>
                              <input
                                ref={idx === rows.length - 1 ? lastQueryRef : undefined}
                                list={`coop-catalog-${listIdBase}-${idx}`}
                                placeholder="Search by name or price…"
                                value={row.catalogQuery ?? ''}
                                onChange={(e) => handleQueryChange(idx, e.target.value)}
                                onKeyDown={onEnterAddRow}
                              />
                              <datalist id={`coop-catalog-${listIdBase}-${idx}`}>
                                {filtered.map((c) => (
                                  <option key={c._id} value={`${c.name} (${c.price})`} />
                                ))}
                              </datalist>

                              <input type="hidden" value={row.itemId ?? ''} readOnly />
                            </div>

                          </div>
                        </td>

                        {!forceQtyVisible && (
                          <>
                            <td style={{ width: 100 }}>
                              <input
                                className="inputcoop"
                                type="text"
                                step="0.001"
                                value={row.height ?? ''}
                                onChange={(e) => setRow(idx, { height: toNum(e.target.value) })}
                                onKeyDown={onEnterAddRow}
                                placeholder="Երկ․"
                              />
                            </td>
                            <td style={{ width: 100 }}>
                              <input
                                className="inputcoop"
                                type="text"
                                step="0.001"
                                value={row.width ?? ''}
                                onChange={(e) => setRow(idx, { width: toNum(e.target.value) })}
                                onKeyDown={onEnterAddRow}
                                placeholder="Լայն․"
                              />
                            </td>
                          </>
                        )}

                        {forceQtyVisible && (
                          <td style={{ width: 120 }}>
                            <input
                              className="inputcoop"
                              type="text"
                              step="0.001"
                              value={row.qty ?? ''}
                              onChange={(e) => setRow(idx, { qty: toNum(e.target.value) })}
                              onKeyDown={onEnterAddRow}
                              placeholder="Քանակ"
                            />
                          </td>
                        )}

                        <td style={{ width: 120, textAlign: 'right' }}>
                          <input
                            className="inputcoop"
                            type="text"
                            step="0.01"
                            value={row.price ?? ''}
                            onChange={(e) => setRow(idx, { price: toNum(e.target.value) })}
                            onKeyDown={onEnterAddRow}
                            placeholder="Գին"
                            style={{ textAlign: 'right' }}
                          />
                        </td>

                        <td style={{ width: 140, textAlign: 'right' }}>
                          <input
                            className="inputcoop"
                            type="text"
                            step="0.01"
                            value={row.sum ?? 0}
                            readOnly
                            style={{ textAlign: 'right', background: '#fafafa' }}
                          />
                        </td>

                        <td>
                          <button type="button" onClick={() => removeRow(idx)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ opacity: 0.6, padding: 8 }}>
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


    </div>
  );
}

export default TextureGroup;
