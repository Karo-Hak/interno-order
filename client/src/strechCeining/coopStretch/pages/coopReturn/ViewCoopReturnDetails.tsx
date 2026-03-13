import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { fetchCoopReturnById, deleteCoopReturnById } from '../../features/coopReturn/coopReturnApi';

type TextureRow = {
  name?: string;
  height?: number;
  width?: number;
  qty?: number;
  price?: number;
  sum?: number;
  h?: number; haight?: number;
  w?: number; waight?: number;
};
type SimpleRow = { name?: string; qty?: number; price?: number; sum?: number };

type CoopReturnDto = {
  _id: string;
  date?: string | Date;
  amount?: number;
  reason?: string;
  comment?: string;

  buyer?: { _id?: string; name?: string; phone1?: string; address?: string; region?: string } | any;
  order?: { _id: string; date?: string | Date; balance?: number } | null;
  dkId?: string | null;

  groupedStretchTextureData?: TextureRow[];
  groupedStretchProfilData?: SimpleRow[];
  groupedLightPlatformData?: SimpleRow[];
  groupedLightRingData?: SimpleRow[];
};

const fmtDateTime = (s?: string | Date) =>
  s
    ? new Date(s).toLocaleString('hy-AM', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const money = (v?: number) => num(v).toLocaleString();

const pick = (obj: any, keys: string[], fallback = ''): string =>
  keys
    .map((k) => obj?.[k])
    .find((v) => typeof v === 'string' && v.trim() !== '') ?? fallback;

const sumTexture = (rows: TextureRow[] = []) =>
  rows.reduce((acc, r) => {
    const h = num(r.height ?? r.h ?? r.haight);
    const w = num(r.width ?? r.w ?? r.waight);
    const qty = r.qty != null ? num(r.qty) : h * w;
    const line = r.sum != null ? num(r.sum) : qty * num(r.price);
    return acc + line;
  }, 0);

const sumSimple = (rows: SimpleRow[] = []) =>
  rows.reduce((acc, r) => acc + (r.sum != null ? num(r.sum) : num(r.qty) * num(r.price)), 0);

const MiniSection: React.FC<{
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, hint, defaultOpen = true, children }) => (
  <details open={defaultOpen} style={{ marginBottom: 8 }}>
    <summary
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: 600,
        fontSize: 14,
        padding: '6px 8px',
        border: '1px solid #eee',
        borderRadius: 6,
        background: '#fafafa',
      }}
    >
      {title} {hint ? <span style={{ opacity: 0.7, fontWeight: 400 }}>· {hint}</span> : null}
    </summary>
    <div
      style={{
        padding: 8,
        border: '1px solid #eee',
        borderTop: 'none',
        borderRadius: '0 0 6px 6px',
      }}
    >
      {children}
    </div>
  </details>
);

const MiniTable: React.FC<{
  headers: string[];
  rightCols?: number[];
  children: React.ReactNode;
}> = ({ headers, rightCols = [], children }) => (
  <div style={{ overflow: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: 4,
                textAlign: rightCols.includes(i) ? 'right' : 'left',
                borderBottom: '1px solid #eee',
                background: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const RowCell: React.FC<React.PropsWithChildren<{ right?: boolean }>> = ({
  right,
  children,
}) => (
  <td
    style={{
      padding: 4,
      borderBottom: '1px solid #f3f3f3',
      textAlign: right ? ('right' as const) : ('left' as const),
    }}
  >
    {children}
  </td>
);

const ViewCoopReturnDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cookies] = useCookies(['access_token']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [ret, setRet] = React.useState<CoopReturnDto | null>(null);
  const [loading, setLoad] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!id) return;
    setLoad(true);
    setError(null);
    try {
      const data = await dispatch(fetchCoopReturnById({ cookies, id })).unwrap();
      setRet(data);
    } catch (e) {
      setError('Չհաջողվեց բեռնել վերադարձը');
    } finally {
      setLoad(false);
    }
  }, [dispatch, cookies, id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const textureTotal = sumTexture(ret?.groupedStretchTextureData);
  const profilTotal = sumSimple(ret?.groupedStretchProfilData);
  const platTotal = sumSimple(ret?.groupedLightPlatformData);
  const ringTotal = sumSimple(ret?.groupedLightRingData);
  const computedSum = textureTotal + profilTotal + platTotal + ringTotal;

  const buyerAny = ret?.buyer as any;
  const buyerName = pick(buyerAny, ['name', 'buyerName', 'title'], '—');
  const buyerPhone = pick(buyerAny, ['phone1', 'phone', 'tel', 'phonePrimary'], '—');
  const region = pick(buyerAny, ['region', 'regionName', 'region_title'], '');
  const address = pick(buyerAny, ['address', 'addr', 'addressLine', 'address_line'], '');

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Հաստատ ջնջե՞մ վերադարձը։')) return;
    setDeleting(true);
    try {
      await dispatch(deleteCoopReturnById({ cookies, id })).unwrap();
      navigate('/coopstretchceiling/coopBuyerWallet');
    } catch (e: any) {
      window.alert(e?.message || 'Չհաջողվեց ջնջել վերադարձը');
    } finally {
      setDeleting(false);
    }
  };
console.log(ret);

  return (
    <div>
      <CoopStretchMenu />
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 2,
          padding: 6,
          borderBottom: '1px solid #eee',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <button type="button" onClick={() => navigate(-1)} style={{ padding: '4px 8px' }}>
          ← Վերադառնալ
        </button>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Վերադարձ № {id}</div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Հաշվարկված գումար: {money(computedSum)} AMD
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            (Պահպանված գումար: {money(ret?.amount)} AMD)
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '4px 10px',
              background: '#e63946',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
            }}
            title="Ջնջել վերադարձը"
          >
            {deleting ? 'Ջնջվում է…' : 'Ջնջել'}
          </button>
        </div>
      </div>

      <div style={{ padding: 8 }}>
        {loading && <div style={{ fontSize: 13 }}>Բեռնվում է…</div>}
        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}

        {!loading && !error && ret && (
          <>
            {/* Общая информация */}
            <MiniSection title="Ընդհանուր տվյալներ" defaultOpen>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <div>
                  <b>Ամսաթիվ:</b> {fmtDateTime(ret.date)}
                </div>
                <div>
                  <b>Գնում/Պատվեր:</b>{' '}
                  {ret.order?._id ? (
                    <Link to={`/coopStretchceiling/viewCoopStretchOrder/${ret.order._id}`}>
                      {ret.order._id}
                    </Link>
                  ) : (
                    '—'
                  )}
                </div>
                <div>
                  <b>Գումար:</b> {money(ret.amount)} AMD
                </div>

                <div>
                  <b>Գնորդ:</b> {buyerName}
                </div>
                <div>
                  <b>Հեռախոս:</b> {buyerPhone}
                </div>
                <div>
                  <b>Մարզ/Հասցե:</b>{' '}
                  {[region, address].filter(Boolean).join(' / ') || '—'}
                </div>

                {ret.reason ? (
                  <div>
                    <b>Պատճառ:</b> {ret.reason}
                  </div>
                ) : null}
                {ret.comment ? (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <b>Մեկնաբանություն:</b> {ret.comment}
                  </div>
                ) : null}
              </div>
            </MiniSection>

            {/* Stretch Texture */}
            {!!ret.groupedStretchTextureData?.length && (
              <MiniSection
                title="Stretch Texture (վերադարձ)"
                hint={`տողեր · ${ret.groupedStretchTextureData.length} · ${money(
                  textureTotal
                )} AMD`}
                defaultOpen
              >
                <MiniTable
                  headers={['Անվ.', 'Երկ. (մ)', 'Լայն. (մ)', 'Քանակ (մ²/qty)', 'Գին', 'Գումար']}
                  rightCols={[1, 2, 3, 4, 5]}
                >
                  {ret.groupedStretchTextureData!.map((r, i) => {
                    const h = num(r.height ?? r.h ?? r.haight);
                    const w = num(r.width ?? r.w ?? r.waight);
                    const qty = r.qty != null ? num(r.qty) : h * w;
                    const line = r.sum != null ? num(r.sum) : qty * num(r.price);
                    return (
                      <tr key={i}>
                        <RowCell>{r.name ?? '—'}</RowCell>
                        <RowCell right>{h.toLocaleString()}</RowCell>
                        <RowCell right>{w.toLocaleString()}</RowCell>
                        <RowCell right>{qty.toLocaleString()}</RowCell>
                        <RowCell right>{money(r.price)}</RowCell>
                        <RowCell right>{money(line)}</RowCell>
                      </tr>
                    );
                  })}
                </MiniTable>
              </MiniSection>
            )}

            {/* Profil */}
            {!!ret.groupedStretchProfilData?.length && (
              <MiniSection
                title="Profil (վերադարձ)"
                hint={`${ret.groupedStretchProfilData.length} · ${money(profilTotal)} AMD`}
                defaultOpen
              >
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գումար']} rightCols={[1, 2, 3]}>
                  {ret.groupedStretchProfilData!.map((r, i) => {
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
            {!!ret.groupedLightPlatformData?.length && (
              <MiniSection
                title="Light Platform (վերադարձ)"
                hint={`${ret.groupedLightPlatformData.length} · ${money(platTotal)} AMD`}
                defaultOpen
              >
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գումար']} rightCols={[1, 2, 3]}>
                  {ret.groupedLightPlatformData!.map((r, i) => {
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
            {!!ret.groupedLightRingData?.length && (
              <MiniSection
                title="Light Ring (վերադարձ)"
                hint={`${ret.groupedLightRingData.length} · ${money(ringTotal)} AMD`}
                defaultOpen
              >
                <MiniTable headers={['Անվ.', 'Քան.', 'Գին', 'Գումար']} rightCols={[1, 2, 3]}>
                  {ret.groupedLightRingData!.map((r, i) => {
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

export default ViewCoopReturnDetails;
