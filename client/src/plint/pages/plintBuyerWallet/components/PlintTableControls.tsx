import React from 'react';
import { FilterMode } from './typesPlint';

type Props = {
  query: string;
  setQuery: (v: string) => void;
  mode: FilterMode;
  setMode: (m: FilterMode) => void;
  onRefresh?: () => void;
  expandedAll: boolean;
  onToggleExpandAll: (expand: boolean) => void;
  totalShown: number;
  totalAll: number;
};

const PlintTableControls: React.FC<Props> = ({
  query,
  setQuery,
  mode,
  setMode,
  onRefresh,
  expandedAll,
  onToggleExpandAll,
  totalShown,
  totalAll,
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginBottom: 12,
        padding: '8px 4px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontWeight: 600, marginRight: 8 }}>
        Գնորդների հաշվետվություն (Plint)
      </div>

      <input
        type="search"
        placeholder="Որոնում ըստ անվան, հասցեի կամ հեռախոսի…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #ccc',
          minWidth: 220,
        }}
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as FilterMode)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      >
        <option value="nonzero">Միայն ոչ զրո մնացորդով</option>
        <option value="all">Բոլորը</option>
      </select>

      <button
        type="button"
        onClick={() => onToggleExpandAll(!expandedAll)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #ccc',
          background: '#f7f7f7',
          cursor: 'pointer',
        }}
      >
        {expandedAll ? 'Սեղմել ամենը' : 'Բացել ամենը'}
      </button>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          style={{
            marginLeft: 'auto',
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Թարմացնել
        </button>
      )}

      <span style={{ opacity: 0.7 }}>
        Ցուցադրված՝ {totalShown} / {totalAll}
      </span>
    </div>
  );
};

export default PlintTableControls;
