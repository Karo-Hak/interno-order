import React from 'react';

type Props = {
  loading: boolean;
  from: string;
  to: string;
  buyerQuery: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setBuyerQuery: (v: string) => void;
  onRefresh: () => void;
};

const ReturnToolbar: React.FC<Props> = ({ loading, from, to, buyerQuery, setFrom, setTo, setBuyerQuery, onRefresh }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: 8,
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: '#fff',
        padding: 8,
        zIndex: 1,
        borderBottom: '1px solid #eee',
      }}
    >
      <input
        placeholder="Գնորդ / Հեռախոս"
        value={buyerQuery}
        onChange={(e) => setBuyerQuery(e.target.value)}
      />
      <label>
        Սկիզբ:
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ marginLeft: 6 }} />
      </label>
      <label>
        Վերջ:
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ marginLeft: 6 }} />
      </label>
      <button type="button" onClick={onRefresh} disabled={loading}>
        {loading ? 'Բեռնվում է…' : 'Թարմացնել'}
      </button>
    </div>
  );
};

export default ReturnToolbar;
