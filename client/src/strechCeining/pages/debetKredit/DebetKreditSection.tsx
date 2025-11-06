import React, { FC, useEffect, useMemo, useState } from "react";
import { BuyerDebetKreditSection } from "./BuyerDebetKreditSection";
import AddPayment from "../../../component/confirmButten/AddPayment";
import { useAppDispatch } from "../../../app/hooks";
import { DebetKreditItem } from "../../features/debetKredit/typs/typsDK";
import { fetchOrdersBriefBatch, OrderBrief } from "../../features/stretchCeilingOrder/stretchOrderApi";

type OrdersBriefMap = Record<string, {
  buyerName?: string;
  buyerPhone1?: string;
  prepayment?: number;
  groundTotal?: number;
}>;

type OrderRow = {
  _id: string;                 // buyerId
  buyerName: string;
  buyerPhone1: string;
  buyerPhone2?: string;
  debetKredit: DebetKreditItem[];
  sumKredit: number;           // остаток по покупателю
  buy: number;                 // будет вычислен из debetKredit
  payment: number;             // будет вычислен из debetKredit
  order: any[];                // список orderId'ов (строки или объекты)
};

type Props = {
  ordersList: OrderRow[];
  parseDate: (date: string) => string;
  cookies: { access_token?: string };
};

// Нормализация orderId к строке
const toOrderId = (x: any): string | undefined => {
  if (!x) return undefined;
  if (typeof x === 'string') return x;
  if (typeof x === 'object' && typeof x._id === 'string') return x._id;
  try { return String(x); } catch { return undefined; }
};

export const DebetKreditSection: FC<Props> = ({ ordersList, parseDate, cookies }) => {
  const dispatch = useAppDispatch();

  // агрегаты по ПОКУПАТЕЛЮ
  const updatedOrdersList = useMemo(() => {
    return (ordersList ?? []).map((order) => {
      let sumBuy = 0, sumPayment = 0;
      order.debetKredit.forEach((e) => {
        if (e.type === "Գնում") sumBuy += e.amount;
        else if (e.type === "Վճարում") sumPayment += e.amount;
      });
      return { ...order, buy: sumBuy, payment: sumPayment };
    });
  }, [ordersList]);

  const [byOrders, setByOrders] = useState(false);
  const [ordersBrief, setOrdersBrief] = useState<OrdersBriefMap>({});

  // уникальные orderIds (строки)
  const uniqueOrderIds = useMemo(() => {
    const s = new Set<string>();
    for (const row of updatedOrdersList) {
      for (const raw of row.order ?? []) {
        const id = toOrderId(raw);
        if (id) s.add(id);
      }
      for (const dk of row.debetKredit ?? []) {
        const id = toOrderId((dk as any).order);
        if (id) s.add(id);
      }
    }
    return Array.from(s);
  }, [updatedOrdersList]);

  // батч-подтягивание prepayment/groundTotal при включении режима
  useEffect(() => {
    const run = async () => {
      if (!byOrders || !uniqueOrderIds.length) return;
      try {
        const res = await dispatch(
          fetchOrdersBriefBatch({ cookies, orderIds: uniqueOrderIds })
        ).unwrap();
        const map: OrdersBriefMap = {};
        (res as OrderBrief[]).forEach((o) => {
          map[o._id] = {
            buyerName: o.buyerName,
            buyerPhone1: o.buyerPhone1,
            prepayment: o.prepayment,
            groundTotal: o.groundTotal,
          };
        });
        setOrdersBrief(map);
      } catch {
        // игнорируем ошибки батча
      }
    };
    run();
  }, [byOrders, uniqueOrderIds, cookies, dispatch]);

  // раскрытие списка движений по покупателю
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const init: Record<string, boolean> = {};
    updatedOrdersList.forEach((o) => (init[o._id] = false));
    setOpen(init);
  }, [updatedOrdersList]);

  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));
  const viewOrder = (id: string) => window.open("/stretchceiling/viewStretchOrder/" + id, "_blank");

  // агрегаты по КАЖДОМУ заказу внутри покупателя
  const computePerOrderRows = (row: OrderRow) => {
    const map: Record<string, { buy: number; payment: number }> = {};

    for (const dk of row.debetKredit ?? []) {
      const oid = toOrderId((dk as any).order);
      if (!oid) continue;
      if (!map[oid]) map[oid] = { buy: 0, payment: 0 };
      if (dk.type === "Գնում") map[oid].buy += dk.amount;
      else if (dk.type === "Վճարում") map[oid].payment += dk.amount;
    }

    const idsFromRow = (row.order ?? []).map(toOrderId).filter(Boolean) as string[];
    const ids = idsFromRow.length ? idsFromRow : Object.keys(map);

    return ids.map((oid) => {
      const agg = map[oid] ?? { buy: 0, payment: 0 };
      const brief = ordersBrief[oid];
      return {
        orderId: oid,
        buy: agg.buy,
        payment: agg.payment,
        balance: agg.buy - agg.payment,
        prepayment: brief?.prepayment,
        groundTotal: brief?.groundTotal,
        buyerName: brief?.buyerName ?? row.buyerName,
        buyerPhone1: brief?.buyerPhone1 ?? row.buyerPhone1,
      };
    });
  };

  if (!updatedOrdersList.length) return null;

  return (
    <div>
      <div className="newStretchOrderSection_head">
        <div className="newStretchOrderSection_head_name">
          Ձգվող առաստաղ (Դեբետ/Կրեդիտ)
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={byOrders}
              onChange={(e) => setByOrders(e.target.checked)}
            />
            <span>Պատկերացնել ըստ պատվերների</span>
          </label>
        </div>
      </div>

      {/* Режим ПОКУПАТЕЛИ */}
      {!byOrders && (
        <table className="newStretchOrders">
          <thead>
            <tr>
              <th></th>
              <th>Անուն Ազգանուն</th>
              <th>Հեռախոս</th>
              <th>Գնում</th>
              <th>Վճարում</th>
              <th>Մնացորդ</th>
              <th>Մուտք</th>
            </tr>
          </thead>
          <tbody>
            {updatedOrdersList.map((e) => {
              const firstOrderId = ((e.order ?? []).map(toOrderId).filter(Boolean) as string[])[0];
              return (
                <React.Fragment key={e._id}>
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!open[e._id]}
                        onChange={() => toggle(e._id)}
                      />
                    </td>
                    <td><p>{e.buyerName}</p></td>
                    <td><p style={{ minWidth: 100 }}>{e.buyerPhone1}</p></td>
                    <td><p>{e.buy}</p></td>
                    <td><p>{e.payment}</p></td>
                    <td style={{ backgroundColor: e.sumKredit <= 0 ? 'lightgreen' : 'red' }}>
                      <p>{e.sumKredit}</p>
                    </td>
                    <td>
                      {firstOrderId ? (
                        <AddPayment id={firstOrderId} variant="tag" />
                      ) : (
                        <span style={{ opacity: .6 }}>—</span>
                      )}
                    </td>
                  </tr>
                  {open[e._id] && (
                    <BuyerDebetKreditSection order={e.debetKredit} parseDate={parseDate} />
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Режим ЗАКАЗЫ */}
      {byOrders && (
        <table className="newStretchOrders" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Անուն Ազգանուն</th>
              <th>Հեռախոս</th>
              <th>Գնում</th>
              <th>Վճարում</th>
              <th>Մնացորդ</th>
              <th>Prepayment</th>
              <th>Ground Total</th>
              <th>Դիտել</th>
              <th>Մուտք</th>
            </tr>
          </thead>
          <tbody>
            {updatedOrdersList.flatMap((row) =>
              computePerOrderRows(row).map((r) => (
                <tr key={`${row._id}_${r.orderId}`}>
                  <td>{r.orderId}</td>
                  <td>{r.buyerName}</td>
                  <td>{r.buyerPhone1}</td>
                  <td>{r.buy}</td>
                  <td>{r.payment}</td>
                  <td style={{ backgroundColor: r.balance <= 0 ? "lightgreen" : "red" }}>
                    {r.balance}
                  </td>
                  <td>{r.prepayment ?? "—"}</td>
                  <td>{r.groundTotal ?? "—"}</td>
                  <td>
                    <button type="button" className="btn" style={{ color: "black" }} onClick={() => viewOrder(r.orderId)}>
                      Ավելին
                    </button>
                  </td>
                  <td><AddPayment id={r.orderId} variant="tag" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
