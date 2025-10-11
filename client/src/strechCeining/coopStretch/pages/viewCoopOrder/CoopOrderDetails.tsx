import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { fetchCoopOrderById, deleteCoopOrderById } from '../../features/coopCeilingOrder/coopCeilingOrderApi';
import AddCoopPayment from '../../../../component/confirmButten/AddCoopPayment';

type TextureRow = {
  name?: string;
  height?: number;  // м
  width?: number;   // м
  sq?: number;      // м²
  qty?: number;     // исторически sq могло лежать тут
  price?: number;   // AMD
  sum?: number;     // AMD
  h?: number; haight?: number;
  w?: number; waight?: number;
};
type SimpleRow = { name?: string; qty?: number; price?: number; sum?: number; };

type CoopOrderDto = {
  _id: string;
  date?: string | Date;
  paymentMethod?: string;
  buyerComment?: string;
  balance?: number;
  buyer?: { _id?: string; name?: string; phone1?: string; address?: string; region?: string };
  groupedStretchTextureData?: TextureRow[];
  groupedStretchProfilData?: SimpleRow[];
  groupedLightPlatformData?: SimpleRow[];
  groupedLightRingData?: SimpleRow[];
};

const fmtDate = (s?: string | Date) =>
  s ? new Date(s).toLocaleString('hy-AM', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }) : '—';

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const money = (v?: number) => num(v).toLocaleString();

const sumTexture = (rows: TextureRow[] = []) =>
  rows.reduce((acc, r) => {
    const h = num(r.height ?? r.h ?? r.haight);
    const w = num(r.width ?? r.w ?? r.waight);
    const sq = (r.sq != null ? num(r.sq) : (r.qty != null ? num(r.qty) : h * w));
    const line = r.sum != null ? num(r.sum) : sq * num(r.price);
    return acc + line;
  }, 0);

const sumSimple = (rows: SimpleRow[] = []) =>
  rows.reduce((acc, r) => acc + (r.sum != null ? num(r.sum) : num(r.qty) * num(r.price)), 0);

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

const CoopOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cookies] = useCookies(['access_token']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = React.useState<CoopOrderDto | null>(null);
  const [loading, setLoad] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!id) return;
    setLoad(true); setError(null);
    try {
      const o = await dispatch(fetchCoopOrderById({ cookies, id })).unwrap();
      setOrder(o);
    } catch {
      setError('Չհաջողվեց բեռնել պատվերը');
    } finally {
      setLoad(false);
    }
  }, [dispatch, cookies, id]);

  React.useEffect(() => { load(); }, [load]);

  const textureTotal = sumTexture(order?.groupedStretchTextureData);
  const profilTotal = sumSimple(order?.groupedStretchProfilData);
  const platTotal = sumSimple(order?.groupedLightPlatformData);
  const ringTotal = sumSimple(order?.groupedLightRingData);
  const grandTotal = textureTotal + profilTotal + platTotal + ringTotal;

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Հաստատ ջնջե՞մ պատվերը։')) return;
    setDeleting(true);
    try {
      await dispatch(deleteCoopOrderById({ cookies, id })).unwrap();
      navigate('/coopStretchceiling/report');
    } catch (e: any) {
      window.alert(e?.message || 'Չհաջողվեց ջնջել պատվերը');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <CoopStretchMenu />

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, background: '#fff', zIndex: 2,
        padding: 6, borderBottom: '1px solid #eee',
        display: 'flex', gap: 8, alignItems: 'center'
      }}>
        <button type="button" onClick={() => navigate(-1)} style={{ padding: '4px 8px' }}>
          ← Վերադառնալ
        </button>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Պատվեր № {id}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div><AddCoopPayment id={order?._id} /></div>
          <div style={{ fontWeight: 700, fontSize: 14, alignSelf: 'center' }}>
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

      <div style={{ padding: 8 }}>
        {loading && <div style={{ fontSize: 13 }}>Բեռնվում է…</div>}
        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}
        {!loading && !error && order && (
          <>
            {/* Общая информация */}
            <MiniSection title="Ընդհանուր տվյալներ" defaultOpen>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 13 }}>
                <div><b>Ամսաթիվ:</b> {fmtDate(order.date)}</div>
                <div><b>Վճարման մեթոդ:</b> {order.paymentMethod ?? '—'}</div>
                <div><b>Balance:</b> {money(order.balance)} AMD</div>
                <div><b>Գնորդ:</b> {order.buyer?.name ?? '—'}</div>
                <div><b>Հեռախոս:</b> {order.buyer?.phone1 ?? '—'}</div>
                <div><b>Մարզ/Հասցե:</b> {[order.buyer?.region, order.buyer?.address].filter(Boolean).join(' / ') || '—'}</div>
                {order.buyerComment ? <div style={{ gridColumn: '1 / -1' }}><b>Մեկնաբանություն:</b> {order.buyerComment}</div> : null}
              </div>
            </MiniSection>

            {/* Stretch Texture — всегда открыто, с Height/Width/Sq */}
            {!!order.groupedStretchTextureData?.length && (
              <MiniSection
                title="Stretch Texture"
                hint={`նյութեր · ${order.groupedStretchTextureData.length} հա. · ${money(textureTotal)} AMD`}
                defaultOpen
              >
                <MiniTable
                  headers={['Անվ.', 'Մակ (մ)', 'Լայն (մ)', 'Մ²', 'Քան. (պատմ.)', 'Գին', 'Գումար']}
                  rightCols={[1, 2, 3, 4, 5, 6]}
                >
                  {order.groupedStretchTextureData!.map((r, i) => {
                    const h = num(r.height ?? r.h ?? r.haight);
                    const w = num(r.width ?? r.w ?? r.waight);
                    const sq = (r.sq != null ? num(r.sq) : (r.qty != null ? num(r.qty) : h * w));
                    const line = r.sum != null ? num(r.sum) : sq * num(r.price);
                    return (
                      <tr key={i}>
                        <RowCell>{r.name ?? '—'}</RowCell>
                        <RowCell right>{h.toLocaleString()}</RowCell>
                        <RowCell right>{w.toLocaleString()}</RowCell>
                        <RowCell right>{sq.toLocaleString()}</RowCell>
                        <RowCell right>{num(r.qty).toLocaleString()}</RowCell>
                        <RowCell right>{money(r.price)}</RowCell>
                        <RowCell right>{money(line)}</RowCell>
                      </tr>
                    );
                  })}
                </MiniTable>
              </MiniSection>
            )}

            {/* Profil */}
            {!!order.groupedStretchProfilData?.length && (
              <MiniSection title="Profil" hint={`${order.groupedStretchProfilData.length} տող · ${money(profilTotal)} AMD`} defaultOpen>
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գუმար']} rightCols={[1, 2, 3]}>
                  {order.groupedStretchProfilData!.map((r, i) => {
                    const line = r.sum != null ? num(r.sum) : num(r.qty) * num(r.price);
                    return (
                      <tr key={i}>
                        <RowCell>{r.name ?? '—'}</RowCell>
                        <RowCell right>{num(r.qty).toLocaleString()}</RowCell>
                        <RowCell right>{money(r.price)}</RowCell>
                        <RowCell right>{money(line)}</RowCell>
                      </tr>
                    );
                  })}
                </MiniTable>
              </MiniSection>
            )}

            {/* Light Platform */}
            {!!order.groupedLightPlatformData?.length && (
              <MiniSection title="Light Platform" hint={`${order.groupedLightPlatformData.length} · ${money(platTotal)} AMD`} defaultOpen>
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գումար']} rightCols={[1, 2, 3]}>
                  {order.groupedLightPlatformData!.map((r, i) => {
                    const line = r.sum != null ? num(r.sum) : num(r.qty) * num(r.price);
                    return (
                      <tr key={i}>
                        <RowCell>{r.name ?? '—'}</RowCell>
                        <RowCell right>{num(r.qty).toLocaleString()}</RowCell>
                        <RowCell right>{money(r.price)}</RowCell>
                        <RowCell right>{money(line)}</RowCell>
                      </tr>
                    );
                  })}
                </MiniTable>
              </MiniSection>
            )}

            {/* Light Ring */}
            {!!order.groupedLightRingData?.length && (
              <MiniSection title="Light Ring" hint={`${order.groupedLightRingData.length} · ${money(ringTotal)} AMD`} defaultOpen>
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գումար']} rightCols={[1, 2, 3]}>
                  {order.groupedLightRingData!.map((r, i) => {
                    const line = r.sum != null ? num(r.sum) : num(r.qty) * num(r.price);
                    return (
                      <tr key={i}>
                        <RowCell>{r.name ?? '—'}</RowCell>
                        <RowCell right>{num(r.qty).toLocaleString()}</RowCell>
                        <RowCell right>{money(r.price)}</RowCell>
                        <RowCell right>{money(line)}</RowCell>
                      </tr>
                    );
                  })}
                </MiniTable>
              </MiniSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoopOrderDetails;
