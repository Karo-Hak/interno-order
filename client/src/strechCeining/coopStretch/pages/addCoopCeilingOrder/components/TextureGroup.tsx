// src/strechCeining/coopStretch/pages/addCoopOrder/components/TextureGroup.tsx
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
  qty?: number;     // 👈 добавили, нужно для возвратов
  price?: number;
  sum?: number;
};

type CatalogItem = { _id: string; name: string; price: number };

type Props<TFormValues extends FieldValues> = {
  title: string;
  control: Control<TFormValues>;
  name: Path<TFormValues>; // массив TextureRow[] в форме
  catalog: CatalogItem[];
  setValue: UseFormSetValue<TFormValues>;
  getValues: UseFormGetValues<TFormValues>;
  /** Показать колонку Qty и считать сумму как qty*price (для возврата) */
  forceQtyVisible?: boolean;
};

function toNum(v: any, d = 0) {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : d;
}

function TextureGroup<TFormValues extends FieldValues>(props: Props<TFormValues>) {
  const { title, control, name, catalog, setValue, getValues, forceQtyVisible } = props;

  // добавить пустую строку
  const addRow = () => {
    const rows = (getValues(name) as TextureRow[]) ?? [];
    setValue(name, [...rows, {}] as any, { shouldDirty: true });
  };

  // удалить строку
  const removeRow = (idx: number) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    rows.splice(idx, 1);
    setValue(name, rows as any, { shouldDirty: true });
  };

  // автозаполнение из каталога (name, price)
  const onPickCatalog = (idx: number, itemId: string) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    const found = catalog.find(c => c._id === itemId);
    const row = rows[idx] ?? {};
    row.itemId = itemId;
    row.name = found?.name ?? row.name ?? '';
    // если у строки нет кастомной цены — подставим из каталога
    if (!row.price || row.price === 0) row.price = found?.price ?? 0;

    // пересчитать сумму
    row.sum = recalcSum(row, !!forceQtyVisible);
    rows[idx] = row;
    setValue(name, rows as any, { shouldDirty: true });
  };

  // пересчёт суммы
  const recalcSum = (row: TextureRow, useQty: boolean) => {
    const price = toNum(row.price);
    if (useQty) {
      const qty = toNum(row.qty);
      return +(qty * price).toFixed(2);
    } else {
      const h = toNum(row.height);
      const w = toNum(row.width);
      return +((h * w) * price).toFixed(2);
    }
  };

  // обновить поле и сумму
  const onFieldChange = (idx: number, patch: Partial<TextureRow>) => {
    const rows = ((getValues(name) as TextureRow[]) ?? []).slice();
    const row = { ...(rows[idx] ?? {}), ...patch };
    row.sum = recalcSum(row, !!forceQtyVisible);
    rows[idx] = row;
    setValue(name, rows as any, { shouldDirty: true });
  };

  const rows: TextureRow[] = ((getValues(name) as TextureRow[]) ?? []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button type="button" onClick={addRow}>+ Ավելացնել</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 720 }}>
          <thead>
            <tr>
              <th>Ապրանք</th>
              <th>Անվանում</th>
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
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      {/* Каталог */}
                      <td style={{ minWidth: 180 }}>
                        <select
                          value={row.itemId ?? ''}
                          onChange={(e) => onPickCatalog(idx, e.target.value)}
                        >
                          <option value="">—</option>
                          {catalog.map(c => (
                            <option key={c._id} value={c._id}>
                              {c.name} ({c.price})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Название */}
                      <td>
                        <input
                          value={row.name ?? ''}
                          onChange={e => onFieldChange(idx, { name: e.target.value })}
                          placeholder="Անվանում"
                        />
                      </td>

                      {/* Высота/Ширина или Qty */}
                      {!forceQtyVisible && (
                        <>
                          <td style={{ width: 100 }}>
                            <input
                              type="number"
                              step="0.001"
                              value={row.height ?? ''}
                              onChange={e => onFieldChange(idx, { height: toNum(e.target.value) })}
                              placeholder="Երկ․"
                            />
                          </td>
                          <td style={{ width: 100 }}>
                            <input
                              type="number"
                              step="0.001"
                              value={row.width ?? ''}
                              onChange={e => onFieldChange(idx, { width: toNum(e.target.value) })}
                              placeholder="Լայն․"
                            />
                          </td>
                        </>
                      )}

                      {forceQtyVisible && (
                        <td style={{ width: 120 }}>
                          <input
                            type="number"
                            step="0.001"
                            value={row.qty ?? ''}
                            onChange={e => onFieldChange(idx, { qty: toNum(e.target.value) })}
                            placeholder="Քանակ"
                          />
                        </td>
                      )}

                      {/* Цена */}
                      <td style={{ width: 120, textAlign: 'right' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={row.price ?? ''}
                          onChange={e => onFieldChange(idx, { price: toNum(e.target.value) })}
                          placeholder="Գին"
                          style={{ textAlign: 'right' }}
                        />
                      </td>

                      {/* Сумма (read-only авторасчёт) */}
                      <td style={{ width: 140, textAlign: 'right' }}>
                        <input
                          type="number"
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
                  ))}
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
