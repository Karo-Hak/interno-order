import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { StockMenu } from "../../../component/menu/StockMenu";
import { selectCategory } from "../../features/category/categorySlice";
import { getAllCategory } from "../../features/category/categoryApi";

import {
  getAllProduct,
  updateProductsLists,
} from "../../features/product/productApi";
import { Product, selectProduct } from "../../features/product/productSlice";

import "./inputOutput.css";

const round2 = (n: number) => Math.round(n * 100) / 100;
const idKey = (id: string | number) => String(id);
const norm = (s?: string) => (s ?? "").toLocaleLowerCase().trim();

type DraftById = Record<string, { in?: number; out?: number }>;
type SortKey = "name" | "qty" | "newQty" | "delta";
type SortDir = "asc" | "desc";

export const InputOutput: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token"]);

  const product = useAppSelector(selectProduct);
  const category = useAppSelector(selectCategory);

  const [draft, setDraft] = useState<DraftById>({});
  const [query, setQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // загрузка при монтировании
  useEffect(() => {
    (async () => {
      try {
        await dispatch(getAllProduct({ cookies })).unwrap();
        await dispatch(getAllCategory(cookies)).unwrap();
      } catch (err) {
        // если токен невалиден — выходим
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      }
    })();
  }, [dispatch, cookies, navigate, setCookie]);

  // изменение вход/выход
  const onInChange = useCallback((raw: string, id: string | number) => {
    const val = Number(raw);
    setDraft((d) => ({
      ...d,
      [idKey(id)]: { ...d[idKey(id)], in: Number.isFinite(val) ? val : undefined },
    }));
  }, []);

  const onOutChange = useCallback((raw: string, id: string | number) => {
    const val = Number(raw);
    setDraft((d) => ({
      ...d,
      [idKey(id)]: { ...d[idKey(id)], out: Number.isFinite(val) ? val : undefined },
    }));
  }, []);

  const clearRowDraft = useCallback((id: string | number) => {
    setDraft((d) => {
      const k = idKey(id);
      const { [k]: _, ...rest } = d;
      return rest;
    });
  }, []);

  // предпросмотр новых остатков
  const previewQtyById = useMemo(() => {
    const map: Record<string, number> = {};
    const all = (product?.arrProduct ?? []) as Product[];
    for (const p of all) {
      const k = idKey(p._id);
      const ch = draft[k];
      const cur = Number(p.quantity ?? 0);
      const next = ch ? round2(cur + (ch.in ?? 0) - (ch.out ?? 0)) : cur;
      map[k] = Math.max(0, next);
    }
    return map;
  }, [draft, product?.arrProduct]);

  // изменённые продукты для отправки
  const updatedProductLists: Product[] = useMemo(() => {
    const all = (product?.arrProduct ?? []) as Product[];
    return all.reduce<Product[]>((acc, p) => {
      const ch = draft[idKey(p._id)];
      if (!ch || (ch.in == null && ch.out == null)) return acc;
      const nextQty = Math.max(
        0,
        round2((Number(p.quantity ?? 0)) + (ch.in ?? 0) - (ch.out ?? 0))
      );
      acc.push({ ...p, quantity: nextQty });
      return acc;
    }, []);
  }, [draft, product?.arrProduct]);

  const hasChanges = updatedProductLists.length > 0;
  const resetAll = useCallback(() => setDraft({}), []);

  // ✅ Сохранение
  const updateProduct = async () => {
    if (!hasChanges) return alert("Нет изменений для сохранения.");
    try {
      await dispatch(updateProductsLists({ updatedProductLists, cookies })).unwrap();
      alert("Изменения сохранены!");

      // 🔄 обновляем данные без перезагрузки
      await Promise.all([
        dispatch(getAllProduct({ cookies })).unwrap(),
        dispatch(getAllCategory(cookies)).unwrap(),
      ]);
      setDraft({});
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления");
    }
  };

  // сортировка
  const toggleSort = (key: SortKey) => {
    setSortKey((prevKey) => (prevKey === key ? prevKey : key));
    setSortDir((prevDir) =>
      sortKey === key ? (prevDir === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const q = norm(query);

  return (
    <div className="io-page">
      <StockMenu />

      {/* Верхняя панель */}
      <div className="io-topbar">
        <div className="io-topbar-left">
          <button
            onClick={updateProduct}
            disabled={!hasChanges}
            className="io-btn io-btn-save"
          >
            Save
          </button>
          <button
            onClick={resetAll}
            disabled={!hasChanges}
            className="io-btn io-btn-cancel"
          >
            Cancel
          </button>
        </div>
        <div className="io-topbar-right">
          <input
            type="text"
            placeholder="Поиск по названию…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="io-search"
          />
          <div className="io-sortlabel">
            Сортировка:{" "}
            <b>
              {sortKey === "name"
                ? "Имя"
                : sortKey === "qty"
                ? "Текущий остаток"
                : sortKey === "newQty"
                ? "Новый остаток"
                : "Δ"}
              {sortDir === "asc" ? " (по возр.)" : " (по убыв.)"}
            </b>
          </div>
        </div>
      </div>

      {/* Таблицы */}
      {category?.arrCategory?.length ? (
        <div className="io-grid">
          {category.arrCategory.map((cat: any) => {
            const baseRows: Product[] = Array.isArray(cat.product)
              ? (cat.product as Product[])
              : [];

            const rows = baseRows.map((p) => {
              const k = idKey(p._id);
              const cur = Number(p.quantity ?? 0);
              const next = previewQtyById[k] ?? cur;
              const delta = round2(next - cur);
              return { p, k, cur, next, delta };
            });

            const filtered = q
              ? rows.filter((r) => norm(r.p.name).includes(q))
              : rows;

            const sorted = [...filtered].sort((a, b) => {
              let va: string | number, vb: string | number;
              if (sortKey === "name") {
                va = norm();
                vb = norm();
              } else if (sortKey === "qty") {
                va = a.cur;
                vb = b.cur;
              } else if (sortKey === "newQty") {
                va = a.next;
                vb = b.next;
              } else {
                va = a.delta;
                vb = b.delta;
              }
              if (va < vb) return sortDir === "asc" ? -1 : 1;
              if (va > vb) return sortDir === "asc" ? 1 : -1;
              return 0;
            });

            const totalCur = round2(sorted.reduce((s, r) => s + r.cur, 0));
            const totalNext = round2(sorted.reduce((s, r) => s + r.next, 0));
            const totalDelta = round2(totalNext - totalCur);

            return (
              <div key={cat._id} className="io-card">
                <h6 className="io-title">{cat.name}</h6>
                <div className="io-scroll">
                  <table className="io-table buyerSectionName">
                    <thead>
                      <tr>
                        <th className="nameProduct" onClick={() => toggleSort("name")}>
                          Անուն{sortIndicator("name")}
                        </th>
                        <th onClick={() => toggleSort("qty")}>
                          Քանակ{sortIndicator("qty")}
                        </th>
                        <th>Մուտք</th>
                        <th>Ելք</th>
                        <th onClick={() => toggleSort("newQty")}>
                          Новый остаток{sortIndicator("newQty")}
                        </th>
                        <th onClick={() => toggleSort("delta")}>
                          Δ{sortIndicator("delta")}
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map(({ p, k, cur, next, delta }) => {
                        const changed = Math.abs(delta) > 0;
                        return (
                          <tr key={p._id} className={changed ? "io-row-changed" : undefined}>
                            <td>{p.name}</td>
                            <td>{cur}</td>
                            <td>
                              <input
                                type="text"
                                className={`io-input ${draft[k]?.in != null ? "io-input-changed" : ""}`}
                                value={draft[k]?.in ?? ""}
                                onChange={(e) => onInChange(e.target.value, p._id)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className={`io-input ${draft[k]?.out != null ? "io-input-changed" : ""}`}
                                value={draft[k]?.out ?? ""}
                                onChange={(e) => onOutChange(e.target.value, p._id)}
                              />
                            </td>
                            <td style={{ fontWeight: changed ? 600 : 400 }}>
                              {next}
                            </td>
                            <td
                              className={
                                delta > 0
                                  ? "io-delta-up"
                                  : delta < 0
                                  ? "io-delta-down"
                                  : ""
                              }
                            >
                              {delta > 0
                                ? `↑ ${delta}`
                                : delta < 0
                                ? `↓ ${Math.abs(delta)}`
                                : "—"}
                            </td>
                            <td>
                              {changed ? (
                                <button
                                  onClick={() => clearRowDraft(p._id)}
                                  className="io-btn io-btn-clear"
                                >
                                  ✕
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="io-total-row">
                        <td>ИТОГО</td>
                        <td>{totalCur}</td>
                        <td />
                        <td />
                        <td>{totalNext}</td>
                        <td>{totalDelta}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
