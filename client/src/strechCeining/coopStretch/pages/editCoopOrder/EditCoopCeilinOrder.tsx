// src/strechCeining/coopStretch/pages/editCoopOrder/EditCoopCeilinOrder.tsx
import React from 'react';
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues,
} from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../../app/hooks';

import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { userProfile } from '../../../../features/user/userApi';

import { getAllStretchLightPlatform } from '../../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../../features/strechLightRing/strechLightRingApi';
import { getAllStretchProfil } from '../../../features/strechProfil/strechProfilApi';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';

import './addCoopCeilinOrder.css';

import {
  getCoopOrder,
  updateCoopOrder,
  type PaymentMethod,
  type CoopCeilingOrderModel,
} from '../../features/coopCeilingOrder/coopCeilingOrderApi';
import { allCoopStretchBuyerThunk } from '../../features/coopStrechBuyer/coopStrechBuyerApi';

import BuyerSection from '../addCoopCeilingOrder/components/BuyerSection';
import PaymentSection from '../addCoopCeilingOrder/components/PaymentSection';
import PhotoUrls from '../addCoopCeilingOrder/components/PhotoUrls';
import SimpleGroup, { SimpleRow } from '../addCoopCeilingOrder/components/SimpleGroup';
import TextureGroup, { TextureRow } from '../addCoopCeilingOrder/components/TextureGroup';

export type BuyerMode = 'existing' | 'new';

type BuyerShort = { _id: string; name: string; phone1?: string };
type CatalogItem = { _id: string; name: string; price: number };

export type FormValues = {
  buyerMode: BuyerMode;
  buyerId?: string;
  buyer: {
    name?: string;
    phone1?: string;
    phone2?: string;
    region?: string;
    address?: string;
  };

  groupedStretchTextureData: TextureRow[]; // height + width + qty + price + sum
  groupedStretchProfilData: SimpleRow[];
  groupedLightPlatformData: SimpleRow[];
  groupedLightRingData: SimpleRow[];

  date: string; // yyyy-mm-ddTHH:mm
  buyerComment: string;
  paymentMethod: PaymentMethod;
  balance: number | '';
  picUrl: string[];
  _picUrlDraft?: string;
};

/* ---------------- helpers ---------------- */

const pickList = (res: any, keys: string[] = []): any[] => {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object') {
    for (const k of keys) {
      const v = (res as any)?.[k];
      if (Array.isArray(v)) return v;
    }
    for (const v of Object.values(res)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
};

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
    price: Number(x.coopPrice ?? x.pricePerQty ?? x.unitPrice ?? x.cost ?? x.amount ?? 0),
  }));

const toSimpleRows = (arr: any[] = []): SimpleRow[] =>
  arr.map((r) => ({
    sku: '',
    itemId: '',
    name: String(r?.name ?? ''),
    qty: Number(r?.qty ?? 0),
    price: Number(r?.price ?? 0),
    sum: Number(r?.sum ?? 0),
  }));

// из модели → строки формы (сохранённые height & width)
const toTextureRowsFromModel = (arr: any[] = []): TextureRow[] =>
  arr.map((r) => {
    const height = Number(r?.height ?? 0);
    const width = Number(r?.width ?? 0);
    const qty = +((Number.isFinite(height) ? height : 0) * (Number.isFinite(width) ? width : 0)).toFixed(3);
    const price = Number(r?.price ?? 0);
    const sum = +(qty * price).toFixed(2);
    return {
      itemId: '',
      name: String(r?.name ?? ''),
      height,
      width,
      qty,
      price,
      sum,
    };
  });

// из формы → patch для API (кладём height/width/qty/sum)
const toGroupedTextureForPatch = (rows: TextureRow[]) =>
  (rows ?? [])
    .filter((r) => (r.name?.trim() ?? '') !== '')
    .map((r) => {
      const height = Number(r?.height ?? 0);
      const width = Number(r?.width ?? 0);
      const qty = +((height * width) || 0).toFixed(3);
      const price = Number(r?.price ?? 0);
      const sum = +(qty * price).toFixed(2);
      return { name: r.name ?? '', height, width, qty, price, sum };
    });

const toGroupedSimpleForPatch = (rows: SimpleRow[]) =>
  (rows ?? [])
    .filter((r) => (r.name?.trim() ?? '') !== '')
    .map((r) => ({
      name: r.name ?? '',
      qty: Number(r.qty ?? 0),
      price: Number(r.price ?? 0),
      sum: Number(r.sum ?? 0),
    }));

// нормализация
const norm = (s?: string) => (s ?? '').toLocaleLowerCase().trim();
const mapByName = (catalog: CatalogItem[]) => {
  const m = new Map<string, CatalogItem>();
  for (const c of catalog) m.set(norm(c.name), c);
  return m;
};
const mapById = (catalog: CatalogItem[]) => {
  const m = new Map<string, CatalogItem>();
  for (const c of catalog) m.set(String(c._id), c);
  return m;
};

// числа
const toNum = (v: any) => {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : 0;
};
const isEmptyPrice = (v: any) => {
  const n = Number(v);
  return !Number.isFinite(n) || n <= 0;
};

/* ---------------- Component ---------------- */

const EditCoopCeilinOrder: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      buyerMode: 'existing',
      buyer: {},
      groupedStretchTextureData: [],
      groupedStretchProfilData: [],
      groupedLightPlatformData: [],
      groupedLightRingData: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      buyerComment: '',
      paymentMethod: 'cash',
      balance: '',
      picUrl: [],
      _picUrlDraft: '',
    },
  });

  const [ready, setReady] = React.useState(false);
  const [buyers, setBuyers] = React.useState<BuyerShort[]>([]);
  const [textures, setTextures] = React.useState<CatalogItem[]>([]);
  const [profils, setProfils] = React.useState<CatalogItem[]>([]);
  const [platforms, setPlatforms] = React.useState<CatalogItem[]>([]);
  const [rings, setRings] = React.useState<CatalogItem[]>([]);

  // auth/profile
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

  // dictionaries
  React.useEffect(() => {
    if (!ready) return;

    dispatch(allCoopStretchBuyerThunk(cookies))
      .unwrap()
      .then((res: any) => {
        const arr = pickList(res, ['buyers', 'list', 'data', 'items', 'result']);
        setBuyers(arr.map((b: any) => ({ _id: b._id, name: b.name, phone1: b.phone1 })));
      })
      .catch(() => setBuyers([]));

    dispatch(getAllStretchTexture(cookies))
      .unwrap()
      .then((res: any) =>
        setTextures(
          normCatalog(pickList(res, ['stretchTexture', 'textures', 'allStretchTexture', 'list', 'data', 'items']))
        )
      )
      .catch(() => setTextures([]));

    dispatch(getAllStretchProfil(cookies))
      .unwrap()
      .then((res: any) =>
        setProfils(normCatalog(pickList(res, ['stretchProfil', 'profils', 'allStretchProfil', 'list', 'data', 'items'])))
      )
      .catch(() => setProfils([]));

    dispatch(getAllStretchLightPlatform(cookies))
      .unwrap()
      .then((res: any) =>
        setPlatforms(
          normCatalog(
            pickList(res, ['stretchLightPlatform', 'lightPlatforms', 'allStretchLightPlatform', 'list', 'data', 'items'])
          )
        )
      )
      .catch(() => setPlatforms([]));

    dispatch(getAllStretchLightRing(cookies))
      .unwrap()
      .then((res: any) =>
        setRings(
          normCatalog(pickList(res, ['stretchLightRing', 'lightRings', 'allStretchLightRing', 'list', 'data', 'items']))
        )
      )
      .catch(() => setRings([]));
  }, [dispatch, cookies, ready]);

  // load order
  React.useEffect(() => {
    if (!ready || !id) return;
    (async () => {
      try {
        const { order } = await dispatch(getCoopOrder({ cookies, id })).unwrap();
        hydrateForm(order);
        tryAutofillAllByCatalog(); // после гидрации — сразу попытка найти хиты
      } catch (e: any) {
        alert(e?.message || 'Order not found');
        navigate(-1);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, id]);

  const hydrateForm = (o: CoopCeilingOrderModel) => {
    const buyerId =
      typeof (o as any)?.buyer === 'string'
        ? String((o as any).buyer)
        : (o as any)?.buyer?._id
        ? String((o as any).buyer._id)
        : '';

    const buyerMode: BuyerMode = buyerId ? 'existing' : 'new';

    const texRows = toTextureRowsFromModel(o.groupedStretchTextureData);
    const profRows = toSimpleRows(o.groupedStretchProfilData);
    const platRows = toSimpleRows(o.groupedLightPlatformData);
    const ringRows = toSimpleRows(o.groupedLightRingData);

    const dateLocal = o.date
      ? new Date(o.date).toISOString().slice(0, 16)
      : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    reset({
      buyerMode,
      buyerId: buyerId || '',
      buyer: {
        name: (o as any)?.buyer?.name ?? '',
        phone1: (o as any)?.buyer?.phone1 ?? '',
        phone2: (o as any)?.buyer?.phone2 ?? '',
        region: (o as any)?.buyer?.region ?? '',
        address: (o as any)?.buyer?.address ?? '',
      },

      groupedStretchTextureData: texRows,
      groupedStretchProfilData: profRows,
      groupedLightPlatformData: platRows,
      groupedLightRingData: ringRows,

      date: dateLocal,
      buyerComment: o.buyerComment ?? '',
      paymentMethod: o.paymentMethod ?? 'cash',
      balance: Number(o.balance ?? 0),
      picUrl: Array.isArray(o.picUrl) ? o.picUrl : [],
      _picUrlDraft: '',
    });
  };

  /** Универсальная автоподстановка по каталогу: сначала byId, потом byName. */
  const tryAutofillGroup = React.useCallback(
    (groupName: 'groupedStretchProfilData' | 'groupedLightPlatformData' | 'groupedLightRingData',
     catalog: CatalogItem[]) => {
      if (!catalog.length) return;
      const byId = mapById(catalog);
      const byName = mapByName(catalog);

      const rows = getValues(groupName) || [];
      rows.forEach((r: SimpleRow, idx: number) => {
        const idHit = r.itemId ? byId.get(String(r.itemId)) : undefined;
        const nameHit = r.name ? byName.get(norm(r.name)) : undefined;
        const hit = idHit || nameHit;
        if (!hit) return;

        // itemId — чтобы селект отобразил имя
        if (!r.itemId) {
          setValue(`${groupName}.${idx}.itemId` as const, hit._id, { shouldDirty: false });
        }
        // name — только если пуст/пробелы
        const curName = String(getValues(`${groupName}.${idx}.name` as const) ?? '').trim();
        if (!curName) {
          setValue(`${groupName}.${idx}.name` as const, hit.name, { shouldDirty: true });
        }

        // price — уважаем пользовательский (>0)
        const curPrice = toNum(getValues(`${groupName}.${idx}.price` as const));
        const price = isEmptyPrice(curPrice) ? Number(hit.price || 0) : curPrice;
        if (price !== curPrice) {
          setValue(`${groupName}.${idx}.price` as const, price, { shouldDirty: true });
        }

        // sum = qty * price
        const qty = toNum(getValues(`${groupName}.${idx}.qty` as const));
        const sum = +(qty * price).toFixed(2);
        setValue(`${groupName}.${idx}.sum` as const, sum, { shouldDirty: true });
      });
    },
    [getValues, setValue]
  );

  const tryAutofillTextures = React.useCallback(() => {
    if (!textures.length) return;
    const byId = mapById(textures);
    const byName = mapByName(textures);

    const rows = getValues('groupedStretchTextureData') || [];
    rows.forEach((r: TextureRow, idx: number) => {
      const idHit = r.itemId ? byId.get(String(r.itemId)) : undefined;
      const nameHit = r.name ? byName.get(norm(r.name)) : undefined;
      const hit = idHit || nameHit;
      if (!hit) return;

      // itemId для селекта
      if (!r.itemId) {
        setValue(`groupedStretchTextureData.${idx}.itemId`, hit._id, { shouldDirty: false });
      }
      // name — только если пустой/пробельный
      const curName = String(getValues(`groupedStretchTextureData.${idx}.name`) ?? '').trim();
      if (!curName) {
        setValue(`groupedStretchTextureData.${idx}.name`, hit.name, { shouldDirty: true });
      }

      // price — не перетираем свою (>0)
      const curPrice = toNum(getValues(`groupedStretchTextureData.${idx}.price`));
      const price = isEmptyPrice(curPrice) ? Number(hit.price || 0) : curPrice;
      if (price !== curPrice) {
        setValue(`groupedStretchTextureData.${idx}.price`, price, { shouldDirty: true });
      }

      // qty: если пуст, height*width
      const h = toNum(getValues(`groupedStretchTextureData.${idx}.height`));
      const w = toNum(getValues(`groupedStretchTextureData.${idx}.width`));
      const curQty = toNum(getValues(`groupedStretchTextureData.${idx}.qty`));
      const calcQty = +((h * w) || 0).toFixed(3);
      const qty = curQty > 0 ? curQty : calcQty;
      if (qty !== curQty) {
        setValue(`groupedStretchTextureData.${idx}.qty`, qty, { shouldDirty: true });
      }

      // sum
      const sum = +(qty * price).toFixed(2);
      setValue(`groupedStretchTextureData.${idx}.sum`, sum, { shouldDirty: true });
    });
  }, [textures, getValues, setValue]);

  const tryAutofillAllByCatalog = React.useCallback(() => {
    tryAutofillTextures();
    tryAutofillGroup('groupedStretchProfilData', profils);
    tryAutofillGroup('groupedLightPlatformData', platforms);
    tryAutofillGroup('groupedLightRingData', rings);
  }, [tryAutofillTextures, tryAutofillGroup, profils, platforms, rings]);

  // повторная автоподстановка при подгрузке любого каталога
  React.useEffect(() => { tryAutofillAllByCatalog(); }, [tryAutofillAllByCatalog]);

  /* total */
  const texRows = watch('groupedStretchTextureData');
  const profRows = watch('groupedStretchProfilData');
  const platRows = watch('groupedLightPlatformData');
  const ringRows = watch('groupedLightRingData');

  const kTex = React.useMemo(() => JSON.stringify(texRows ?? []), [texRows]);
  const kProf = React.useMemo(() => JSON.stringify(profRows ?? []), [profRows]);
  const kPlat = React.useMemo(() => JSON.stringify(platRows ?? []), [platRows]);
  const kRing = React.useMemo(() => JSON.stringify(ringRows ?? []), [ringRows]);

  const total = React.useMemo(() => {
    const n = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
    const t1 = (texRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t2 = (profRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t3 = (platRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t4 = (ringRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    return +(t1 + t2 + t3 + t4).toFixed(2);
  }, [kTex, kProf, kPlat, kRing, texRows, profRows, platRows, ringRows]);

  const buyerMode = watch('buyerMode');

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const patch = {
        groupedStretchTextureData: toGroupedTextureForPatch(values.groupedStretchTextureData),
        groupedStretchProfilData: toGroupedSimpleForPatch(values.groupedStretchProfilData),
        groupedLightPlatformData: toGroupedSimpleForPatch(values.groupedLightPlatformData),
        groupedLightRingData: toGroupedSimpleForPatch(values.groupedLightRingData),

        date: values.date ? new Date(values.date).toISOString() : undefined,
        buyerComment: values.buyerComment || '',
        balance: Number.parseFloat(String(values.balance ?? 0)) || 0,
        paymentMethod: values.paymentMethod,
        picUrl: values.picUrl || [],
        ...(values.buyerMode === 'existing'
          ? { buyerId: values.buyerId?.trim() || undefined }
          : undefined),
      };

      const res = await dispatch(updateCoopOrder({ cookies, id, patch })).unwrap();
      alert(res?.message ?? 'Order updated');
      navigate('/coopStretchceiling/report');
    } catch (e: any) {
      alert(e?.message || 'Failed to update order');
    }
  };

  if (!ready) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Loading…</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 10, margin: '0 auto' }}>
      <CoopStretchMenu />
      <h2>Խմբագրել պատվեր (Coop) / Edit order</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="compact-form">
        <div className="layout">
          {/* MAIN */}
          <div className="col-main">
            <div className="card dense">
              <BuyerSection
                buyerMode={buyerMode}
                setBuyerMode={(m: any) => setValue('buyerMode', m)}
                register={register as UseFormRegister<FormValues>}
                errors={errors as FieldErrors<FormValues>}
                buyers={buyers}
                setValue={setValue as UseFormSetValue<FormValues>}
                watch={watch as UseFormWatch<FormValues>}
              />
              {buyerMode === 'existing' && (() => {
                const selId = watch('buyerId');
                const b = buyers.find(x => x._id === selId);
                if (!b) return null;
                return (
                  <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                    Ընտրված գնորդը: <b>{b.name}</b>{b.phone1 ? ` · ${b.phone1}` : ''}
                  </div>
                );
              })()}
            </div>

            <div className="groups two-col">
              <div className="card dense">
                <TextureGroup
                  title="Stretch Texture"
                  control={control as Control<FormValues>}
                  name="groupedStretchTextureData"
                  catalog={textures}
                  setValue={setValue as UseFormSetValue<FormValues>}
                  getValues={getValues as UseFormGetValues<FormValues>}
                />
              </div>

              <div className="card dense">
                <SimpleGroup
                  title="Profil"
                  control={control}
                  name="groupedStretchProfilData"
                  catalog={profils}
                  setValue={setValue}
                  getValues={getValues}
                />
              </div>

              <div className="card dense">
                <SimpleGroup
                  title="Light Platform"
                  control={control}
                  name="groupedLightPlatformData"
                  catalog={platforms}
                  setValue={setValue}
                  getValues={getValues}
                />
              </div>

              <div className="card dense">
                <SimpleGroup
                  title="Light Ring"
                  control={control}
                  name="groupedLightRingData"
                  catalog={rings}
                  setValue={setValue}
                  getValues={getValues}
                />
              </div>
            </div>
          </div>

          {/* SIDE */}
          <aside className="col-side">
            <div className="card dense sticky-side">
              <PaymentSection total={total} register={register} setValue={setValue} />
            </div>

            <div className="card dense">
              <PhotoUrls register={register} setValue={setValue} watch={watch} />
            </div>

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
          <button type="submit" disabled={isSubmitting || !id}>
            {isSubmitting ? 'Saving…' : 'Update order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCoopCeilinOrder;
