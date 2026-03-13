import React from 'react';
import { Link } from 'react-router-dom';

export type Row = {
  _id: string;
  date: string | Date;
  buyerName?: string;
  buyerPhone?: string;
  sum: number;
};

type Props = {
  title: string;
  rows: Row[];
  total: number;
  count: number;
  loading: boolean;
  viewPathPrefix: string; 
  height?: number;       
};

const PlintReportSection: React.FC<Props> = ({
  title,
  rows,
  total,
  count,
  loading,
  viewPathPrefix,
  height = 33,
}) => {
  return (
    <section style={{ marginTop: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 700,
          padding: 8,
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb',
        }}
      >
        <span style={{ fontSize: 16 }}>{title}</span>
        <span style={{ marginLeft: 'auto' }}>
          Ընդհանուր ({count} պատվեր): {Number(total || 0).toLocaleString()}
        </span>
      </div>

      <div style={{ overflow: 'auto', maxHeight: `${height}vh`, paddingInline: 8, position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {['Ամսաթիվ', 'Գնորդ', 'Հեռախոս', 'Գումար'].map((title) => (
                <th
                  key={title}
                  style={{
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 2,
                    borderBottom: '1px solid #e5e7eb',
                    padding: 6,
                    textAlign: 'left',
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={4} style={{ padding: 8, opacity: 0.7 }}>Տվյալներ չկան</td>
              </tr>
            )}

            {rows.map((r) => (
              <tr
                key={r._id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  background: '#fafafa',
                }}
              >
                <td style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <Link to={`${viewPathPrefix}/${r._id}`}>
                    {new Date(r.date).toLocaleString('hy-AM', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </Link>
                </td>
                <td style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <Link to={`${viewPathPrefix}/${r._id}`}>{r.buyerName || '—'}</Link>
                </td>
                <td style={{ borderBottom: '1px solid #f3f4f6' }}>{r.buyerPhone || '—'}</td>
                <td style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>
                  {Number(r.sum || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

          {rows.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: 6, fontWeight: 700, textAlign: 'right' }}>
                  Ընդհանուր
                </td>
                <td style={{ padding: 6, fontWeight: 700, textAlign: 'right' }}>
                  {Number(total || 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
};

export default PlintReportSection;
