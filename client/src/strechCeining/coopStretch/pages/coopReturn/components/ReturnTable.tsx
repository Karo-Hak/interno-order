// components/ReturnTable.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export type ReturnRow = {
  _id: string;
  date?: string | Date;
  amount: number;
  reason?: string;
  comment?: string;
  buyer?: { _id?: string; name?: string; phone1?: string };
  order?: { _id: string; date?: string | Date } | undefined;
};

type Props = {
  rows: ReturnRow[];
  loading?: boolean;
  onDelete?: (id: string) => void;
};

const fmtDate = (s?: string | Date) =>
  s
    ? new Date(s).toLocaleString('hy-AM', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '—';

const money = (n: number) =>
  new Intl.NumberFormat('hy-AM', { maximumFractionDigits: 0 }).format(n);

const ReturnTable: React.FC<Props> = ({ rows, loading, onDelete }) => {
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ overflow: 'auto', maxHeight: '70vh', border: '1px solid #eee', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={th}>Ամսաթիվ</th>
              <th style={th}>Գնորդ</th>
              <th style={th}>Հեռախոս</th>
              <th style={{ ...th, textAlign: 'right' }}>Գումար</th>
              <th style={th}>Դիտել</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 8, opacity: 0.7 }}>
                  Տվյալներ չկան
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r._id}>
                <td style={td}>{fmtDate(r.date)}</td>
                <td style={td}>{r.buyer?.name || '—'}</td>
                <td style={td}>{r.buyer?.phone1 || '—'}</td>
                <td style={{ ...td, textAlign: 'right' }}>{money(Number(r.amount || 0))}</td>

                {/* Ссылка на детальный просмотр возврата */}
                <td style={td}>
                  <Link to={`/coopStretchceiling/return/${r._id}`}>Դիտել</Link>
                </td>

                <td style={td}>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(r._id)}
                      style={{
                        padding: '2px 8px',
                        border: '1px solid #f2b1b1',
                        background: '#ffecec',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      Ջնջել
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const th: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  background: '#fff',
  boxShadow: 'inset 0 -1px #eee',
  padding: 6,
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: 6,
  borderBottom: '1px solid #f3f3f3',
  verticalAlign: 'top',
};

export default ReturnTable;
