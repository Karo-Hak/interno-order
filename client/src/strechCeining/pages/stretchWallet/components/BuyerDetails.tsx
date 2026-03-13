import React from 'react';
import { useCookies } from 'react-cookie';


import { StretchBuyerEntry } from './types';
import { fmtDate, fmtMoney } from './utils';
import { useAppDispatch } from '../../../../app/hooks';
import { findStretchOrder } from '../../../features/stretchCeilingOrder/stretchOrderApi';
import AddPayment from '../../../../component/confirmButten/AddPayment';

type Props = {
  buy?: StretchBuyerEntry[];
  credit?: StretchBuyerEntry[];
  buySum: number;
  creditSum: number;
  total: number;
};

/* ---------------- helpers ---------------- */

function deepFindAddress(obj: any, seen = new WeakSet()): string | undefined {
  if (!obj || typeof obj !== 'object') return;
  if (seen.has(obj)) return;
  seen.add(obj);

  if (Object.prototype.hasOwnProperty.call(obj, 'address')) {
    const v = (obj as any).address;
    if (typeof v === 'string' && v.trim()) return v.trim();
  }

  for (const key of Object.keys(obj)) {
    const v = (obj as any)[key];
    if (typeof v === 'string' && key.toLowerCase() === 'address' && v.trim()) {
      return v.trim();
    }
    if (v && typeof v === 'object') {
      const found = deepFindAddress(v, seen);
      if (found) return found;
    }
  }
  return;
}

function extractAddressRobust(payload: any): string {
  const roots = [payload, payload?.data, payload?.order, payload?.result, payload?.payload];

  for (const r of roots) {
    const v =
      r?.address ||
      r?.buyerAddress ||
      r?.objectAddress ||
      r?.location ||
      r?.buyer?.address;
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  for (const r of roots) {
    const deep = deepFindAddress(r);
    if (deep) return deep;
  }
  return '—';
}

/* ---------------- component ---------------- */

export const BuyerDetails: React.FC<Props> = ({
  buy,
  credit,
  buySum,
  creditSum,
  total,
}) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['access_token']);

  const [addrMap, setAddrMap] = React.useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});

  const sortedBuy = React.useMemo(
    () =>
      [...(buy ?? [])].sort(
        (a, b) =>
          new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
      ),
    [buy],
  );

  const sortedCredit = React.useMemo(
    () =>
      [...(credit ?? [])].sort(
        (a, b) =>
          new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
      ),
    [credit],
  );

  const viewOrder = (id: string) => {
    if (!id) return;
    window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
  };

  React.useEffect(() => {
    const ids = Array.from(
      new Set(
        (buy ?? [])
          .map((x) => String(x.orderId || '').trim())
          .filter(Boolean),
      ),
    );

    const toLoad = ids.filter((id) => !addrMap[id] && !loadingMap[id]);
    if (!toLoad.length) return;

    let canceled = false;

    (async () => {
      setLoadingMap((m) => {
        const next = { ...m };
        for (const id of toLoad) next[id] = true;
        return next;
      });

      for (const id of toLoad) {
        try {
          const action = await dispatch(
            findStretchOrder({ cookies, params: { id } }),
          );
          if (canceled) break;

          const payload: any = (action as any)?.payload;

          if (process.env.NODE_ENV !== 'production' && !addrMap[id]) {
            // eslint-disable-next-line no-console
            console.debug('[BuyerDetails] payload for', id, payload);
          }

          const addr = extractAddressRobust(payload);
          setAddrMap((m) => ({ ...m, [id]: addr }));
        } catch {
          if (canceled) break;
          setAddrMap((m) => ({ ...m, [id]: '—' }));
        } finally {
          if (canceled) break;
          setLoadingMap((m) => {
            const next = { ...m };
            delete next[id];
            return next;
          });
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [buy, cookies, dispatch]);

  return (
    <td colSpan={11} style={{ background: '#fafafa', padding: 12 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* BUY */}
        <div style={{ minWidth: 320, flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Գնումներ</div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումար</th>
                <th>Հասցե</th>
                <th>Պատվեր</th>
                <th>Վճարել</th>
              </tr>
            </thead>
            <tbody>
              {sortedBuy.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ opacity: 0.7 }}>
                    —
                  </td>
                </tr>
              ) : (
                sortedBuy.map((b, i) => {
                  const id = String(b.orderId || '').trim();
                  const loading = !!loadingMap[id];
                  const addr = addrMap[id] ?? '—';

                  return (
                    <tr key={`buy_${i}`}>
                      <td>{fmtDate(b.date)}</td>
                      <td>{fmtMoney(b.sum)}</td>
                      <td title={addr}>
                        {loading ? '…' : addr?.trim() ? addr : '—'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn"
                          style={{ color: 'black' }}
                          onClick={() => viewOrder(id)}
                          disabled={!id}
                          title={
                            id ? 'Դիտել պատվերը' : 'Պատվերի ID չկա'
                          }
                        >
                          Դիտել
                        </button>
                      </td>
                      <td><AddPayment id={id.toString()} variant="tag"/></td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 600 }}>Ընդամենը</td>
                <td style={{ fontWeight: 600 }}>{fmtMoney(buySum)}</td>
                <td />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CREDIT */}
        <div style={{ minWidth: 320, flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Վճարումներ</div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Ամսաթիվ</th>
                <th>Գումар</th>
              </tr>
            </thead>
            <tbody>
              {sortedCredit.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ opacity: 0.7 }}>
                    —
                  </td>
                </tr>
              ) : (
                sortedCredit.map((c, i) => (
                  <tr key={`credit_${i}`}>
                    <td>{fmtDate(c.date)}</td>
                    <td>{fmtMoney(c.sum)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 600 }}>Ընդամենը</td>
                <td style={{ fontWeight: 600 }}>{fmtMoney(creditSum)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Итоги */}
      <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div>
          Մնացորդ (totalSum): <b>{fmtMoney(total)}</b>
        </div>
        <div style={{ opacity: 0.7 }}>
          (Գնումներ − Վճարումներ = {fmtMoney(buySum - creditSum)})
        </div>
      </div>
    </td>
  );
};
