import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./addProduct.css";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { StockMenu } from "../../../component/menu/StockMenu";

import { selectCategory } from "../../features/category/categorySlice";
import { getAllCategory } from "../../features/category/categoryApi";

import { addProduct, getAllProduct, updateProduct } from "../../features/product/productApi"; // 👈 updateProduct заменишь если иначе
import { selectProduct } from "../../features/product/productSlice";

type FormInput = {
  categoryProduct: string;
  name: string;
  quantity?: string | number;
  price?: string | number;
  coopPrice?: string | number;
};

const toNum = (v: unknown, d = 0) => {
  const s = String(v ?? "").trim();
  if (s === "") return d;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : d;
};

type EditDraft = {
  quantity: string;
  price: string;
  coopPrice: string;
};

export const AddProduct: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token"]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({
    defaultValues: { categoryProduct: "", name: "", quantity: "", price: "", coopPrice: "" },
  });

  const product = useAppSelector(selectProduct);
  const category = useAppSelector(selectCategory);

  // редактирование товаров: productId -> draft
  const [editing, setEditing] = useState<Record<string, EditDraft>>({});

  const safeLoad = useCallback(async () => {
    try {
      if (!cookies?.access_token) {
        navigate("/");
        return;
      }

      const r1 = await dispatch(getAllProduct(cookies));
      const p1: any = r1.payload;
      if (p1 && typeof p1 === "object" && "error" in p1) {
        setCookie("access_token", "", { path: "/" });
        navigate("/");
        return;
      }

      const r2 = await dispatch(getAllCategory(cookies));
      const p2: any = r2.payload;
      if (p2 && typeof p2 === "object" && "error" in p2) {
        setCookie("access_token", "", { path: "/" });
        navigate("/");
        return;
      }
    } catch {
      setCookie("access_token", "", { path: "/" });
      navigate("/");
    }
  }, [dispatch, cookies, navigate, setCookie]);

  useEffect(() => {
    safeLoad();
  }, [safeLoad]);

  const refresh = useCallback(async () => {
    await dispatch(getAllProduct(cookies));
    await dispatch(getAllCategory(cookies));
  }, [dispatch, cookies]);

  // ---------- CREATE ----------
  const saveProduct = useCallback(async (form: FormInput) => {
    try {
      const payloadProduct = {
        categoryProduct: form.categoryProduct,
        name: form.name?.trim(),
        quantity: toNum(form.quantity, 0),
        price: toNum(form.price, 0),
        coopPrice: toNum(form.coopPrice, 0),
      };

      const res = await dispatch(addProduct({ product: payloadProduct, cookies })).unwrap();
      if ((res as any)?.error) {
        alert((res as any).error);
        return;
      }

      await refresh();
      reset({ categoryProduct: "", name: "", quantity: "", price: "", coopPrice: "" });
    } catch (e: any) {
      alert(e?.error || e?.message || "Չստացվեց ավելացնել ապրանքը");
    }
  }, [dispatch, cookies, refresh, reset]);

  // ---------- EDIT ----------
  const startEdit = useCallback((p: any) => {
    setEditing(prev => ({
      ...prev,
      [p._id]: {
        quantity: String(p.quantity ?? ""),
        price: String(p.price ?? ""),
        coopPrice: String(p.coopPrice ?? ""),
      }
    }));
  }, []);

  const cancelEdit = useCallback((id: string) => {
    setEditing(prev => {
      const cp = { ...prev };
      delete cp[id];
      return cp;
    });
  }, []);

  const setDraft = useCallback((id: string, key: keyof EditDraft, value: string) => {
    setEditing(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? { quantity: "", price: "", coopPrice: "" }), [key]: value }
    }));
  }, []);

  const saveEdit = useCallback(async (p: any) => {
    try {
      const d = editing[p._id];
      if (!d) return;

      const payload = {
        id: p._id, // или _id — зависит от твоего backend
        quantity: toNum(d.quantity, toNum(p.quantity, 0)),
        price: toNum(d.price, toNum(p.price, 0)),
        coopPrice: toNum(d.coopPrice, toNum(p.coopPrice, 0)),
      };

      // 👇 если у тебя сигнатура другая — поменяй
      const res = await dispatch(updateProduct({ cookies, payload })).unwrap();

      if ((res as any)?.error) {
        alert((res as any).error);
        return;
      }

      await refresh();
      cancelEdit(p._id);
    } catch (e: any) {
      alert(e?.error || e?.message || "Չստացվեց պահպանել փոփոխությունները");
    }
  }, [dispatch, cookies, editing, refresh, cancelEdit]);

  return (
    <div style={{ width: "100%" }}>
      <StockMenu />

      {/* CREATE FORM */}
      <form
        onSubmit={handleSubmit(saveProduct)}
        style={{ display: "flex", justifyContent: "center", padding: "20px", gap: "20px", flexWrap: "wrap" }}
      >
        <div className="divLabel">
          <label htmlFor="category">Խումբ</label>
          <select
            style={{ border: "1px solid black" }}
            id="category"
            {...register("categoryProduct", { required: "Պարտադիր է" })}
          >
            <option value=""></option>
            {category?.arrCategory?.length
              ? category.arrCategory.map((e: any) => (
                  <option key={e._id} value={e._id}>{e.name}</option>
                ))
              : null}
          </select>
          {errors.categoryProduct && <div style={{ color: "red", fontSize: 12 }}>{String(errors.categoryProduct.message)}</div>}
        </div>

        <div className="divLabel">
          <label htmlFor="addProduct">Ապրանք</label>
          <input id="addProduct" type="text" placeholder="Name" {...register("name", { required: "Պարտադիր է" })} />
          {errors.name && <div style={{ color: "red", fontSize: 12 }}>{String(errors.name.message)}</div>}
        </div>

        <div className="divLabel">
          <label htmlFor="quantity">Քանակ</label>
          <input id="quantity" type="text" inputMode="decimal" placeholder="quantity" {...register("quantity")} />
        </div>

        <div className="divLabel">
          <label htmlFor="price">Price</label>
          <input id="price" type="text" inputMode="decimal" placeholder="price" {...register("price")} />
        </div>

        <div className="divLabel">
          <label htmlFor="coopPrice">CoopPrice</label>
          <input id="coopPrice" type="text" inputMode="decimal" placeholder="coopPrice" {...register("coopPrice")} />
        </div>

        <button disabled={isSubmitting}>{isSubmitting ? "Գրանցում..." : "Գրանցել"}</button>
      </form>

      {/* LIST + EDIT */}
      {category?.arrCategory?.length ? (
        <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
          {category.arrCategory.map((c: any) => (
            <div
              key={c._id}
              style={{
                width: "520px",
                margin: "10px",
                border: "2px solid black",
                padding: "5px",
                textAlign: "center",
              }}
            >
              <h6>{c.name}</h6>

              <div>
                <table className="buyerSectionName">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>CoopPrice</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {(c.product ?? []).map((p: any) => {
                      const d = editing[p._id];
                      const isEdit = !!d;

                      return (
                        <tr key={p._id}>
                          <td>{p.name}</td>

                          <td>
                            {isEdit ? (
                              <input
                                style={{ width: 90 }}
                                type="text"
                                inputMode="decimal"
                                value={d.quantity}
                                onChange={(e) => setDraft(p._id, "quantity", e.target.value)}
                              />
                            ) : (
                              p.quantity
                            )}
                          </td>

                          <td>
                            {isEdit ? (
                              <input
                                style={{ width: 90 }}
                                type="text"
                                inputMode="decimal"
                                value={d.price}
                                onChange={(e) => setDraft(p._id, "price", e.target.value)}
                              />
                            ) : (
                              p.price
                            )}
                          </td>

                          <td>
                            {isEdit ? (
                              <input
                                style={{ width: 90 }}
                                type="text"
                                inputMode="decimal"
                                value={d.coopPrice}
                                onChange={(e) => setDraft(p._id, "coopPrice", e.target.value)}
                              />
                            ) : (
                              p.coopPrice
                            )}
                          </td>

                          <td style={{ whiteSpace: "nowrap" }}>
                            {!isEdit ? (
                              <button type="button" onClick={() => startEdit(p)}>Edit</button>
                            ) : (
                              <>
                                <button type="button" onClick={() => saveEdit(p)}>Save</button>
                                <button type="button" onClick={() => cancelEdit(p._id)}>Cancel</button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
