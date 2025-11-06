import React, { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";

import {
  getAllCooperate,
  getCoopSpher,
  newCooperate,
} from "../../features/cooperate/cooperateApi";
import { selectCooperate } from "../../features/cooperate/cooperateSlice";

import { WallpaperMenu } from "../../component/menu/WallpaperMenu";
import "../addBuyer/addBuyer.css"; 

type FormValues = {
  name: string;
  surname?: string;
  phone?: string;           // нормализуем до цифр перед отправкой
  cooperateRate: string;    // вводится как текст, отправим как number
  cooperationSphere: string; // ObjectId
};

const normPhone = (s?: string) => (s ?? "").replace(/\D+/g, "");

export const AddCooperate: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token"]);

  const user = useAppSelector(selectUser);
  const cooperateState = useAppSelector(selectCooperate);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      cooperateRate: "",
      cooperationSphere: "",
    },
    mode: "onSubmit",
  });

  // авто-очистка лишних символов в телефоне (оставляем цифры, пробелы/скобки/+- можно)
  const phoneVal = watch("phone");
  useEffect(() => {
    const cleaned = (phoneVal ?? "").replace(/[^\d\s()+\-]/g, "");
    if (cleaned !== (phoneVal ?? "")) setValue("phone", cleaned);
  }, [phoneVal, setValue]);

  // первичная загрузка
  useEffect(() => {
    (async () => {
      try {
        const res1 = await dispatch(getAllCooperate(cookies)).unwrap();
        if (res1 && "error" in res1) {
          setCookie("access_token", "", { path: "/" });
          navigate("/");
          return;
        }
        const res2 = await dispatch(getCoopSpher(cookies)).unwrap();
        if (res2 && "error" in res2) {
          setCookie("access_token", "", { path: "/" });
          navigate("/");
          return;
        }
        const res3 = await dispatch(userProfile(cookies)).unwrap();
        if (res3 && "error" in res3) {
          console.warn(res3);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, cookies, navigate, setCookie]);

  // быстрый набор сфер
  const spheres = useMemo(
    () => cooperateState?.cooperationSphere ?? [],
    [cooperateState?.cooperationSphere]
  );

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: values.name?.trim(),
        surname: values.surname?.trim() || undefined,
        phone: normPhone(values.phone),
        // percent → number
        cooperateRate: Number.parseFloat(values.cooperateRate),
        cooperationSphere: values.cooperationSphere, // ObjectId
      };

      if (!Number.isFinite(payload.cooperateRate)) {
        setServerError("Խնդրում ենք մուտքագրել ճիշտ տոկոս (число).");
        setSubmitting(false);
        return;
      }

      const res = await dispatch(
        newCooperate({ cooperate: payload as any, cookies })
      ).unwrap();

      if (res && "error" in res) {
        setServerError(String(res.error ?? "Սերվերի սխալ"));
        setSubmitting(false);
        return;
      }

      // успешное сохранение: очищаем форму и обновляем список
      reset({
        name: "",
        surname: "",
        phone: "",
        cooperateRate: "",
        cooperationSphere: "",
      });
      await dispatch(getAllCooperate(cookies));
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
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="divLabel">
              <label htmlFor="cooperateName">Անուն</label>
              <input
                id="cooperateName"
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
              <label htmlFor="cooperateSurname">Ազգանուն</label>
              <input
                id="cooperateSurname"
                type="text"
                placeholder="Surname"
                {...register("surname")}
              />
            </div>

            <div className="divLabel">
              <label htmlFor="cooperatePhone">Հեռախոս</label>
              <input
                id="cooperatePhone"
                type="tel"
                inputMode="tel"
                placeholder="Phone"
                {...register("phone", {
                  validate: (v) => !v || !!normPhone(v) || "Մուտքագրեք հեռախոսահամար",
                  minLength: { value: 6, message: "Չափազանց կարճ համար" },
                })}
              />
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>

            <div className="divLabel">
              <label htmlFor="cooperateRate">Գործընկերոջ տոկոս</label>
              <input
                id="cooperateRate"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Cooperate Rate"
                {...register("cooperateRate", {
                  required: "Պարտադիր է",
                  validate: (v) => {
                    const n = Number.parseFloat(v);
                    return Number.isFinite(n) || "Մուտքագրեք թիվ";
                  },
                })}
              />
              {errors.cooperateRate && <span>{errors.cooperateRate.message}</span>}
            </div>

            {spheres.length > 0 ? (
              <div className="divLabel">
                <label htmlFor="cooperateSpher">Գործընկերոջ ոլորտ</label>
                <select
                  id="cooperateSpher"
                  {...register("cooperationSphere", { required: "Պարտադիր է" })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {spheres.map((e: any) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                {errors.cooperationSphere && <span>{errors.cooperationSphere.message}</span>}
              </div>
            ) : null}

            <button type="submit" disabled={submitting}>
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

      {cooperateState?.arrCooperate?.length ? (
        <div style={{ margin: "20px" }}>
          <table className="tableName">
            <thead>
              <tr>
                <th scope="col">Անուն</th>
                <th scope="col">Ազգանուն</th>
                <th scope="col">Հեռախոս</th>
                <th scope="col">Տոկոս</th>
                <th scope="col">Ոլորտ</th>
              </tr>
            </thead>
            <tbody>
              {cooperateState.arrCooperate.map((e: any) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.surname}</td>
                  <td>{e.phone}</td>
                  <td>{e.cooperateRate}</td>
                  <td>{e.cooperationSphere?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
