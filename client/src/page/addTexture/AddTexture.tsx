import React, { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getAllTexture, newTexture } from "../../features/texture/textureApi";
import { Texture, selectTexture } from "../../features/texture/textureSlice";

import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";

import { WallpaperMenu } from "../../component/menu/WallpaperMenu";
import "./addTexture.css";

type FormValues = {
  name: string;
  price: string; 
};

export const AddTexture: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token"]);

  const user = useAppSelector(selectUser);
  const textureState = useAppSelector(selectTexture);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<FormValues>({
    defaultValues: { name: "", price: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    (async () => {
      try {
        const r1 = await dispatch(getAllTexture(cookies)).unwrap();
        if (r1 && "error" in r1) {
          setCookie("access_token", "", { path: "/" });
          navigate("/");
          return;
        }
        const r2 = await dispatch(userProfile(cookies)).unwrap();
        if (r2 && "error" in r2) {
          console.warn(r2);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setFocus("name");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, cookies, navigate, setCookie, setFocus]);

  const existingNames = useMemo(() => {
    const arr = textureState?.arrTexture ?? [];
    return new Set(arr.map((t: Texture) => (t.name ?? "").trim().toLocaleLowerCase()));
  }, [textureState?.arrTexture]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const name = values.name.trim();
      const priceNum = Number.parseFloat(values.price);

      if (!Number.isFinite(priceNum) || priceNum < 0) {
        setServerError("Մուտքագրեք ճիշտ գին (թիվ ≥ 0)");
        setSubmitting(false);
        return;
      }

      if (existingNames.has(name.toLocaleLowerCase())) {
        setServerError("Նյութը արդեն գոյություն ունի այս անվանմամբ");
        setSubmitting(false);
        return;
      }

      const res = await dispatch(
        newTexture({ texture: { name, price: priceNum } as any, cookies })
      ).unwrap();

      if (res && "error" in res) {
        setServerError(String(res.error ?? "Սերվերի սխալ"));
        setSubmitting(false);
        return;
      }

      reset({ name: "", price: "" });
      await dispatch(getAllTexture(cookies));
      setFocus("name");
    } catch (e: any) {
      setServerError(String(e?.message ?? "Չստացվեց պահպանել (ошибка сохранения)"));
    } finally {
      setSubmitting(false);
    }
  };

  const textures = useMemo(() => {
    const arr = (textureState?.arrTexture ?? []) as Texture[];
    return [...arr].sort((a, b) => (a.name || "").localeCompare(b.name || "", "hy-AM"));
  }, [textureState?.arrTexture]);

  return (
    <div>
      <WallpaperMenu />

      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: "flex", gap: "10px", margin: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="divLabel">
              <label htmlFor="addTexture">Անվանում</label>
              <input
                id="addTexture"
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
              <label htmlFor="addPrice">Գին</label>
              <input
                id="addPrice"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Price"
                {...register("price", {
                  required: "Պարտադիր է",
                  validate: (v) => {
                    const n = Number.parseFloat(v);
                    return Number.isFinite(n) && n >= 0 || "Մուտքագրեք թիվ ≥ 0";
                  },
                })}
              />
              {errors.price && <span>{errors.price.message || "Պարտադիր լրացման դաշտ"}</span>}
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Պահպանվում է…" : "Գրանցել"}
            </button>
          </div>

          {serverError && (
            <div className="formError" role="alert" style={{ marginLeft: 20 }}>
              {serverError}
            </div>
          )}
        </form>

        {textures.length > 0 ? (
          <div style={{ width: "500px", margin: "20px" }}>
            <table className="tableName">
              <thead>
                <tr>
                  <th>Անվանում</th>
                  <th style={{ textAlign: "right" }}>Գին</th>
                </tr>
              </thead>
              <tbody>
                {textures.map((e: Texture) => (
                  <tr key={e._id}>
                    <td>{e.name}</td>
                    <td style={{ textAlign: "right" }}>{e.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};
