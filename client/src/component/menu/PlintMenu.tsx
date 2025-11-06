import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { userProfile } from "../../features/user/userApi";
import { useCookies } from "react-cookie";

interface PlintMenuProps {}

export const PlintMenu: React.FC<PlintMenuProps> = () => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // Безопасное открытие в новом окне (правая кнопка)
  const openInNewWindow = useCallback((path: string) => {
    window.open(path, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // если нет токена — на логин
        if (!cookies?.access_token) {
          navigate("/");
          return;
        }

        await dispatch(userProfile(cookies)).unwrap();
        // если нужно — можно выставить локальный стейт по mounted
        if (!mounted) return;
      } catch {
        // невалидный токен — чистим и уходим на логин
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      }
    })();

    return () => {
      mounted = false;
    };
    // ✅ все используемые зависимости в deps
  }, [dispatch, cookies, navigate, setCookie]);

  // --- Навигация (левая кнопка)
  const home = () => navigate("/plint/report/monthly");

  const plintBuyer = () => navigate("/plint/plintBuyer");
  const plintAgent = () => navigate("/plint/plintAgent");
  const addPlint = () => navigate("/plint/addPlint");
  const newPlintRetailOrder = () => navigate("/plint/plintRetailOrder");
  const newPlintWholesaleOrder = () => navigate("/plint/plintWholesaleOrder");
  const stockPlint = () => navigate("/plint/stockPlint");
  const inputOutputPlint = () => navigate("/plint/inputOutputPlint");
  const plintProduction = () => navigate("/plint/plintProduction");
  const viewPlintOrders = () => navigate("/plint/viewPlintOrdersList");
  const viewMaterialsOrders = () => navigate("/plint/viewMaterial");
  const viewDebetKredit = () => navigate("/plint/debet-kredit");

  // --- Новое окно (правая кнопка). Не забываем preventDefault
  const onCtx = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    openInNewWindow(path);
  };

  return (
    <div className="admin_profile">
      <div style={{ textAlign: "left", width: "10%" }}>
        <button className="btn" onClick={home}>
          Գլխավոր Էջ
        </button>
      </div>

      <div className="admin_profile">
        <button
          className="btn"
          onClick={newPlintRetailOrder}
          onContextMenu={onCtx("/plint/plintRetailOrder")}
          title="ЛКМ — открыть, ПКМ — новое окно"
        >
          Մանրածախ
        </button>

        <button
          className="btn"
          onClick={newPlintWholesaleOrder}
          onContextMenu={onCtx("/plint/plintWholesaleOrder")}
        >
          Մեծածախ
        </button>

        <button
          className="btn"
          onClick={plintBuyer}
          onContextMenu={onCtx("/plint/plintBuyer")}
        >
          + Գնորդ
        </button>

        <button
          className="btn"
          onClick={plintAgent}
          onContextMenu={onCtx("/plint/plintAgent")}
        >
          + Միջնորդ
        </button>

        <button
          className="btn"
          onClick={addPlint}
          onContextMenu={onCtx("/plint/addPlint")}
        >
          + Շրիշակ
        </button>

        <button
          className="btn"
          onClick={stockPlint}
          onContextMenu={onCtx("/plint/stockPlint")}
        >
          Պահեստ
        </button>

        <button
          className="btn"
          onClick={plintProduction}
          onContextMenu={onCtx("/plint/plintProduction")}
        >
          Արտադրություն
        </button>

        <button
          className="btn"
          onClick={inputOutputPlint}
          onContextMenu={onCtx("/plint/inputOutputPlint")}
        >
          Գույքագրում
        </button>

        <button
          className="btn"
          onClick={viewPlintOrders}
          onContextMenu={onCtx("/plint/viewPlintOrdersList")}
        >
          Դիտել Պատվերները
        </button>

        <button
          className="btn"
          onClick={viewMaterialsOrders}
          onContextMenu={onCtx("/plint/viewMaterial")}
        >
          Նյութածախս
        </button>

        <button
          className="btn"
          onClick={viewDebetKredit}
          onContextMenu={onCtx("/plint/debet-kredit")}
        >
          Դեբետ/Կրեդիտ
        </button>
      </div>
    </div>
  );
};
