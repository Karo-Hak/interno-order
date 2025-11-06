import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { fetchCoopMonthlyReport } from '../../features/coopCeilingOrder/coopCeilingOrderApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';

const fmtDate = (s: string | Date) =>
    new Date(s).toLocaleString('hy-AM', { year: 'numeric', month: '2-digit', day: '2-digit' });

const toMonthStr = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

type Row = {
    _id: string;           // id заказа
    date: string | Date;   // дата заказа
    buyerName?: string;    // имя покупателя (нормализовано)
    buyerPhone?: string;   // телефон покупателя (нормализовано)
    sum: number;           // сумма заказа
};

const CoopMonthlyReport: React.FC = () => {
    const dispatch = useAppDispatch();
    const [cookies] = useCookies(['access_token']);

    const [month, setMonth] = React.useState<string>(toMonthStr());
    const [rows, setRows] = React.useState<Row[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [count, setCount] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await dispatch(fetchCoopMonthlyReport({ cookies, month })).unwrap();
            // 🔧 Нормализуем названия полей из API (buyerName/name/buyer.name; buyerPhone/phone1/buyer.phone1)
            const normRows: Row[] = (data?.rows ?? []).map((r: any) => ({
                _id: String(r._id),
                date: r.date,
                buyerName: r.buyerName ?? r.name ?? r?.buyer?.name ?? '',
                buyerPhone: r.buyerPhone ?? r.phone1 ?? r?.buyer?.phone1 ?? '',
                sum: Number(r.sum ?? 0),
            }));
            setRows(normRows);
            setTotal(Number(data?.total ?? 0));
            setCount(Number(data?.count ?? normRows.length));
        } catch {
            alert('Չհաջողվեց բեռնել հաշվետվությունը');
            setRows([]);
            setTotal(0);
            setCount(0);
        } finally {
            setLoading(false);
        }
    }, [dispatch, cookies, month]);

    React.useEffect(() => { load(); }, [load]);

    return (
        <div>
            <CoopStretchMenu />

            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 8,
                    position: 'sticky',
                    top: 0,
                    background: '#d1dbd9ff',
                    paddingBlock: 8,
                    paddingInline: 8,
                    zIndex: 1,
                    borderBottom: '1px solid #312222ff',
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
                    Ընդհանուր ({count} պատվեր): {total.toLocaleString()}
                </div>
            </div>

            <div style={{ overflow: 'auto', maxHeight: '70vh', paddingInline: 8, position: 'relative' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr>
                            {[
                                'Ամսաթիվ',
                                'Գնորդ',
                                'Հեռախոս',
                                'Գումար',
                            ].map((title) => (
                                <th
                                    key={title}
                                    style={{
                                        position: 'sticky',
                                        top: 0,                 // 👈 вместо 48
                                        background: '#e9d8d8ff',     // 👈 чтобы не просвечивало
                                        zIndex: 2,              // 👈 поверх строк
                                        borderBottom: '1px solid #241010ff',
                                        padding: 6,
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
                            <tr key={r._id}
                                style={{
                                    borderBottom: '1px solid #161515ff',
                                    background: '#e3e4e6ff'
                                }}>
                                <td style={{borderBottom: '1px solid #161515ff'}}>
                                    <Link to={`/coopStretchceiling/viewCoopStretchOrder/${r._id}`}>
                                        {new Date(r.date).toLocaleString('hy-AM', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </Link>
                                </td>
                                <td style={{borderBottom: '1px solid #161515ff'}}>
                                    <Link to={`/coopStretchceiling/viewCoopStretchOrder/${r._id}`}>
                                        {r.buyerName || '—'}
                                    </Link>
                                </td>
                                <td style={{borderBottom: '1px solid #161515ff'}}>
                                    {r.buyerPhone || '—'}
                                </td>
                                <td style={{borderBottom: '1px solid #161515ff'}}>
                                    {Number(r.sum || 0).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {rows.length > 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan={3} style={{ padding: 6, fontWeight: 700, textAlign: 'right' }}>Ընդհանուր</td>
                                <td style={{ padding: 6, fontWeight: 700, textAlign: 'right' }}>
                                    {total.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

        </div>
    );
};

export default CoopMonthlyReport;
