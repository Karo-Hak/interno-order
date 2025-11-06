import React from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { FormValues } from '../wholesaleOrderPage';

export type SimpleRow = {
  itemId?: string;   // productId из каталога (ObjectId)
  name: string;
  sku?: string;
  qty: number;
  price: number;     // цена за штуку
  sum: number;       // qty * price
};

type CatalogItem = { _id: string; name: string; price: number; sku?: string };

type Props = {
  title: string;
  control: Control<FormValues>;
  name: 'items';
  catalog: CatalogItem[];
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
};

const ItemsGroup: React.FC<Props> = ({
  title,
  control,
  name,
  catalog,
  setValue,
  getValues,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  // Быстрый доступ к товарам
  const byId = React.useMemo(() => {
    const m = new Map<string, CatalogItem>();
    catalog.forEach(c => m.set(c._id, c));
    return m;
  }, [catalog]);

  // Текст опции (как видно в datalist)
  const optionText = (c: CatalogItem) =>
    `${c.name}${c.sku ? ` · ${c.sku}` : ''}${Number.isFinite(c.price) ? ` · ${c.price}` : ''}`;

  // Map "текст → id" для точного совпадения
  const text2id = React.useMemo(() => {
    const m = new Map<string, string>();
    catalog.forEach(c => m.set(optionText(c), c._id));
    return m;
  }, [catalog]);

  const addRow = () =>
    append({ itemId: '', name: '', sku: '', qty: 0, price: 0, sum: 0 });

  const recalcDerived = (idx: number) => {
    const base = getValues(`${name}.${idx}`) as SimpleRow | undefined;
    if (!base) return;
    const qty   = Number(base.qty)   || 0;
    const price = Number(base.price) || 0;
    const sum   = +(qty * price).toFixed(2);
    setValue(`${name}.${idx}.sum`, sum, { shouldDirty: true, shouldValidate: false });
  };

  // Автозаполнение, как у тебя было: sku = name; price = item.price (wholesalePriceAMD)
  const applyItem = (idx: number, item?: CatalogItem) => {
    setValue(`${name}.${idx}.itemId`, item?._id ?? '', { shouldDirty: true });
    setValue(`${name}.${idx}.name`, item?.name ?? '', { shouldDirty: true });
    setValue(`${name}.${idx}.sku`, item?.name ?? '', { shouldDirty: true });          // sku = name
    setValue(`${name}.${idx}.price`, Number(item?.price ?? 0), { shouldDirty: true }); // price нормализован
    recalcDerived(idx);
  };

  // Поиск/фильтр по name/sku
  const filterCatalog = (q: string) => {
    const norm = (s: string) => s.toLowerCase().trim();
    const qq = norm(q);
    if (!qq) return catalog.slice(0, 20);
    return catalog
      .filter(c => [c.name, c.sku ?? ''].map(norm).some(x => x.includes(qq)))
      .slice(0, 20);
  };

  // Локальные поисковые строки по каждой строке
  const [queryMap, setQueryMap] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    setQueryMap(prev => {
      const next: Record<string, string> = {};
      fields.forEach(f => { next[f.id] = prev[f.id] ?? ''; });
      return next;
    });
  }, [fields]);

  const setRowQuery = (rowKey: string, val: string) =>
    setQueryMap(prev => ({ ...prev, [rowKey]: val }));

  // Универсальная попытка выбрать товар по текущему тексту
  const tryResolveSelection = (idx: number, rowKey: string, text: string) => {
    // 1) точное совпадение текста с опцией
    const exactId = text2id.get(text);
    if (exactId) {
      applyItem(idx, byId.get(exactId));
      setRowQuery(rowKey, text); // зафиксируем красивый текст опции
      return;
    }
    // 2) если остался единственный кандидат — выберем его
    const candidates = filterCatalog(text);
    if (candidates.length === 1) {
      const c = candidates[0];
      applyItem(idx, c);
      setRowQuery(rowKey, optionText(c));
      return;
    }
    // 3) иначе — ничего не выбираем (пользователь уточнит ввод)
  };

  // Очистка выбранного товара
  const clearRowSelection = (idx: number) => {
    setValue(`${name}.${idx}.itemId`, '', { shouldDirty: true });
    setValue(`${name}.${idx}.name`, '', { shouldDirty: true });
    setValue(`${name}.${idx}.sku`, '', { shouldDirty: true });
    setValue(`${name}.${idx}.price`, 0, { shouldDirty: true });
    setValue(`${name}.${idx}.sum`, 0, { shouldDirty: true });
  };

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        <button type="button" onClick={addRow}>+ Ավելացնել տող</button>
      </div>

      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
            <tr>
              <th style={{ textAlign: 'left'}}>Ապրանք (որոնում անունով կամ կոդով)</th>
              <th>Կոդ</th>
              <th>Քանակ</th>
              <th>Գին</th>
              <th>Գումար</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.map((f, idx) => {
              const rowKey = f.id;
              const qVal = queryMap[rowKey] ?? '';
              const listId = `plint-catalog-${rowKey}`;
              const options = filterCatalog(qVal);

              return (
                <tr key={rowKey}>
                  <td>
                    {/* ТОЛЬКО поиск через datalist */}
                    <input
                      list={listId}
                      placeholder="Փնտրել ըստ անվանման կամ կոդի…"
                      value={qVal}
                      onInput={(e) => {
                        const v = (e.target as HTMLInputElement).value;
                        setRowQuery(rowKey, v);
                      }}
                      onChange={(e) => {
                        const v = e.target.value;
                        setRowQuery(rowKey, v);
                        if (v.trim() === '') {
                          clearRowSelection(idx);
                        } else {
                          tryResolveSelection(idx, rowKey, v);
                        }
                      }}
                      onBlur={(e) => {
                        const v = e.currentTarget.value;
                        if (v.trim()) tryResolveSelection(idx, rowKey, v);
                      }}
                      className="inputButton"
                      style={{ width: '100%' }}
                    />
                    <datalist id={listId}>
                      {options.map(c => (
                        <option key={c._id} value={optionText(c)} />
                      ))}
                    </datalist>

                    {/* скрытые поля для бэка */}
                    <Controller
                      name={`${name}.${idx}.itemId` as const}
                      control={control}
                      defaultValue={(f as any).itemId || ''}
                      render={({ field }) => <input type="hidden" {...field} readOnly />}
                    />
                    <Controller
                      name={`${name}.${idx}.name` as const}
                      control={control}
                      defaultValue={(f as any).name || ''}
                      render={({ field }) => <input type="hidden" {...field} readOnly />}
                    />
                  </td>

                  <td style={{ width: 120 }}>
                    <Controller
                      name={`${name}.${idx}.sku` as const}
                      control={control}
                      defaultValue={(f as any).sku || ''}
                      render={({ field }) => (
                        <input className='inputButton' {...field} placeholder="Կոդ" />
                      )}
                    />
                  </td>

                  <td style={{ width: 110 }}>
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

                  <td style={{ width: 120 }}>
                    <Controller
                      name={`${name}.${idx}.price` as const}
                      control={control}
                      defaultValue={(f as any).price ?? 0}
                      render={({ field }) => (
                        <input
                          className='inputButton'
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
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

                  <td style={{ width: 120 }}>
                    <Controller
                      name={`${name}.${idx}.sum` as const}
                      control={control}
                      defaultValue={(f as any).sum ?? 0}
                      render={({ field }) => <input className='inputButton' type="number" {...field} readOnly />}
                    />
                  </td>

                  <td style={{ width: 60, textAlign: 'right' }}>
                    <button type="button" onClick={() => remove(idx)}>✕</button>
                  </td>
                </tr>
              );
            })}
            {fields.length === 0 && (
              <tr><td colSpan={6} style={{ opacity: 0.6, padding: 8 }}>No rows</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ItemsGroup;
