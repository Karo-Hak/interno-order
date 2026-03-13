import React from 'react';
import { PlintBuyerItem } from '../../../features/plintBuyer/plintBuyerSlice';
import {
  DerivedPlintBuyer,
  FilterMode,
  SortKey,
  SortDir,
} from './typesPlint';
import {
  deriveBuyer,
  normalizeStr,
  compareBuyer,
  sortIndicator,
} from './utilsPlint';
import PlintRow from './PlintRow';
import PlintTableControls from './PlintTableControls';

type Props = {
  rows: PlintBuyerItem[];
  onRefresh?: () => void;
};

const PlintBuyerTable: React.FC<Props> = ({ rows, onRefresh }) => {
  const [query, setQuery] = React.useState<string>('');
  const [mode, setMode] = React.useState<FilterMode>('nonzero');

  const [sortKey, setSortKey] = React.useState<SortKey>('name');
  const [sortDir, setSortDir] = React.useState<SortDir>('asc');

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const derived: DerivedPlintBuyer[] = React.useMemo(
    () => rows.map(deriveBuyer),
    [rows]
  );

  const filtered = React.useMemo(() => {
    const q = normalizeStr(query);
    return derived.filter((b) => {
      if (mode === 'nonzero' && !b.total) return false;

      if (!q) return true;
      const hay = (s?: string) => normalizeStr(s).includes(q);

      return (
        hay(b.name) ||
        hay(b.region) ||
        hay(b.address) ||
        hay(b.phone1) ||
        hay(b.phone2)
      );
    });
  }, [derived, query, mode]);

  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => compareBuyer(a, b, sortKey, sortDir));
    return arr;
  }, [filtered, sortKey, sortDir]);

  const visibleIds = React.useMemo(() => sorted.map(b => b._id), [sorted]);

  const expandedAll = React.useMemo(() => {
    if (!visibleIds.length) return false;
    return visibleIds.every(id => !!openMap[id]);
  }, [visibleIds, openMap]);

  const toggleExpandAll = (expand: boolean) => {
    setOpenMap(prev => {
      if (!expand) {
        const next = { ...prev };
        for (const id of visibleIds) delete next[id];
        return next;
      }
      const add: Record<string, boolean> = {};
      for (const id of visibleIds) add[id] = true;
      return { ...prev, ...add };
    });
  };

  const setSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
        return prevKey;
      } else {
        setSortDir('asc');
        return key;
      }
    });
  };

  return (
    <div style={{ padding: 8 }}>
      <PlintTableControls
        query={query}
        setQuery={setQuery}
        mode={mode}
        setMode={setMode}
        onRefresh={onRefresh}
        expandedAll={expandedAll}
        onToggleExpandAll={toggleExpandAll}
        totalShown={sorted.length}
        totalAll={rows.length}
      />

      <div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead
            style={{
              background: '#fafafa',
              position: 'sticky',
              top: 48,
              zIndex: 20,
            }}
          >
            <tr>
              <th />
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('name')}
              >
                Անուն {sortIndicator(sortKey === 'name', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('phone1')}
                title="Սորտировка по телефону 1"
              >
                Հեռ․ 1 {sortIndicator(sortKey === 'phone1', sortDir)}
              </th>
              <th>Հեռ․ 2</th>
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('region')}
              >
                Մարզ {sortIndicator(sortKey === 'region', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('address')}
              >
                Հասցե {sortIndicator(sortKey === 'address', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => setSort('ordersCount')}
                title="retail + wholesale պատվերների քանակ"
              >
                Պատվերների քանակ {sortIndicator(sortKey === 'ordersCount', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => setSort('dkCount')}
                title="debetKredit գրառումների քանակ"
              >
                DK գրառումներ {sortIndicator(sortKey === 'dkCount', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('buySum')}
                title="Գնումների քանակ / գումար"
              >
                Գնումներ (քանակ / գումար){' '}
                {sortIndicator(sortKey === 'buySum', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setSort('creditSum')}
                title="Վճարումներում քանակ / գումար"
              >
                Վճարումներ (քանակ / գումար){' '}
                {sortIndicator(sortKey === 'creditSum', sortDir)}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => setSort('total')}
                title="Մնացորդ balanceAMD"
              >
                Մնացորդ {sortIndicator(sortKey === 'total', sortDir)}
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  style={{
                    padding: 12,
                    textAlign: 'center',
                    opacity: 0.6,
                  }}
                >
                  Տվյալներ չկան
                </td>
              </tr>
            )}

            {sorted.map((r) => (
              <PlintRow
                key={r._id}
                r={r}
                isOpen={!!openMap[r._id]}
                toggle={() => toggleRow(r._id)}
                onPaymentDeleted={onRefresh} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlintBuyerTable;
