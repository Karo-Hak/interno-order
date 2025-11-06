// src/strechCeining/stock/buyProduct/BuyProduct.tsx
import React from 'react';
import {
  useForm,
  SubmitHandler,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import './buyProduct.css';

import SimpleGroup, { SimpleRow } from './components/SimpleGroup';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import { CoopStretchMenu } from '../../../component/menu/CoopStretchMenu';

// ⚠️ наш API: по категории
import { buyProducts, getProductsByCategory } from '../../features/product/productApi';



/* ---------------- types ---------------- */

type CatalogItem = { _id: string; name: string };

export type FormValues = {
  groupedStretchProfilData: SimpleRow[];
  groupedLightPlatformData: SimpleRow[];
  groupedLightRingData: SimpleRow[];
  date: string; // ISO yyyy-mm-ddTHH:mm
};

// То, что уходит на бэк
type BuyItem = { productId: string; qty: number };

/* ---------------- helpers ---------------- */

const normCatalog = (arr: any[]): CatalogItem[] =>
  (arr ?? []).map((x: any) => ({
    _id: String(x._id ?? x.id ?? crypto.randomUUID()),
    name:
      x.name ??
      x.textureName ??
      x.profilName ??
      x.lightPlatformName ??
      x.lightRingName ??
      x.title ??
      x.label ??
      '',
  }));

// ✅ Совместимая с ES5/ES2015 реализация без [...iter]
const dedupById = <T extends { _id: string }>(arr: T[]): T[] => {
  const map = new Map<string, T>();
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    map.set(it._id, it);
  }
  return Array.from(map.values());
};

// Берём только валидные строки из SimpleGroup
const toBuyItems = (rows: SimpleRow[] = []): BuyItem[] => {
  const out: BuyItem[] = [];
  for (const r of rows) {
    // ВАЖНО: SimpleGroup должен класть выбранный id в r.itemId
    const id = String((r as any)?.itemId ?? '').trim();
    const qty = Number.parseFloat(String((r as any)?.qty ?? 0)) || 0;
    if (id && qty > 0) out.push({ productId: id, qty });
  }
  return out;
};

// Аггрегируем одинаковые productId (qty суммируем)
const aggregateItems = (items: BuyItem[]): BuyItem[] => {
  const m = new Map<string, number>();
  for (const { productId, qty } of items) {
    m.set(productId, (m.get(productId) || 0) + qty);
  }
  const out: BuyItem[] = [];
  m.forEach((qty, productId) => out.push({ productId, qty }));
  return out;
};

/* ---------------- component ---------------- */

const BuyProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const userFromStore = useAppSelector(selectUser);
  const userId: string = (userFromStore as any)?.profile?.userId ?? '';

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      groupedStretchProfilData: [],
      groupedLightPlatformData: [],
      groupedLightRingData: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16),
    },
  });

  const [ready, setReady] = React.useState(false);

  // bootstrap profile
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!cookies?.access_token) {
          navigate('/');
          return;
        }
        await dispatch(userProfile(cookies)).unwrap();
        if (mounted) setReady(true);
      } catch {
        setCookie('access_token', '', { path: '/' });
        navigate('/');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch, cookies, navigate, setCookie]);

  const [profils, setProfils] = React.useState<CatalogItem[]>([]);
  const [platforms, setPlatforms] = React.useState<CatalogItem[]>([]);
  const [rings, setRings] = React.useState<CatalogItem[]>([]);

  // load dictionaries (ТРИ категории, без StretchTexture)
  React.useEffect(() => {
    if (!ready) return;

    (async () => {
      try {
        // Profil
        const p = await dispatch(
          getProductsByCategory({
            cookies,
            categoryId: '65a794201acb8962fc25c963',
          }),
        ).unwrap();

        // Light Platform
        const pl = await dispatch(
          getProductsByCategory({
            cookies,
            categoryId: '65a63e084452458093923a8f',
          }),
        ).unwrap();

        // Light Ring — объединяем две категории
        const [r1, r2] = await Promise.all([
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a639cb4452458093923951',
            }),
          ).unwrap(),
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a639f04452458093923955',
            }),
          ).unwrap(),
        ]);

        setProfils(normCatalog(p?.items || []));
        setPlatforms(normCatalog(pl?.items || []));
        const mergedRings = dedupById([...(r1?.items || []), ...(r2?.items || [])]);
        setRings(normCatalog(mergedRings));
      } catch {
        // тихо гасим и чистим каталоги
        setProfils([]);
        setPlatforms([]);
        setRings([]);
      }
    })();
  }, [dispatch, cookies, ready]);

  // наблюдаемые значения
  const profRows = watch('groupedStretchProfilData');
  const platRows = watch('groupedLightPlatformData');
  const ringRows = watch('groupedLightRingData');

  const profKey = React.useMemo(() => JSON.stringify(profRows ?? []), [profRows]);
  const platKey = React.useMemo(() => JSON.stringify(platRows ?? []), [platRows]);
  const ringKey = React.useMemo(() => JSON.stringify(ringRows ?? []), [ringRows]);

  const total = React.useMemo(() => {
    const n = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
    const t2 = (profRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t3 = (platRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t4 = (ringRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    return +(t2 + t3 + t4).toFixed(2);
  }, [profKey, platKey, ringKey, profRows, platRows, ringRows]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!userId) {
      alert('Պրոֆիլը չի բեռնվել․ փորձեք կրկին.');
      return;
    }

    // 1) Собираем три группы в один массив
    const itemsRaw: BuyItem[] = [
      ...toBuyItems(values.groupedStretchProfilData),
      ...toBuyItems(values.groupedLightPlatformData),
      ...toBuyItems(values.groupedLightRingData),
    ];

    // 2) Схлопываем по productId (qty суммируется)
    const items = aggregateItems(itemsRaw);

    if (items.length === 0) {
      alert('Линии пусты: выберите товары и укажите количество > 0');
      return;
    }

    // 3) Формируем payload
    const payload = {
      items, // [{ productId, qty }]
      date: values.date ? new Date(values.date).toISOString() : undefined,
    };

    try {
      // 4) Отправляем на сервер
      await dispatch(buyProducts({ cookies, body: payload })).unwrap();
      alert('Закупка проведена, склад обновлён.');
      navigate(-1);
    } catch (e: any) {
      console.error(e);
      alert(e?.error || e?.message || 'Ошибка при сохранении закупки');
    }
  };

  if (!ready) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Loading profile…</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 10, margin: '0 auto' }}>
      <CoopStretchMenu />
      <h2>Ստեղծել պատվեր (Coop)</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="compact-form">
        <div className="layout">
          {/* MAIN */}
          <div className="col-main">
            {/* groups */}
            <div className="groups two-col">
              <div className="card dense">
                <SimpleGroup
                  title="Profil"
                  control={control as Control<FormValues>}
                  name="groupedStretchProfilData"
                  catalog={profils}
                  setValue={setValue as UseFormSetValue<FormValues>}
                  getValues={getValues as UseFormGetValues<FormValues>}
                />
              </div>

              <div className="card dense">
                <SimpleGroup
                  title="Light Platform"
                  control={control as Control<FormValues>}
                  name="groupedLightPlatformData"
                  catalog={platforms}
                  setValue={setValue as UseFormSetValue<FormValues>}
                  getValues={getValues as UseFormGetValues<FormValues>}
                />
              </div>

              <div className="card dense">
                <SimpleGroup
                  title="Light Ring"
                  control={control as Control<FormValues>}
                  name="groupedLightRingData"
                  catalog={rings}
                  setValue={setValue as UseFormSetValue<FormValues>}
                  getValues={getValues as UseFormGetValues<FormValues>}
                />
              </div>
            </div>
          </div>

          {/* SIDE */}
          <aside className="col-side">
            <div className="card dense">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Ընդհանուր</span>
                <span>{total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="actions sticky">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !userId}>
            {isSubmitting ? 'Saving…' : 'Create order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyProduct;
