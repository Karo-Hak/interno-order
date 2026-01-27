import React from 'react';
import { CoopRow } from './CoopRow';
import { TableControls } from './TableControls';
import { DerivedBuyer, FilterMode, SortDir, SortKey } from './types';
import { compare, derive, normalize, sortIndicator } from './utils';
import { CoopStretchBuyerModel } from '../../../features/coopStrechBuyer/coopStrechBuyerApi';

type Props = {
  rows: CoopStretchBuyerModel[];
  onRowClick?: (buyerId: string) => void;
  onRefresh?: () => void;
};

export const CoopBuyerTable: React.FC<Props> = ({ rows, onRowClick, onRefresh }) => {
  // фильтры и состояние
  const [query, setQuery] = React.useState('');
  const [mode, setMode] = React.useState<FilterMode>('nonzero');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<SortKey>('total');
  const [sortDir, setSortDir] = React.useState<SortDir>('desc');

  // деривация полей
  const derived: DerivedBuyer[] = React.useMemo(() => rows.map(derive), [rows]);

  // фильтрация
  const filtered = React.useMemo(() => {
    const q = normalize(query.trim());
    return derived.filter((r) => {
      const nameOk = q ? normalize(r.name).includes(q) : true;
      if (mode === 'all') return nameOk;
      return nameOk && Math.abs(r.total) > 1e-9;
    });
  }, [derived, query, mode]);

  // сортировка
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [filtered, sortKey, sortDir]);

  // раскрыватель
  const allExpanded = sorted.length > 0 && sorted.every((r) => expanded.has(r._id));
  const toggleAll = (expand: boolean) => {
    setExpanded((prev) => {
      if (!expand) return new Set();
      const s = new Set(prev);
      sorted.forEach((r) => s.add(r._id));
      return s;
    });
  };
  const toggleRow = (id: string) =>
    setExpanded((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  // клик по заголовку сортировки
  const onSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        // новое поле — ставим у числовых desc по умолчанию, у строк asc
        const numericKeys: SortKey[] = ['ordersCount', 'dkCount', 'buySum', 'creditSum', 'total'];
        setSortDir(numericKeys.includes(key) ? 'desc' : 'asc');
        return key;
      } else {
        // то же поле — переворот направления
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return key;
      }
    });
  };

  return (
    <div className="addCoopBuyer_table">
      <TableControls
        query={query}
        setQuery={setQuery}
        mode={mode}
        setMode={setMode}
        onRefresh={onRefresh}
        expandedAll={allExpanded}
        onToggleExpandAll={toggleAll}
        totalShown={sorted.length}
        totalAll={rows.length}
      />

      {sorted.length === 0 ? (
        <div style={{ padding: 12, opacity: 0.8 }}>Գրառություններ չկան…</div>
      ) : (
        <div
          style={{
            maxHeight: '70vh',
            overflow: 'auto',
            border: '1px solid #eee',
            borderRadius: 8,
          }}
        >
          <table className="table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{
                  width: 36,
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  <input
                    aria-label="expand all"
                    type="checkbox"
                    checked={allExpanded}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>

                <th onClick={() => onSort('buyerName')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Անուն {sortIndicator(sortKey === 'buyerName', sortDir)}
                </th>

                <th style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee' }}>Հեռախոս 1</th>
                
                <th onClick={() => onSort('buyerRegion')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Մարզ {sortIndicator(sortKey === 'buyerRegion', sortDir)}
                </th>

                <th onClick={() => onSort('buyerAddress')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Հասցե {sortIndicator(sortKey === 'buyerAddress', sortDir)}
                </th>

                <th onClick={() => onSort('ordersCount')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Պատվերներ {sortIndicator(sortKey === 'ordersCount', sortDir)}
                </th>

                <th onClick={() => onSort('dkCount')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  DK {sortIndicator(sortKey === 'dkCount', sortDir)}
                </th>

                <th onClick={() => onSort('buySum')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  քանակ / Գնումներ {sortIndicator(sortKey === 'buySum', sortDir)}
                </th>

                <th onClick={() => onSort('creditSum')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  քանակ / Վճարումներ {sortIndicator(sortKey === 'creditSum', sortDir)}
                </th>

                <th onClick={() => onSort('total')} style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Մնացորդ {sortIndicator(sortKey === 'total', sortDir)}
                </th>
                <th style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Վճարում
                </th>
                <th style={{
                  cursor: 'pointer',
                  position: 'sticky', top: 0, zIndex: 20, background: '#fff', boxShadow: 'inset 0 -1px #eee'
                }}>
                  Վերադարճ
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((r) => (
                <CoopRow
                  key={r._id}
                  r={r}
                  isOpen={expanded.has(r._id)}
                  toggle={() => toggleRow(r._id)}
                  onRowClick={onRowClick}
                  onPaymentDeleted={onRefresh} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
