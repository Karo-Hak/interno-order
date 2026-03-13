import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./login.css";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCookies } from "react-cookie";

import { loginUser } from "../../features/user/userApi";

import { getAllUserSphere } from "../../features/userSphere/userSphereApi";
import { selectUserSphere } from "../../features/userSphere/userSphereSlice";

type LoginCredentials = {
  username: string;
  password: string;
  sphere?: string;
};

export const Login: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [cookies, setCookie] = useCookies(["access_token"]);
  const userSphereState = useAppSelector(selectUserSphere);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm<LoginCredentials>({ defaultValues: { username: "", password: "", sphere: "" } });

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [sphere, setSphere] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(getAllUserSphere()).unwrap();
        if (res && Array.isArray(res) && res.length > 0) {
          const initial = res[0]?.name ?? "";
          setSphere(initial);
          setValue("sphere", initial);
        }
      } catch {
        /* ignore */
      } finally {
        setFocus("username");
      }
    })();
  }, [dispatch, setFocus, setValue]);

  const spheres = useMemo(
    () => userSphereState?.arrUserSphere ?? userSphereState ?? [],
    [userSphereState]
  );

  function selectedSphere(event: ChangeEvent<HTMLSelectElement>) {
    const v = event.target.value;
    setSphere(v);
    setValue("sphere", v);
  }

  const onSubmit = async (data: LoginCredentials) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload: LoginCredentials = {
        username: data.username.trim(),
        password: data.password,
      };

      const res = await dispatch(loginUser(payload as any)).unwrap();
      const token = (res as any)?.access_token;
      if (!token) {
        setServerError("Սխալ մուտք (нет токена)");
        setSubmitting(false);
        return;
      }

      setCookie("access_token", token, { path: "/" });
      if (data.sphere) localStorage.setItem("user_sphere", data.sphere);
      navigate("/home");
    } catch (e: any) {
      const msg =
        e?.message ||
        e?.data?.message ||
        (typeof e === "string" ? e : "") ||
        "Սխալ մուտք (не удалось авторизоваться)";
      setServerError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="login">
        <form onSubmit={handleSubmit(onSubmit)} className="login_form" noValidate>
          <div className="loginLine">
            <label htmlFor="login-username">User Name</label>
            <input
              id="login-username"
              autoComplete="username"
              placeholder="User Name"
              {...register("username", { required: "Required" })}
            />
            {errors.username && <p className="err">{errors.username.message || "User Name is required"}</p>}
          </div>

          <div className="loginLine">
            <label htmlFor="login-password">Password</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                {...register("password", { required: "Required" })}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="btn btnToggle"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="err">{errors.password.message || "Password is required"}</p>}
          </div>

          {Array.isArray(spheres) && spheres.length > 0 ? (
            <div className="loginLine">
              <label htmlFor="login-sphere">Sphere</label>
              <select id="login-sphere" value={sphere} onChange={selectedSphere}>
                {spheres.map((s: any) => (
                  <option key={s._id ?? s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {serverError ? <div className="err" style={{ marginTop: 8 }}>{serverError}</div> : null}

          <button className="btn" disabled={submitting} style={{ marginTop: 10 }}>
            {submitting ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
