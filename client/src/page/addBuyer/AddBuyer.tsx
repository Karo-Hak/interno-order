import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

import { allBuyer, newBuyer } from "../../features/buyer/buyerApi";
import { selectBuyer } from "../../features/buyer/buyerSlice";

import { userProfile } from "../../features/user/userApi";

import { WallpaperMenu } from "../../component/menu/WallpaperMenu";

import "./addBuyer.css";

type FormValues = {
  name: string;
  phone: string;   
  adress: string;  
};

const normPhone = (s: string) => (s ?? "").replace(/\D+/g, "");

export const AddBuyer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token"]);

  const buyerState = useAppSelector(selectBuyer);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: { name: "", phone: "", adress: "" },
    mode: "onSubmit",
  });

  const phoneValue = watch("phone");
  useEffect(() => {
    const cleaned = phoneValue.replace(/[^\d\s()+\-]/g, "");
    if (cleaned !== phoneValue) setValue("phone", cleaned);
  }, [phoneValue, setValue]);

  useEffect(() => {
    (async () => {
      try {
        const res1 = await dispatch(allBuyer(cookies)).unwrap();
        if (res1 && "error" in res1) {
          setCookie("access_token", "", { path: "/" });
          navigate("/");
          return;
        }
        const res2 = await dispatch(userProfile(cookies)).unwrap();
        if (res2 && "error" in res2) {
          console.warn(res2);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [dispatch, cookies, setCookie, navigate]);

  const existingPhones = useMemo(() => {
    const arr = buyerState?.arrBuyer ?? [];
    return new Set(arr.map((b: any) => normPhone(b?.phone ?? "")));
  }, [buyerState?.arrBuyer]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload: FormValues = {
        ...values,
        phone: normPhone(values.phone),
        adress: values.adress?.trim(),
        name: values.name?.trim(),
      };

      if (payload.phone && existingPhones.has(payload.phone)) {
        setServerError("Գնորդ արդեն կա այս հեռախոսահամարով (дубликат по телефону).");
        setSubmitting(false);
        return;
      }

      const res = await dispatch(newBuyer({ buyer: payload as any, cookies })).unwrap();

      if (res && "error" in res) {
        setServerError(String(res.error ?? "Սերվերի սխալ"));
        setSubmitting(false);
        return;
      }

      reset({ name: "", phone: "", adress: "" });
      await dispatch(allBuyer(cookies));
    } catch (e: any) {
      setServerError(String(e?.message ?? "Չստացվեց պահպանել (ошибка сохранения)"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <WallpaperMenu />

      <div style={{ margin: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="divLabel">
              <label htmlFor="buyerName">Անուն</label>
              <input
                id="buyerName"
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: "Պարտադիր է",
                  minLength: { value: 2, message: "Նվազագույնը 2 նիշ" },
                })}
              />
              {errors.name && <span>{errors.name.message || "Պարտադիր լրացման դաշտ"}</span>}
            </div>

            <div className="divLabel">
              <label htmlFor="buyerPhone">Հեռախոս</label>
              <input
                id="buyerPhone"
                type="tel"
                inputMode="tel"
                placeholder="Phone"
                {...register("phone", {
                  required: "Պարտադիր է",
                  validate: (v) => !!normPhone(v) || "Մուտքագրեք հեռախոսահամար",
                  minLength: { value: 6, message: "Չափազանց կարճ համար" },
                })}
              />
              {errors.phone && <span>{errors.phone.message || "Պարտադիր լրացման դաշտ"}</span>}
            </div>

            <div className="divLabel">
              <label htmlFor="buyerAdress">Հասցե</label>
              <input
                id="buyerAdress"
                type="text"
                placeholder="Adress"
                {...register("adress", {
                  required: "Պարտադիր է",
                  minLength: { value: 2, message: "Նվազագույնը 2 նիշ" },
                })}
              />
              {errors.adress && <span>{errors.adress.message || "Պարտադիր լրացման դաշտ"}</span>}
            </div>

            <button type="submit" disabled={submitting} className="btnPrimary">
              {submitting ? "Պահպանվում է…" : "Գրանցել"}
            </button>
          </div>

          {serverError && (
            <div className="formError" role="alert" style={{ marginTop: 8 }}>
              {serverError}
            </div>
          )}
        </form>
      </div>

      {buyerState?.arrBuyer?.length ? (
        <div style={{ margin: "20px" }}>
          <table className="tableName">
            <thead>
              <tr>
                <th scope="col">Անուն</th>
                <th scope="col">Հեռախոս</th>
                <th scope="col">Հասցե</th>
              </tr>
            </thead>
            <tbody>
              {buyerState.arrBuyer.map((e: any) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.adress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
