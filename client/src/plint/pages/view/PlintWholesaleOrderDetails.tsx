// pages/plintWholesaleOrder/PlintWholesaleOrderDetails.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { http } from '../../../api/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import AddPlintPayment from '../../../component/confirmButten/AddPlintPayment';
import AddPlintAgentPayment from '../../../component/confirmButten/AddPlintAgentPayment';

type Buyer = {
    _id?: string;
    name?: string;
    phone1?: string;
    address?: string;
    region?: string;
};

type Agent = {
    _id?: string;
    name?: string;
    phone1?: string;
};

type Item = {
    name?: string;
    sku?: string;
    qty?: number;
    price?: number;
    sum?: number;
};

type WholesaleOrderDto = {
    _id: string;
    date?: string | Date;
    paymentMethod?: string;
    buyerComment?: string;
    totalSum?: number;
    balance?: number;

    delivery?: boolean;
    deliveryAddress?: string;
    deliveryPhone?: string;
    deliverySum?: number;

    buyer?: Buyer;
    items?: Item[];

    // опциональные агентские поля
    agent?: Agent | null;
    agentDiscount?: number | null;
    agentSum?: number | null;
};

const ORDER_URL = '/plint-wholesale-order';

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

const n = (v: unknown) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
};
const money = (v?: number | null) => n(v ?? 0).toLocaleString();

const MiniSection: React.FC<{ title: string; hint?: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
    title, hint, defaultOpen = true, children
}) => (
    <details open={defaultOpen} style={{ marginBottom: 8 }}>
        <summary style={{
            cursor: 'pointer', userSelect: 'none', fontWeight: 600, fontSize: 14,
            padding: '6px 8px', border: '1px solid #eee', borderRadius: 6, background: '#fafafa'
        }}>
            {title} {hint ? <span style={{ opacity: 0.7, fontWeight: 400 }}>· {hint}</span> : null}
        </summary>
        <div style={{ padding: 8, border: '1px solid #eee', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            {children}
        </div>
    </details>
);

const MiniTable: React.FC<{ headers: string[]; rightCols?: number[]; children: React.ReactNode }> = ({
    headers, rightCols = [], children
}) => (
    <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} style={{
                            padding: 4,
                            textAlign: rightCols.includes(i) ? 'right' : 'left',
                            borderBottom: '1px solid #eee', background: '#fff',
                            position: 'sticky', top: 0, zIndex: 1
                        }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

const RowCell: React.FC<React.PropsWithChildren<{ right?: boolean }>> = ({ right, children }) => (
    <td style={{ padding: 4, borderBottom: '1px solid #f3f3f3', textAlign: right ? 'right' as const : 'left' }}>
        {children}
    </td>
);

const PlintWholesaleOrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cookies] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [order, setOrder] = React.useState<WholesaleOrderDto | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const pdfRef = React.useRef<HTMLDivElement | null>(null);

    const load = React.useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await http.get(`${ORDER_URL}/${id}`, {
                headers: cookies.access_token ? { Authorization: `Bearer ${cookies.access_token}` } : {},
            });
            setOrder(data);
        } catch {
            setError('Չհաջողվեց բեռնել պատվերը');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    }, [id, cookies]);

    React.useEffect(() => { load(); }, [load]);

    const itemsTotal = (order?.items ?? []).reduce(
        (acc, r) => acc + (r.sum != null ? n(r.sum) : n(r.qty) * n(r.price)),
        0
    );
    const deliverySum = n(order?.deliverySum);
    const grandTotal = itemsTotal + deliverySum;

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm('Հաստատ ջնջե՞մ պատվերը։')) return;
        setDeleting(true);
        try {
            await http.delete(`${ORDER_URL}/${id}`, {
                headers: cookies.access_token ? { Authorization: `Bearer ${cookies.access_token}` } : {},
            });
            navigate('/plint/report/monthly');
        } catch (e: any) {
            window.alert(e?.message || 'Չհաջողվեց ջնջել պատվերը');
        } finally {
            setDeleting(false);
        }
    };

    const handleExportPdf = async () => {
        if (!pdfRef.current) return;
        const opened: HTMLDetailsElement[] = [];
        pdfRef.current.querySelectorAll('details').forEach((d) => {
            const det = d as HTMLDetailsElement;
            if (!det.open) { det.open = true; opened.push(det); }
        });
        await new Promise((r) => setTimeout(r, 50));

        const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`plint_wholesale_order_${id}.pdf`);
        opened.forEach((d) => (d.open = false));
    };

    return (
        <div>
            <PlintMenu />

            {/* Верхняя панель */}
            <div style={{
                position: 'sticky', top: 0, background: '#fff', zIndex: 2,
                padding: 6, borderBottom: '1px solid #eee',
                display: 'flex', gap: 8, alignItems: 'center'
            }}>
                <button type="button" onClick={() => navigate(-1)} style={{ padding: '4px 8px' }}>
                    ← Վերադառնալ
                </button>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Wholesale պատվեր № {id}</div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* 🔻 кнопка оплаты — режим wholesale */}
                    <AddPlintPayment kind="wholesale" id={order?._id} onDone={load} />
                    {/* 🔻 оплата агенту — только если есть агент */}
                    {order?.agent?._id && (
                        <AddPlintAgentPayment
                            agentId={order.agent._id}
                            buyerId={order?.buyer?._id}
                            orderId={order?._id}
                            onDone={load}
                        />
                    )}

                    <button
                        type="button"
                        onClick={handleExportPdf}
                        style={{ padding: '4px 10px', border: '1px solid #ddd', background: '#f7f7f7', borderRadius: 6 }}
                        title="Պահպանել PDF"
                    >
                        Պահպանել PDF
                    </button>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                        Ընդհանուր: {money(grandTotal)} AMD
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ padding: '4px 10px', background: '#e63946', color: '#fff', border: 'none', borderRadius: 6 }}
                        title="Ջնջել պատվերը"
                    >
                        {deleting ? 'Ջնջվում է…' : 'Ջնջել'}
                    </button>
                </div>
            </div>

            <div ref={pdfRef} style={{ padding: 8 }}>
                {loading && <div style={{ fontSize: 13 }}>Բեռնվում է…</div>}
                {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}

                {!loading && !error && order && (
                    <>
                        <MiniSection title="Ընդհանուր տվյալներ" defaultOpen>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 13 }}>
                                <div><b>Ամսաթիվ:</b> {fmtDate(order.date)}</div>
                                <div><b>Վճարման մեթոդ:</b> {order.paymentMethod ?? '—'}</div>
                                <div><b>Balance:</b> {money(order.balance)} AMD</div>

                                <div><b>Գնորդ:</b> {order.buyer?.name ?? '—'}</div>
                                <div><b>Հեռախոս:</b> {order.buyer?.phone1 ?? '—'}</div>
                                <div><b>Մարզ/Հասցե:</b> {[order.buyer?.region, order.buyer?.address].filter(Boolean).join(' / ') || '—'}</div>

                                {order.buyerComment ? (
                                    <div style={{ gridColumn: '1 / -1' }}><b>Մեկնաբանություն:</b> {order.buyerComment}</div>
                                ) : null}
                            </div>
                        </MiniSection>

                        {/* Блок агента (если есть) */}
                        {(order.agent || order.agentDiscount || order.agentSum) && (
                            <MiniSection title="Ագենտ" defaultOpen>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 13 }}>
                                    <div><b>Անուն:</b> {order.agent?.name ?? '—'}</div>
                                    <div><b>Հեռախոս:</b> {order.agent?.phone1 ?? '—'}</div>
                                    <div><b>Զեղչ (%):</b> {order.agentDiscount ?? '—'}</div>
                                    <div><b>Գումար (զեղչից):</b> {money(order.agentSum)} AMD</div>
                                </div>
                            </MiniSection>
                        )}

                        <MiniSection
                            title="Ապրանքների ցանկ"
                            hint={`${order.items?.length ?? 0} տող · ${money(itemsTotal)} AMD`}
                            defaultOpen
                        >
                            <MiniTable headers={['Անվ.', 'Կոդ', 'Քանակ', 'Գին', 'Գումար']} rightCols={[2, 3, 4]}>
                                {(order.items ?? []).map((r, i) => {
                                    const line = r.sum != null ? n(r.sum) : n(r.qty) * n(r.price);
                                    return (
                                        <tr key={i}>
                                            <RowCell>{r.name ?? '—'}</RowCell>
                                            <RowCell>{r.sku ?? '—'}</RowCell>
                                            <RowCell right>{n(r.qty).toLocaleString()}</RowCell>
                                            <RowCell right>{money(r.price)}</RowCell>
                                            <RowCell right>{money(line)}</RowCell>
                                        </tr>
                                    );
                                })}
                            </MiniTable>
                        </MiniSection>

                        <MiniSection title="Առաքում" defaultOpen>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 13 }}>
                                <div><b>Առկա՞ է առաքում:</b> {order.delivery ? 'Այո' : 'Ոչ'}</div>
                                <div><b>Հասցե:</b> {order.deliveryAddress || '—'}</div>
                                <div><b>Հեռախոս:</b> {order.deliveryPhone || '—'}</div>
                                <div><b>Առաքման գումար:</b> {money(order.deliverySum)} AMD</div>
                            </div>
                        </MiniSection>

                        <MiniSection title="Իտոգներ" defaultOpen>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 6, fontSize: 13 }}>
                                <div><b>Ապրանքների գումար:</b> {money(itemsTotal)} AMD</div>
                                <div><b>Առաքում:</b> {money(deliverySum)} AMD</div>
                                <div style={{ gridColumn: '1 / -1', fontWeight: 700 }}>
                                    <b>Ընդհանուր:</b> {money(grandTotal)} AMD
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <b>totalSum (backend):</b> {money(order.totalSum)} AMD
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <b>Մնացորդ (balance):</b> {money(order.balance)} AMD
                                </div>
                            </div>
                        </MiniSection>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlintWholesaleOrderDetails;
