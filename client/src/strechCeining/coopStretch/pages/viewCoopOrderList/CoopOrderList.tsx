import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { fetchCoopMonthlyReport, fetchCoopOrderById } from '../../features/coopCeilingOrder/coopCeilingOrderApi';
import './coopOrderList.css';
import AllProductsTable from './components/AllProductsTable';
import ItemsTable, { Item } from './components/ItemsTable';

type Row = {
  _id: string;
  date: string | Date;
  buyerName?: string;
  buyerPhone?: string;
  sum: number;
};

const fmtDate = (s: string | Date) =>
  new Date(s).toLocaleString('hy-AM', { year: 'numeric', month: '2-digit', day: '2-digit' });

const toMonthStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const CoopOrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  // исходные данные
  const [month, setMonth] = React.useState<string>(toMonthStr());
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // фильтры
  const [dateFrom, setDateFrom] = React.useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = React.useState<string>('');     // yyyy-mm-dd
  const [buyerQuery, setBuyerQuery] = React.useState<string>('');

  // раскрывашка/детали по строкам
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [details, setDetails] = React.useState<Record<string, Item[]>>({});
  const [loadingDetail, setLoadingDetail] = React.useState<Record<string, boolean>>({});

  // глобальный список товаров
  const [showAllProducts, setShowAllProducts] = React.useState<boolean>(false);
  const [loadingAllProducts, setLoadingAllProducts] = React.useState<boolean>(false);

  // ===== Загрузка отчёта =====
  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(fetchCoopMonthlyReport({ cookies, month })).unwrap();
      const normRows: Row[] = (data?.rows ?? []).map((r: any) => ({
        _id: String(r._id),
        date: r.date,
        buyerName: r.buyerName ?? r.name ?? r?.buyer?.name ?? '',
        buyerPhone: r.buyerPhone ?? r.phone1 ?? r?.buyer?.phone1 ?? '',
        sum: Number(r.sum ?? 0),
      }));
      setRows(normRows);
      setShowAllProducts(false); // сброс при обновлении
    } catch {
      alert('Չհաջողվեց բեռնել հաշվետվությունը');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, cookies, month]);

  React.useEffect(() => { load(); }, [load]);

  // ===== Нормализация товаров =====
  const normalizeItems = React.useCallback((order: any): Item[] => {
    if (!order) return [];
    const items: Item[] = [];

    // текстуры
    if (Array.isArray(order.groupedStretchTextureData)) {
      for (const v of order.groupedStretchTextureData) {
        const name = String(v?.name ?? 'Ապրանք');
        const qty = toNum(v?.qty);
        const width = toNum(v?.width);
        const height = toNum(v?.height);
        const price = toNum(v?.price);
        const total = toNum(v?.sum ?? ((price ?? 0) * (qty ?? 1)));
        items.push({ name, height, width, qty, price, total });
      }
    }

    // простые (profil/platform/ring)
    for (const key of ['groupedStretchProfilData','groupedLightPlatformData','groupedLightRingData']) {
      const arr = order?.[key];
      if (Array.isArray(arr)) {
        for (const v of arr) {
          const name  = String(v?.name ?? 'Ապրանք');
          const qty   = toNum(v?.qty);
          const price = toNum(v?.price);
          const total = toNum(v?.sum ?? ((price ?? 0) * (qty ?? 1)));
          items.push({ name, qty, price, total });
        }
      }
    }

    return items;

    function toNum(n: any): number | undefined {
      const x = Number(n);
      return Number.isFinite(x) ? x : undefined;
    }
  }, []);

  // ===== Детали одного заказа =====
  const loadOrderDetails = React.useCallback(async (id: string) => {
    if (details[id] || loadingDetail[id]) return;
    setLoadingDetail((s) => ({ ...s, [id]: true }));
    try {
      const order = await dispatch(fetchCoopOrderById({ cookies, id })).unwrap();
      setDetails((s) => ({ ...s, [id]: normalizeItems(order) }));
    } catch (e) {
      console.error('Failed to load order details', e);
      setDetails((s) => ({ ...s, [id]: [] }));
    } finally {
      setLoadingDetail((s) => ({ ...s, [id]: false }));
    }
  }, [dispatch, cookies, details, loadingDetail, normalizeItems]);

  // ===== Фильтрация по дате/покупателю =====
  const filteredRows = React.useMemo(() => {
    const q = buyerQuery.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(dateFrom + 'T00:00:00').getTime() : -Infinity;
    const toTs   = dateTo   ? new Date(dateTo   + 'T23:59:59').getTime() :  Infinity;

    return rows.filter(r => {
      const ts = new Date(r.date).getTime();
      const inDate = ts >= fromTs && ts <= toTs;
      const inBuyer = !q
        || (r.buyerName ?? '').toLowerCase().includes(q)
        || (r.buyerPhone ?? '').toLowerCase().includes(q);
      return inDate && inBuyer;
    });
  }, [rows, dateFrom, dateTo, buyerQuery]);

  const filteredTotal = React.useMemo(
    () => filteredRows.reduce((s, x) => s + Number(x.sum || 0), 0),
    [filteredRows]
  );

  // ===== Раскрытие строки =====
  const toggleExpand = async (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    if (!details[id]) await loadOrderDetails(id);
  };

  // ===== Глобальная кнопка: показать товары всех заказов =====
  const handleToggleAllProducts = async () => {
    if (showAllProducts) {
      setShowAllProducts(false);
      return;
    }
    const ids = filteredRows.map(r => r._id);
    const need = ids.filter(id => !details[id] && !loadingDetail[id]);
    if (need.length === 0) {
      setShowAllProducts(true);
      return;
    }
    setLoadingAllProducts(true);
    try {
      await Promise.all(
        need.map(async (id) => {
          setLoadingDetail((s) => ({ ...s, [id]: true }));
          try {
            const order = await dispatch(fetchCoopOrderById({ cookies, id })).unwrap();
            setDetails((s) => ({ ...s, [id]: normalizeItems(order) }));
          } catch (e) {
            console.error('Failed to load order details', id, e);
            setDetails((s) => ({ ...s, [id]: [] }));
          } finally {
            setLoadingDetail((s) => ({ ...s, [id]: false }));
          }
        })
      );
      setShowAllProducts(true);
    } finally {
      setLoadingAllProducts(false);
    }
  };

  // собрать товары по всем отфильтрованным заказам
  const allProducts = React.useMemo<Item[]>(() => {
    if (!showAllProducts) return [];
    const ids = filteredRows.map(r => r._id);
    const combined: Item[] = [];
    for (const id of ids) {
      const arr = details[id];
      if (Array.isArray(arr)) combined.push(...arr);
    }
    return combined;
  }, [showAllProducts, filteredRows, details]);

  return (
    <div className="coop-page">
      <CoopStretchMenu />

      {/* Панель управления */}
      <div className="toolbar">
        <label className="toolbar__field">
          Ամիս:
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>

        <button type="button" className="btn" onClick={load} disabled={loading}>
          {loading ? 'Բեռնվում է…' : 'Թարմացնել'}
        </button>

        <div className="filters">
          <label className="toolbar__field">
            Սկիզբ:
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </label>
          <label className="toolbar__field">
            Վերջ:
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </label>
          <input
            className="toolbar__search"
            placeholder="Գնորդ / Հեռախոս"
            value={buyerQuery}
            onChange={(e) => setBuyerQuery(e.target.value)}
          />
        </div>

        <div className="toolbar__right">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleToggleAllProducts}
            disabled={loadingAllProducts || filteredRows.length === 0}
          >
            {loadingAllProducts ? 'Ապրանքները բեռնվում են…' :
              (showAllProducts ? 'Թաքցնել բոլոր ապրանքները' : 'Ցույց տալ բոլոր ապրանքները')}
          </button>

          <div className="toolbar__total">
            Ընդհանուր ({filteredRows.length} պատվեր):{' '}
            <b>
              {filteredRows.reduce((s, x) => s + Number(x.sum || 0), 0).toLocaleString()}
            </b>
          </div>
        </div>
      </div>

      {/* Глобальный агрегированный список */}
      {showAllProducts && (
        <div className="panel">
          <div className="panel__title">Բոլոր ապրանքները (ընտրված պատվերների համար)</div>
          <AllProductsTable items={allProducts} />
        </div>
      )}

      {/* Таблица заказов */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {['', 'Ամսաթիվ', 'Գնորդ', 'Հեռախոս', 'Գումար'].map((title) => (
                <th key={title}>{title}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.length === 0 && !loading && (
              <tr><td colSpan={5} className="muted">Տվյալներ չկան</td></tr>
            )}

            {filteredRows.map((r) => {
              const isOpen = expanded.has(r._id);
              const items = details[r._id];

              return (
                <React.Fragment key={r._id}>
                  <tr>
                    <td className="td-center">
                      <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={() => toggleExpand(r._id)}
                        aria-label="Ապրանքներ"
                      />
                    </td>
                    <td>
                      <Link to={`/coopStretchceiling/viewCoopStretchOrder/${r._id}`}>{fmtDate(r.date)}</Link>
                    </td>
                    <td>
                      <Link to={`/coopStretchceiling/viewCoopStretchOrder/${r._id}`}>{r.buyerName || '—'}</Link>
                    </td>
                    <td>{r.buyerPhone || '—'}</td>
                    <td className="td-num">{Number(r.sum || 0).toLocaleString()}</td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan={5} className="expand-cell">
                        {loadingDetail[r._id] && <div className="muted">Բեռնվում է ապրանքների ցուցակը…</div>}

                        {!loadingDetail[r._id] && (!items || items.length === 0) && (
                          <div className="muted">Ապրանքներ չկան</div>
                        )}

                        {!loadingDetail[r._id] && items && items.length > 0 && (
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

export default CoopOrderList;
