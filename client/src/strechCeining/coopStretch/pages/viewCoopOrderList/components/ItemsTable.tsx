import React from 'react';

export type Item = {
  name: string;
  width?: number;
  height?: number;
  qty?: number;
  price?: number;
  total?: number;
};

type Props = { items: Item[] };

const ItemsTable: React.FC<Props> = ({ items }) => {
  const subtotal = React.useMemo(
    () => items.reduce((s, x) => s + (Number(x.total) || 0), 0),
    [items]
  );

  return (
    <div className="table-wrap">
      <table className="table table--inner">
        <thead>
          <tr>
            {['Անվանում', 'Երկ․', 'Լայն․', 'Քանակ', 'Գին', 'Գումար'].map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td>{it.name}</td>
              <td>{it.height ?? '—'}</td>
              <td>{it.width ?? '—'}</td>
              <td>{it.qty ?? '—'}</td>
              <td className="td-num">{it.price !== undefined ? it.price.toLocaleString() : '—'}</td>
              <td className="td-num">{it.total !== undefined ? it.total.toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="td-right strong">Ենթագումար</td>
            <td className="td-num strong">{subtotal.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ItemsTable;
