import React from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../app/hooks';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { fetchPlintMonthlyReportRetail } from '../../features/plintRetailOrder/plintRetailOrderApi';
import { fetchPlintMonthlyReportWholesale } from '../../features/plintWholesaleOrder/plintWholesaleOrderApi';
import PlintReportSection, { Row } from './components/PlintReportSection';

const toMonthStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const normalizeRows = (arr: any[]): Row[] =>
  (arr ?? []).map((r: any) => ({
    _id: String(r._id ?? r.id),
    date: r.date ?? r.createdAt,
    buyerName: r.buyerName ?? r.name ?? r?.buyer?.name ?? '',
    buyerPhone: r.buyerPhone ?? r.phone1 ?? r?.buyer?.phone1 ?? '',
    sum: Number(r.sum ?? r.total ?? r.totalSum ?? 0),
  }));

const PlintMonthlyReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  // общий фильтр месяца — применяется к обеим таблицам
  const [month, setMonth] = React.useState<string>(toMonthStr());

  // Retail
  const [rowsRetail, setRowsRetail] = React.useState<Row[]>([]);
  const [totalRetail, setTotalRetail] = React.useState<number>(0);
  const [countRetail, setCountRetail] = React.useState<number>(0);

  // Wholesale
  const [rowsWholesale, setRowsWholesale] = React.useState<Row[]>([]);
  const [totalWholesale, setTotalWholesale] = React.useState<number>(0);
  const [countWholesale, setCountWholesale] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [dataRetail, dataWholesale]: any[] = await Promise.all([
        dispatch(fetchPlintMonthlyReportRetail({ cookies, month })).unwrap(),
        dispatch(fetchPlintMonthlyReportWholesale({ cookies, month })).unwrap(),
      ]);

      const rowsR = normalizeRows(dataRetail?.rows ?? []);
      setRowsRetail(rowsR);
      setTotalRetail(Number(dataRetail?.total ?? rowsR.reduce((a, x) => a + (x.sum || 0), 0)));
      setCountRetail(Number(dataRetail?.count ?? rowsR.length));

      const rowsW = normalizeRows(dataWholesale?.rows ?? []);
      setRowsWholesale(rowsW);
      setTotalWholesale(Number(dataWholesale?.total ?? rowsW.reduce((a, x) => a + (x.sum || 0), 0)));
      setCountWholesale(Number(dataWholesale?.count ?? rowsW.length));
    } catch {
      alert('Չհաջողվեց բեռնել հաշվետվությունը (Plint)');
      setRowsRetail([]); setTotalRetail(0); setCountRetail(0);
      setRowsWholesale([]); setTotalWholesale(0); setCountWholesale(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, cookies, month]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PlintMenu />

      {/* Общий фильтр (работает сразу для обеих таблиц) */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8,
          position: 'sticky',
          top: 0,
          background: '#f3f4f6',
          paddingBlock: 8,
          paddingInline: 8,
          zIndex: 1,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <label>
          Ամիս:
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ marginLeft: 6 }}
          />
        </label>
        <button type="button" onClick={load} disabled={loading}>
          {loading ? 'Բեռնվում է…' : 'Թարմացնել'}
        </button>
        <div style={{ marginLeft: 'auto', fontWeight: 600 }}>
          Ընդհանուր՝ Retail + Wholesale: {Number(totalRetail + totalWholesale).toLocaleString()}
        </div>
      </div>

      {/* Сверху: Retail */}
      <PlintReportSection
        title="Մանրածախ պատվերներ (Retail)"
        rows={rowsRetail}
        total={totalRetail}
        count={countRetail}
        loading={loading}
        viewPathPrefix="/plint/orders/view" // общий роут
        height={33}
      />

      {/* Снизу: Wholesale */}
      <PlintReportSection
        title="Մեծածախ պատվերներ (Wholesale)"
        rows={rowsWholesale}
        total={totalWholesale}
        count={countWholesale}
        loading={loading}
        viewPathPrefix="/plint/wholesale/orders/view" // общий роут
        height={33}
      />
    </div>
  );
};

export default PlintMonthlyReport;
