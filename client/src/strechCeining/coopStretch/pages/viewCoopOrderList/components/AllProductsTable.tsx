import React from 'react';
import type { Item } from './ItemsTable';

type AggRow = {
  name: string;
  qty: number;
  total: number;
  price?: number; // вычислим как total/qty, если qty>0
};

type Props = {
  items: Item[]; // несгруппированные товары со всех заказов
};

const aggregate = (items: Item[]): AggRow[] => {
  const map = new Map<string, { qty: number; total: number }>();

  // массивы можно итерировать for..of, проблема только с Map
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const key = (it.name || '').trim();
    if (!key) continue;

    const qty = Number(it.qty || 0);
    const total = Number(it.total || 0);

    const acc = map.get(key) || { qty: 0, total: 0 };
    acc.qty += isFinite(qty) ? qty : 0;
    acc.total += isFinite(total) ? total : 0;
    map.set(key, acc);
  }


  const rows: AggRow[] = Array.from(map.entries()).map(([name, { qty, total }]) => {
    const q = Math.round(qty * 1000) / 1000;
    const t = Math.round(total);
    return {
      name,
      qty: q,
      total: t,
      price: q > 0 ? Math.round((t / q) * 100) / 100 : undefined,
    };
  });

  rows.sort((a, b) => a.name.localeCompare(b.name, 'hy-AM'));
  return rows;
};


const AllProductsTable: React.FC<Props> = ({ items }) => {
  const rows = React.useMemo(() => aggregate(items), [items]);
  const grandTotal = React.useMemo(
    () => rows.reduce((s, x) => s + (Number(x.total) || 0), 0),
    [rows]
  );

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {['Անվանում', 'Ընդ. քանակ', 'Միջին գին', 'Ընդ. գումար'].map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={4} className="muted">Ապրանքներ չկան</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td className="td-num">{r.qty.toLocaleString()}</td>
              <td className="td-num">{r.price !== undefined ? r.price.toLocaleString() : '—'}</td>
              <td className="td-num">{r.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={3} className="td-right strong">Ընդհանուր</td>
              <td className="td-num strong">{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default AllProductsTable;
