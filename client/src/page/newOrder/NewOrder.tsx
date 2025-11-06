import "./newOrder.css";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrder } from "../../features/order/orderSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { findNewOrder } from "../../features/order/orderApi";
import ImageUpload from "../uploadImg/uploadImg";
import { WallpaperMenu } from "../../component/menu/WallpaperMenu";

const fmtDate = (v?: string | Date) => {
  if (!v) return "—";
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`;
};

const fmtNum = (n: unknown) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return new Intl.NumberFormat("hy-AM", { maximumFractionDigits: 2 }).format(x);
};

export const NewOrder: React.FC = (): JSX.Element => {
  const orderState = useAppSelector(selectOrder);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await dispatch(findNewOrder({ params, cookies }) as any).unwrap?.();
        // Если твой thunk возвращает {error}, обработаем это
        if (res && typeof res === "object" && "error" in res) {
          if (isMounted) setLoadError(String((res as any).error ?? "Error loading order"));
        }
      } catch (e: any) {
        if (isMounted) setLoadError(String(e?.message ?? "Error loading order"));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [dispatch, cookies, params]);

  const ord = orderState?.order;

  const buyer = ord?.buyer ?? {};
  const texture = ord?.texture ?? {};

  // вычислим красиво заголовок статуса и дату
  const titleLine = useMemo(() => {
    const d = fmtDate(ord?.date);
    const st = ord?.status ?? "—";
    return `Date - ${d} | Status - ${st}`;
  }, [ord?.date, ord?.status]);

  return (
    <div>
      <WallpaperMenu />
      <div className="profile">
        {loading ? (
          <div className="order-loading">Բեռնվում է…</div>
        ) : loadError ? (
          <div className="order-error">
            Չստացվեց բեռնել պատվերը: {loadError}
            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => navigate(-1)}>Վերադառնալ</button>
            </div>
          </div>
        ) : ord && ord._id ? (
          <div className="divOrder">
            <div>
              <h5>{titleLine}</h5>

              {/* Buyer table */}
              <table className="table" style={{ color: "white" }}>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Adress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{buyer?.name ?? "—"}</td>
                    <td>{buyer?.phone ?? "—"}</td>
                    <td>{buyer?.adress ?? "—"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Order details */}
              <table className="table" style={{ color: "white" }}>
                <thead>
                  <tr>
                    <th scope="col">Weight/Height</th>
                    <th scope="col">Square</th>
                    <th scope="col">Price</th>
                    <th scope="col">Picture</th>
                    <th scope="col">Texture</th>
                    <th scope="col">Prepayment</th>
                    <th scope="col">Total</th>
                    <th scope="col">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{fmtNum(ord?.weight)} x {fmtNum(ord?.height)}</td>
                    <td>{fmtNum(ord?.sqMetr)}</td>
                    <td>{fmtNum(ord?.price)}</td>
                    <td>{ord?.picCode ?? "—"}</td>
                    <td>{texture?.name ?? "—"}</td>
                    <td>{fmtNum(ord?.prepayment)}</td>
                    <td>{fmtNum(ord?.total)}</td>
                    <td>{fmtDate(ord?.deadline)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="divOrder">
                <h5>Balance {fmtNum(ord?.groundTotal)}</h5>
                <ImageUpload />
              </div>
            </div>

            {/* Комментарий */}
            <div style={{ border: "2px solid white", padding: 8, marginTop: 8 }}>
              <h6 style={{ margin: 0 }}>{ord?.comment ?? ""}</h6>
            </div>

            {/* Картинка */}
            <div>
              {ord?.picUrl ? (
                <img
                  src={ord.picUrl}
                  className="rounded float-end orderImg"
                  alt="Order image"
                />
              ) : (
                <div className="order-no-image">Նկար չկա</div>
              )}
            </div>
          </div>
        ) : (
          <div className="order-empty">Պատվերը չի գտնվել</div>
        )}
      </div>
    </div>
  );
};
