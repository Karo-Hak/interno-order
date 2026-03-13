import React, { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../../app/hooks";
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { getAllPlint, adjustPlintStock } from "../../features/plint/plintApi";
import "./inputOutputPlint.css";

type PlintLean = {
  _id: string;
  name: string;
  stockBalance: number;
};

export const InputOutputPlint: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [plint, setPlint] = useState<PlintLean[]>([]);
  const [search, setSearch] = useState("");
  const [showChangedOnly, setShowChangedOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isDirty },
  } = useForm<Record<string, number | string>>({ mode: "onChange" });

  const watchedAll = watch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockPlintResult = await dispatch(getAllPlint(cookies)).unwrap();
        handleResult(stockPlintResult);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    const handleResult = (result: any) => {
      if ("error" in result) {
        alert(result?.error || "Auth error");
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      } else {
        processResult(result);
      }
    };

    const processResult = (result: any) => {
      const list: PlintLean[] = Array.isArray(result?.plint)
        ? result.plint
        : Array.isArray(result)
        ? result
        : [];
      setPlint(list);
      const defaults: Record<string, number | string> = {};
      for (const p of list) defaults[p._id] = "";
      reset(defaults, { keepDirty: false });
    };

    fetchData();
  }, [cookies, dispatch, navigate, reset, setCookie]);

  // утилиты
  const normNum = (x: any) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = plint;
    if (q) {
      arr = arr.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (showChangedOnly) {
      arr = arr.filter((p) => {
        const raw = watchedAll[p._id];
        if (raw === undefined || raw === "" || raw === null) return false;
        const actual = normNum(raw);
        return actual !== normNum(p.stockBalance);
      });
    }
    return arr;
  }, [plint, search, showChangedOnly, watchedAll]);

  const setActual = (id: string, v: number | "") => {
    const val = v === "" ? "" : Math.max(0, Number(v) || 0);
    setValue(id, val as any, { shouldDirty: true, shouldTouch: true });
  };

  const inc = (id: string, currentFact: any) => {
    const v = normNum(currentFact) + 1;
    setActual(id, v);
  };

  const dec = (id: string, currentFact: any) => {
    const v = Math.max(0, normNum(currentFact) - 1);
    setActual(id, v);
  };

  const fillFactAsStock = () => {
    const obj = getValues();
    const next: Record<string, number | string> = { ...obj };
    plint.forEach((p) => (next[p._id] = p.stockBalance ?? 0));
    reset(next, { keepDirty: true });
  };

  const clearFacts = () => {
    const obj = getValues();
    const next: Record<string, number | string> = { ...obj };
    plint.forEach((p) => (next[p._id] = ""));
    reset(next, { keepDirty: false });
  };

  const calcTotals = useMemo(() => {
    let changed = 0;
    let totalDelta = 0;
    filtered.forEach((p) => {
      const raw = watchedAll[p._id];
      if (raw === undefined || raw === "" || raw === null) return;
      const actual = normNum(raw);
      const delta = actual - normNum(p.stockBalance);
      if (delta !== 0) {
        changed++;
        totalDelta += delta;
      }
    });
    return { changed, totalDelta };
  }, [watchedAll, filtered]);

  const onSubmit = async (data: Record<string, number | string>) => {
    const tasks: Array<Promise<any>> = [];
    let changed = 0;

    for (const p of plint) {
      const raw = data[p._id];
      if (raw === undefined || raw === "" || raw === null) continue;
      const actual = normNum(raw);
      const delta = actual - normNum(p.stockBalance);
      if (delta === 0) continue;

      changed++;
      tasks.push(
        dispatch(
          adjustPlintStock({
            id: p._id,
            delta,
            cookies,
          })
        ).unwrap()
      );
    }

    if (!tasks.length) {
      alert("Չկա փոփոխություն։ (Нет изменений)");
      return;
    }

    try {
      setIsSaving(true);
      await Promise.all(tasks);
      alert(`✅ Թարմացվել է ${changed} դիրք`);
      const res = await dispatch(getAllPlint(cookies)).unwrap();
      const list: PlintLean[] = Array.isArray(res?.plint)
        ? res.plint
        : Array.isArray(res)
        ? res
        : [];
      setPlint(list);
    } catch (e: any) {
      alert("❌ Սխալ։ " + (e?.message || e?.data?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const renderTable = (rows: PlintLean[]) => (
    <table className="inv-table">
      <thead>
        <tr>
          <th>Անվանում</th>
          <th className="th-num">Մնացորդ</th>
          <th className="th-num">Իր․ քանակ</th>
          <th className="th-num">Δ</th>
          <th className="th-actions">Գործող.</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => {
          const factRaw = watchedAll[p._id];
          const fact = factRaw === "" || factRaw === undefined ? "" : normNum(factRaw);
          const delta = fact === "" ? 0 : normNum(fact) - normNum(p.stockBalance);
          const deltaClass =
            fact === ""
              ? "delta-zero"
              : delta > 0
              ? "delta-pos"
              : delta < 0
              ? "delta-neg"
              : "delta-zero";

          return (
            <tr key={p._id}>
              <td className="name-cell" title={p.name}>{p.name}</td>
              <td className="num-cell">{p.stockBalance ?? 0}</td>
              <td className="num-cell">
                <div className="fact-input-wrap">
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => dec(p._id, factRaw)}
                    aria-label="Минус 1"
                  >
                    −
                  </button>
                  <input
                    {...register(p._id)}
                    inputMode="numeric"
                    type="number"
                    min={0}
                    step={1}
                    className="fact-input"
                    placeholder="ֆակտ"
                    defaultValue=""
                  />
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => inc(p._id, factRaw)}
                    aria-label="Плюс 1"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className={`num-cell badge ${deltaClass}`}>
                {fact === "" ? "—" : delta}
              </td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setActual(p._id, p.stockBalance ?? 0)}
                  title="Факт = Остаток"
                >
                  = Ост
                </button>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setActual(p._id, 0)}
                  title="Сбросить до 0"
                >
                  0
                </button>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setActual(p._id, "")}
                  title="Очистить поле"
                >
                  Очистить
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="inv-root">
      <PlintMenu />

      <div className="inv-toolbar">
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Որոնում ըստ անվանման…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-right">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={showChangedOnly}
              onChange={(e) => setShowChangedOnly(e.target.checked)}
            />
            <span>Միայն փոփոխվածները</span>
          </label>

          <button
            type="button"
            className="ghost-btn"
            onClick={fillFactAsStock}
            title="Заполнить факт текущим остатком"
          >
            Ֆակտ = Մնացորդ (բոլորը)
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={clearFacts}
            title="Очистить все фактические значения"
          >
            Մաքրել բոլորը
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inv-grid-single">
          {renderTable(filtered)}
        </div>

        <div className="inv-footer">
          <div className="footer-stats">
            <span className="muted">
              Փոփոխված՝ <b>{calcTotals.changed}</b>
            </span>
            <span className="muted sep">•</span>
            <span className="muted">
              Ընդամենը Δ:{" "}
              <b
                className={
                  calcTotals.totalDelta > 0
                    ? "delta-pos"
                    : calcTotals.totalDelta < 0
                    ? "delta-neg"
                    : "delta-zero"
                }
              >
                {calcTotals.totalDelta > 0
                  ? `+${calcTotals.totalDelta}`
                  : calcTotals.totalDelta}
              </b>
            </span>
          </div>

          <div className="footer-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={clearFacts}
              disabled={!isDirty}
            >
              Մաքրել փոփոխությունները
            </button>
            <button
              className="primary-btn"
              disabled={isSaving}
              title="Հաշվարկել դելտան և թարմացնել մնացորդը"
            >
              {isSaving ? "Պահպանում…" : "Հաստատել"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
