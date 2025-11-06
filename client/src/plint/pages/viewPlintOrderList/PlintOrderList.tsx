import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../app/hooks';
import { PlintMenu } from '../../../component/menu/PlintMenu';

import {
  fetchPlintMonthlyReportRetail,
  getPlintRetailOrderById,
} from '../../features/plintRetailOrder/plintRetailOrderApi';

import {
  fetchPlintMonthlyReportWholesale,
  getPlintWholesaleOrderById,
} from '../../features/plintWholesaleOrder/plintWholesaleOrderApi';

// ============ ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ============

type OrderType = 'retail' | 'wholesale';

type MonthlyRow = {
  _id: string;
  date: string | Date;
  buyerName?: string;
  buyerPhone?: string;
  sum: number;
};

type UnifiedRow = {
  // нормализованная строка для списка
  orderType: OrderType;
  orderId: string;
  date: string | Date;
  buyerName?: string;
  buyerPhone?: string;
  sum: number;
};

type DetailItem = {
  name: string;
  qty?: number;
  price?: number;
  total?: number;
};

// ============ УТИЛИТЫ ============

const fmtDateShort = (s: string | Date) =>
  new Date(s).toLocaleDateString('hy-AM', { year: 'numeric', month: '2-digit', day: '2-digit' });

const toMonthStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ============ МАЛЕНЬКИЕ ТАБЛИЦЫ (встроенные, чтобы файл был самодостаточным) ============

const ItemsTable: React.FC<{ items: DetailItem[] }> = ({ items }) => {
  const subtotal = React.useMemo(
    () => items.reduce((s, x) => s + (Number(x.total) || 0), 0),
    [items],
  );
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{  borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Անվանում','Քանակ', 'Գին', 'Գումար'].map((t) => (
              <th key={t} style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{it.name}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{it.qty ?? '—'}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3', textAlign: 'right' }}>
                {it.price !== undefined ? it.price.toLocaleString() : '—'}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3', textAlign: 'right' }}>
                {it.total !== undefined ? it.total.toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} style={{ padding: 6, textAlign: 'right', fontWeight: 700 }}>Еնթագումար</td>
            <td style={{ padding: 6, textAlign: 'right', fontWeight: 700 }}>{subtotal.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

type AggRow = { name: string; qty: number; total: number; price?: number };

const AllProductsTable: React.FC<{ items: DetailItem[] }> = ({ items }) => {
  const rows: AggRow[] = React.useMemo(() => {
    const map = new Map<string, { qty: number; total: number }>();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const key = (it.name || '').trim();
      if (!key) continue;
      const qty = Number(it.qty || 0);
      const total = Number(it.total || 0);
      const acc = map.get(key) || { qty: 0, total: 0 };
      acc.qty += Number.isFinite(qty) ? qty : 0;
      acc.total += Number.isFinite(total) ? total : 0;
      map.set(key, acc);
    }
    const out: AggRow[] = Array.from(map.entries()).map(([name, { qty, total }]) => {
      const q = Math.round(qty * 1000) / 1000;
      const t = Math.round(total);
      return { name, qty: q, total: t, price: q > 0 ? Math.round((t / q) * 100) / 100 : undefined };
    });
    out.sort((a, b) => a.name.localeCompare(b.name, 'hy-AM'));
    return out;
  }, [items]);

  const grandTotal = React.useMemo(
    () => rows.reduce((s, x) => s + (Number(x.total) || 0), 0),
    [rows],
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Անվանում', 'Ընդ. քանակ', 'Միջին գին', 'Ընդ. գումար'].map((t) => (
              <th key={t} style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 6 }}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 8, opacity: 0.6 }}>Ապրանքներ չկան</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3' }}>{r.name}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3', textAlign: 'right' }}>{r.qty.toLocaleString()}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3', textAlign: 'right' }}>
                {r.price !== undefined ? r.price.toLocaleString() : '—'}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f3f3', textAlign: 'right' }}>
                {r.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={3} style={{ padding: 6, textAlign: 'right', fontWeight: 700 }}>Ընդհանուր</td>
              <td style={{ padding: 6, textAlign: 'right', fontWeight: 700 }}>{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

// ============ ОСНОВНОЙ КОМПОНЕНТ ============

const PlintOrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  // входные данные
  const [month, setMonth] = React.useState<string>(toMonthStr());
  const [rows, setRows] = React.useState<UnifiedRow[]>([]);
  const [loadingMonth, setLoadingMonth] = React.useState<boolean>(false);

  // фильтры
  const [dateFrom, setDateFrom] = React.useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = React.useState<string>('');     // yyyy-mm-dd
  const [buyerQuery, setBuyerQuery] = React.useState<string>('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | OrderType>('all'); // фильтр типа заказа

  // раскрытие и детали
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [detailsMap, setDetailsMap] = React.useState<Record<string, DetailItem[]>>({});
  const [loadingDetailMap, setLoadingDetailMap] = React.useState<Record<string, boolean>>({});

  // «показать все товары»
  const [showAllProducts, setShowAllProducts] = React.useState<boolean>(false);
  const [loadingAllProducts, setLoadingAllProducts] = React.useState<boolean>(false);

  // ===== Загрузка списка по месяцу =====
  const loadMonth = React.useCallback(async () => {
    setLoadingMonth(true);
    try {
      const [retailData, wholesaleData] = await Promise.all([
        dispatch(fetchPlintMonthlyReportRetail({ cookies, month })).unwrap(),
        dispatch(fetchPlintMonthlyReportWholesale({ cookies, month })).unwrap(),
      ]);

      const retailRows: UnifiedRow[] = (retailData?.rows ?? []).map((r: any) => ({
        orderType: 'retail' as const,
        orderId: String(r._id),
        date: r.date,
        buyerName: r.buyerName ?? r?.buyer?.name ?? '',
        buyerPhone: r.buyerPhone ?? r?.buyer?.phone1 ?? '',
        sum: Number(r.sum ?? 0),
      }));

      const wholesaleRows: UnifiedRow[] = (wholesaleData?.rows ?? []).map((r: any) => ({
        orderType: 'wholesale' as const,
        orderId: String(r._id),
        date: r.date,
        buyerName: r.buyerName ?? r?.buyer?.name ?? '',
        buyerPhone: r.buyerPhone ?? r?.buyer?.phone1 ?? '',
        sum: Number(r.sum ?? 0),
      }));

      // объединённый и отсортированный список
      const merged = [...retailRows, ...wholesaleRows].sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        if (ta !== tb) return tb - ta;
        return a.orderId.localeCompare(b.orderId); // стабильная сортировка
      });

      setRows(merged);
      setShowAllProducts(false); // сброс агрегатора при перезагрузке
    } catch (e) {
      console.error(e);
      alert('Չհաջողվեց բեռնել հաշվետվությունը (Plint)');
      setRows([]);
    } finally {
      setLoadingMonth(false);
    }
  }, [dispatch, cookies, month]);

  React.useEffect(() => { void loadMonth(); }, [loadMonth]);

  // ===== Нормализация товаров для деталей =====
  const normalizeItems = React.useCallback((order: any): DetailItem[] => {
    if (!order) return [];
    const items: DetailItem[] = [];

    // розничный/оптовый Plint-формат — у нас единые строки items
    if (Array.isArray(order.items)) {
      for (const v of order.items) {
        const name = String(v?.name ?? 'Ապրանք');
        const qty = toNum(v?.qty);
        const price = toNum(v?.price);
        const total = toNum(v?.sum ?? (price * qty));
        items.push({ name, qty, price, total });
      }
    }

    // если в будущем захотим тянуть ещё поля — добавим тут
    return items;
  }, []);

  // ===== Детали заказа (подгрузка) =====
  const loadOrderDetails = React.useCallback(
    async (uniqueKey: string, row: UnifiedRow) => {
      if (detailsMap[uniqueKey] || loadingDetailMap[uniqueKey]) return;

      setLoadingDetailMap((s) => ({ ...s, [uniqueKey]: true }));
      try {
        let orderFull: any;
        if (row.orderType === 'retail') {
          orderFull = await dispatch(getPlintRetailOrderById({ cookies, id: row.orderId })).unwrap();
        } else {
          orderFull = await dispatch(getPlintWholesaleOrderById({ cookies, id: row.orderId })).unwrap();
        }
        setDetailsMap((s) => ({ ...s, [uniqueKey]: normalizeItems(orderFull) }));
      } catch (err) {
        console.error('Failed to load order details', uniqueKey, err);
        setDetailsMap((s) => ({ ...s, [uniqueKey]: [] }));
      } finally {
        setLoadingDetailMap((s) => ({ ...s, [uniqueKey]: false }));
      }
    },
    [dispatch, cookies, detailsMap, loadingDetailMap, normalizeItems],
  );

  // ===== Фильтрация =====
  const filteredRows = React.useMemo(() => {
    const q = buyerQuery.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(dateFrom + 'T00:00:00').getTime() : -Infinity;
    const toTs   = dateTo   ? new Date(dateTo   + 'T23:59:59').getTime() :  Infinity;

    return rows.filter(r => {
      if (typeFilter !== 'all' && r.orderType !== typeFilter) return false;
      const ts = new Date(r.date).getTime();
      const inDate = ts >= fromTs && ts <= toTs;
      const inBuyer = !q
        || (r.buyerName ?? '').toLowerCase().includes(q)
        || (r.buyerPhone ?? '').toLowerCase().includes(q);
      return inDate && inBuyer;
    });
  }, [rows, dateFrom, dateTo, buyerQuery, typeFilter]);

  // ===== Раскрытие строки =====
  const toggleExpand = async (uniqueKey: string, row: UnifiedRow) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(uniqueKey)) next.delete(uniqueKey); else next.add(uniqueKey);
      return next;
    });
    if (!detailsMap[uniqueKey]) {
      await loadOrderDetails(uniqueKey, row);
    }
  };

  // ===== «Показать все товары» =====
  const handleToggleAllProducts = async () => {
    if (showAllProducts) {
      setShowAllProducts(false);
      return;
    }
    const ids = filteredRows.map(r => `${r.orderType}:${r.orderId}`);
    const need = ids.filter(id => !detailsMap[id] && !loadingDetailMap[id]);
    if (need.length === 0) {
      setShowAllProducts(true);
      return;
    }
    setLoadingAllProducts(true);
    try {
      await Promise.all(
        need.map(async (uniqueKey, i) => {
          const [orderType, orderId] = uniqueKey.split(':') as [OrderType, string];
          const stubRow: UnifiedRow = {
            orderType,
            orderId,
            date: new Date().toISOString(),
            sum: 0,
          };
          await loadOrderDetails(uniqueKey, stubRow);
        })
      );
      setShowAllProducts(true);
    } finally {
      setLoadingAllProducts(false);
    }
  };

  // собрать товары по всем отфильтрованным заказам
  const allProducts = React.useMemo<DetailItem[]>(() => {
    if (!showAllProducts) return [];
    const ids = filteredRows.map(r => `${r.orderType}:${r.orderId}`);
    const combined: DetailItem[] = [];
    for (const key of ids) {
      const arr = detailsMap[key];
      if (Array.isArray(arr)) combined.push(...arr);
    }
    return combined;
  }, [showAllProducts, filteredRows, detailsMap]);

  // ===== RENDER =====

  return (
    <div>
      <PlintMenu />

      {/* Панель управления */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr auto',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8,
          position: 'sticky',
          top: 0,
          background: '#f3f4f6',
          padding: 8,
          zIndex: 1,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          Ամիս:
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>

        <button type="button" onClick={loadMonth} disabled={loadingMonth}>
          {loadingMonth ? 'Բեռնվում է…' : 'Թարմացնել'}
        </button>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            Սկիզբ:
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            Վերջ:
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </label>
          <input
            placeholder="Գնորդ / Հեռախոս"
            value={buyerQuery}
            onChange={(e) => setBuyerQuery(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | OrderType)}
          >
            <option value="all">Բոլորը</option>
            <option value="retail">Մանրածախ</option>
            <option value="wholesale">Մեծածախ</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleToggleAllProducts}
            disabled={loadingAllProducts || filteredRows.length === 0}
          >
            {loadingAllProducts ? 'Ապրանքները բեռնվում են…' :
              (showAllProducts ? 'Թաքցնել բոլոր ապրանքները' : 'Ցույց տալ բոլոր ապրանքները')}
          </button>

          <div style={{ fontWeight: 700 }}>
            Ընդհանուր ({filteredRows.length} պատվեր):{' '}
            {filteredRows.reduce((s, x) => s + Number(x.sum || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Глобальный агрегированный список */}
      {showAllProducts && (
        <div style={{ marginBottom: 8, border: '1px solid #eee', borderRadius: 8, padding: 8, background: '#fff' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Բոլոր ապրանքները (ընտրված պատվերների համար)
          </div>
          <AllProductsTable items={allProducts} />
        </div>
      )}

      {/* Таблица заказов */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['', '№', 'Ամսաթիվ', 'Տիպ', 'Գնորդ', 'Հեռախոս', 'Գումար'].map((title) => (
                <th
                  key={title}
                  style={{
                    textAlign: title === 'Գումար' ? 'right' : 'left',
                    borderBottom: '1px solid #e5e7eb',
                    padding: 6,
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 2,
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.length === 0 && !loadingMonth && (
              <tr><td colSpan={7} style={{ padding: 8, opacity: 0.6 }}>Տվյալներ չկան</td></tr>
            )}

            {filteredRows.map((row, idx) => {
              const uniqueKey = `${row.orderType}:${row.orderId}`;
              const isOpen = expanded.has(uniqueKey);
              const items = detailsMap[uniqueKey];
              const shortId = row.orderId.slice(-4);
              const viewHref =
                row.orderType === 'retail'
                  ? `/plint/orders/view/${row.orderId}`
                  : `/plint/wholesale/orders/view/${row.orderId}`;

              return (
                <React.Fragment key={uniqueKey}>
                  <tr>
                    <td style={{ width: 36, textAlign: 'center', padding: 6 }}>
                      <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={() => void toggleExpand(uniqueKey, row)}
                        aria-label="Ապրանքներ"
                      />
                    </td>
                    <td style={{ padding: 6, whiteSpace: 'nowrap', fontSize: 12 }}>
                      <Link to={viewHref} style={{ textDecoration: 'none' }}>
                        {idx + 1}. <span style={{ opacity: 0.7 }}>#{shortId}</span>
                      </Link>
                    </td>
                    <td style={{ padding: 6 }}>
                      <Link to={viewHref}>{fmtDateShort(row.date)}</Link>
                    </td>
                    <td style={{ padding: 6 }}>
                      {row.orderType === 'retail' ? 'Մանրածախ' : 'Մեծածախ'}
                    </td>
                    <td style={{ padding: 6 }}>
                      <Link to={viewHref}>{row.buyerName || '—'}</Link>
                    </td>
                    <td style={{ padding: 6 }}>{row.buyerPhone || '—'}</td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {Number(row.sum || 0).toLocaleString()}
                    </td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan={7} style={{ padding: 8, background: '#fafafa' }}>
                        {loadingDetailMap[uniqueKey] && (
                          <div style={{ opacity: 0.7 }}>Բեռնվում է ապրանքների ցուցակը…</div>
                        )}
                        {!loadingDetailMap[uniqueKey] && (!items || items.length === 0) && (
                          <div style={{ opacity: 0.7 }}>Ապրանքներ չկան</div>
                        )}
                        {!loadingDetailMap[uniqueKey] && items && items.length > 0 && (
                          <ItemsTable items={items} />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlintOrderList;
