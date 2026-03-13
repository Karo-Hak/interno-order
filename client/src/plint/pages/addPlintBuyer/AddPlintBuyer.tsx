import React, { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../../app/hooks";

import { PlintMenu } from "../../../component/menu/PlintMenu";
import {
  createPlintBuyer,
  getPlintBuyers,
} from "../../features/plintBuyer/plintBuyerApi";

import "./createPlintBuyer.css";

type FormValues = {
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
};

type BuyerItem = {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
};

const normPhone = (s?: string) => (s ? s.replace(/[^\d]/g, "") : "");

export const PlintBuyer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState<BuyerItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [limit] = useState<number>(100);
  const [skip, setSkip] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    setFocus,
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      phone1: "",
      phone2: "",
      region: "",
      address: "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const fetchBuyers = async (q?: string, s?: number) => {
    const res: any = await dispatch(
      getPlintBuyers({
        cookies,
        q,
        limit,
        skip: s ?? skip,
      })
    ).unwrap();

    if (res?.error) {
      alert(res.error?.message || "Fetch buyers failed");
      return;
    }

    const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
    setBuyers(items);
    setTotal(typeof res?.total === "number" ? res.total : items.length);
  };

  useEffect(() => {
    fetchBuyers(search, 0);
    setSkip(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onSubmit = async (form: FormValues) => {
    try {
      const formPhone = form.phone1?.trim();
      let exists = false;

      if (formPhone) {
        const queryRes: any = await dispatch(
          getPlintBuyers({ cookies, q: formPhone, limit: 10, skip: 0 })
        ).unwrap();

        const foundArr: BuyerItem[] = Array.isArray(queryRes?.items)
          ? queryRes.items
          : Array.isArray(queryRes)
          ? queryRes
          : [];

        const formDigits = normPhone(formPhone);
        exists = foundArr.some(
          (b) => normPhone(b.phone1) === formDigits || normPhone(b.phone2) === formDigits
        );
      }

      if (exists) {
        alert("⚠️ Գնորդ այս հեռախոսահամարով արդեն գոյություն ունի։\n(Покупатель с таким телефоном уже существует)");
        return;
      }

      const res: any = await dispatch(
        createPlintBuyer({
          buyer: {
            name: form.name.trim(),
            phone1: form.phone1?.trim() || undefined,
            phone2: form.phone2?.trim() || undefined,
            region: form.region?.trim() || undefined,
            address: form.address?.trim() || undefined,
          },
          cookies,
        })
      ).unwrap();

      if (res?.error) {
        alert("❌ Սխալ: " + (res.error?.message || res.error));
        return;
      }

      alert("✅ Գնորդը ստեղծված է");
      await fetchBuyers(search, 0);
      reset();
      setFocus("name");
    } catch (e: any) {
      alert("❌ Սխալ: " + (e?.message || "Unknown error"));
    }
  };

  const pageInfo = useMemo(() => {
    const from = total === 0 ? 0 : skip + 1;
    const to = Math.min(skip + limit, total);
    return `${from}-${to} / ${total}`;
  }, [skip, limit, total]);

  const nextPage = () => {
    if (skip + limit >= total) return;
    const s = skip + limit;
    setSkip(s);
    fetchBuyers(search, s);
  };

  const prevPage = () => {
    if (skip === 0) return;
    const s = Math.max(0, skip - limit);
    setSkip(s);
    fetchBuyers(search, s);
  };

  return (
    <div className="buyer-root">
      <PlintMenu />
      <div className="buyer-container">
        <div className="buyer-header">
          <h2>Նոր գնորդ</h2>
          <div className="buyer-actions">
            <button className="ghost-btn" type="button" onClick={() => navigate(-1)}>
              Վերադառնալ
            </button>
          </div>
        </div>

        <form className="buyer-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            {/* Անուն */}
            <div className="form-field">
              <label htmlFor="name">
                Անուն <span className="req">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Օր․՝ Karen Hakobyan"
                {...register("name", {
                  required: "Պարտադիր դաշտ",
                  minLength: { value: 2, message: "Առնվազն 2 նիշ" },
                  maxLength: { value: 200, message: "Առավելագույնը 200 նիշ" },
                })}
              />
              {errors.name && <div className="error">{errors.name.message}</div>}
            </div>

            {/* Հեռ1 */}
            <div className="form-field">
              <label htmlFor="phone1">Հեռ․ 1</label>
              <input
                id="phone1"
                type="tel"
                placeholder="+374 XX XX XX XX"
                {...register("phone1", {
                  pattern: {
                    value: /^[0-9+()\-\s]{6,20}$/,
                    message: "Սխալ հեռախոսահամար",
                  },
                })}
              />
              {errors.phone1 && <div className="error">{errors.phone1.message}</div>}
            </div>

            {/* Հեռ2 */}
            <div className="form-field">
              <label htmlFor="phone2">Հեռ․ 2</label>
              <input
                id="phone2"
                type="tel"
                placeholder="+374 XX XX XX XX"
                {...register("phone2", {
                  pattern: {
                    value: /^[0-9+()\-\s]{6,20}$/,
                    message: "Սխալ հեռախոսահամար",
                  },
                })}
              />
              {errors.phone2 && <div className="error">{errors.phone2.message}</div>}
            </div>

            {/* Մարզ */}
            <div className="form-field">
              <label htmlFor="region">Մարզ</label>
              <input
                id="region"
                type="text"
                placeholder="Օր․՝ Երևան"
                {...register("region", {
                  maxLength: { value: 120, message: "Առավելագույնը 120 նիշ" },
                })}
              />
              {errors.region && <div className="error">{errors.region.message}</div>}
            </div>

            {/*Հասցե */}
            <div className="form-field form-field-col2">
              <label htmlFor="address">Հասցե</label>
              <input
                id="address"
                type="text"
                placeholder="Փողոց, շենք, մուտք, բնակարան..."
                {...register("address", {
                  maxLength: { value: 300, message: "Առավելագույնը 300 նիշ" },
                })}
              />
              {errors.address && <div className="error">{errors.address.message}</div>}
            </div>
          </div>

          <div className="form-footer">
            <div className="muted">
              {nameValue?.trim()
                ? `Վերնագիր: ${nameValue.trim()}`
                : "Գրեք գնորդի անունը"}
            </div>
            <div className="footer-actions">
              <button
                className="ghost-btn"
                type="button"
                onClick={() => reset()}
                disabled={!isDirty || isSubmitting}
              >
                Մաքրել
              </button>
              <button className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? "Պահպանում…" : "Գրանցել"}
              </button>
            </div>
          </div>
        </form>

        <div className="buyer-list-card">
          <div className="buyer-list-toolbar">
            <div className="search-wrap">
              <input
                className="search-input"
                placeholder="Որոնում ըստ անվանման կամ հեռախոսահամարի…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="pager">
              <button className="ghost-btn" onClick={prevPage} disabled={skip === 0}>
                ◀
              </button>
              <span className="muted">{pageInfo}</span>
              <button
                className="ghost-btn"
                onClick={nextPage}
                disabled={skip + limit >= total}
              >
                ▶
              </button>
            </div>
          </div>

          <div className="buyer-table-wrap">
            <table className="buyer-table">
              <thead>
                <tr>
                  <th>Անուն</th>
                  <th>Հեռ․ 1</th>
                  <th>Հեռ․ 2</th>
                  <th>Մարզ</th>
                  <th>Հասցե</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((b) => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td>{b.phone1 || "-"}</td>
                    <td>{b.phone2 || "-"}</td>
                    <td>{b.region || "-"}</td>
                    <td>{b.address || "-"}</td>
                  </tr>
                ))}
                {buyers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                      Դատարկ է
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlintBuyer;
