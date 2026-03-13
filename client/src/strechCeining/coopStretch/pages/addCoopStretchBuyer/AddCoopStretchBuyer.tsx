import { useAppDispatch } from "../../../../app/hooks";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import "./addCoopStretchBuyer.css";
import { CoopStretchMenu } from "../../../../component/menu/CoopStretchMenu";
import {
  allCoopStretchBuyerThunk,
  newCoopStretchBuyer,
} from "../../features/coopStrechBuyer/coopStrechBuyerApi";
import { CoopStretchBuyerProps } from "../../features/coopStrechBuyer/coopStrechBuyerSlice";

type FormValues = {
  name: string;
  phone1: string;
  phone2?: string;
  region: string;
  address: string;
};

const normalize = (s?: string) => (s ?? "").toLowerCase();

export const CoopStretchBuyer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [rows, setRows] = useState<CoopStretchBuyerProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const buyerResult = await dispatch(allCoopStretchBuyerThunk(cookies)).unwrap();
        if (buyerResult && !("error" in buyerResult)) {
          setRows(buyerResult as CoopStretchBuyerProps[]);
        } else {
          throw new Error((buyerResult as any)?.error || "Unauthorized");
        }
      } catch (error) {
        console.error(error);
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (values: FormValues) => {
    try {
      const res = await dispatch(
        newCoopStretchBuyer({ coopStretchBuyer: values, cookies })
      ).unwrap();

      if (res && !("error" in res)) {
        const created = (res.buyer || res) as CoopStretchBuyerProps;
        setRows((prev) => [created, ...prev]);
        reset();
      } else {
        alert((res as any).error || "Սխալ");
      }
    } catch (e: any) {
      alert(e?.message || "Սխալ");
    }
  };

  const filtered = useMemo(() => {
    const needle = normalize(q.trim());
    if (!needle) return rows;
    return rows.filter((r) => normalize(r.name).includes(needle));
  }, [rows, q]);

  return (
    <>
      <CoopStretchMenu />

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "#fff",
          borderBottom: "1px solid #eee",
          paddingBottom: 8,
        }}
      >
        <div className="addStretchBuyer_head_name">Գնորդի տվյալներ (Coop)</div>

        <form onSubmit={handleSubmit(onCreate)}>
          <div className="addStrerchBuyer_info" style={{ gap: 8 }}>
            <div className="addStrerchBuyer_info_section">
              <label htmlFor="name">Անուն</label>
              <input id="name" type="text" placeholder="Name" {...register("name", { required: true })} />
            </div>

            <div className="addStrerchBuyer_info_section">
              <label htmlFor="phone1">Հեռախոս</label>
              <input id="phone1" type="text" placeholder="Phone" {...register("phone1", { required: true })} />
            </div>

            <div className="addStrerchBuyer_info_section">
              <label htmlFor="phone2">Հեռախոս</label>
              <input id="phone2" type="text" placeholder="Phone" {...register("phone2")} />
            </div>

            <div className="addStrerchBuyer_info_section">
              <label htmlFor="region">Մարզ</label>
              <input id="region" type="text" placeholder="Region" {...register("region", { required: true })} />
            </div>

            <div className="addStrerchBuyer_info_section">
              <label htmlFor="address">Հասցե</label>
              <input id="address" type="text" placeholder="Address" {...register("address", { required: true })} />
            </div>

            <div className="addStrerchBuyer_info_section">
              <button type="submit" disabled={loading}>Գրանցել</button>
            </div>
          </div>
        </form>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <input
            type="search"
            placeholder="Որոնում ըստ անվան…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", minWidth: 220 }}
          />
          {q && (
            <button className="btn" type="button" onClick={() => setQ("")}>
              Մաքրել
            </button>
          )}
          <span style={{ marginLeft: "auto", opacity: 0.7 }}>
            Ցուցադրված՝ {filtered.length} / {rows.length}
          </span>
        </div>
      </div>

      <div
        className="addStretchBuyer_table"
        style={{ maxHeight: "70vh", overflow: "auto", border: "1px solid #eee", borderRadius: 8, marginTop: 10 }}
      >
        <div className="addStretchBuyer_head_name" style={{ padding: 8 }}>
          Գնորդների ցուցակ
        </div>

        {loading ? (
          <div style={{ padding: 12 }}>Բեռնվում է…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 12, opacity: 0.8 }}>Գրառումներ չկան…</div>
        ) : (
          <table className="table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                {["Անուն", "Հեռախոս", "Հեռախոս", "Մարզ", "Հասցե"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      background: "#fff",
                      boxShadow: "inset 0 -1px #eee",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.phone1}</td>
                  <td>{e.phone2}</td>
                  <td>{e.region || "—"}</td>
                  <td>{e.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
