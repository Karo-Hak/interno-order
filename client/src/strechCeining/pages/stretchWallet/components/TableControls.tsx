import React from 'react';
import { FilterMode } from './types';

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

export const TableControls: React.FC<Props> = (props) => {
  const {
    query, setQuery, mode, setMode,
    onRefresh, expandedAll, onToggleExpandAll,
    totalShown, totalAll
  } = props;

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
      <div className="addStretchBuyer_head_name" style={{ marginRight: 8 }}>
        Գնորդների ցուցակ
      </div>

      <input
        type="search"
        placeholder="Որոնում ըստ անվան…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc', minWidth: 220 }}
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc' }}
      >
        <option value="nonzero">Միայն ոչ-զրո</option>
        <option value="all">Բոլորը</option>
      </select>

      <button type="button" className="btn" onClick={() => onToggleExpandAll(!expandedAll)}>
        {expandedAll ? 'Սեղմել ամենը' : 'Բացնել ամենը'}
      </button>

      {onRefresh && (
        <button type="button" className="btn" onClick={onRefresh} style={{ marginLeft: 'auto' }}>
          Թարմացնել
        </button>
      )}

      <span style={{ opacity: 0.7 }}>
        Ցուցադրված՝ {totalShown} / {totalAll}
      </span>
    </div>
  );
};