import React from 'react';
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectUser } from '../../../../features/user/userSlice';
import { userProfile } from '../../../../features/user/userApi';
import './addCoopCeilinOrder.css';
import { allCoopStretchBuyerThunk } from '../../features/coopStrechBuyer/coopStrechBuyerApi';
import { createCoopOrder, type PaymentMethod } from '../../features/coopCeilingOrder/coopCeilingOrderApi';
import BuyerSection from './components/BuyerSection';
import TextureGroup, { TextureRow } from './components/TextureGroup';
import SimpleGroup, { SimpleRow } from './components/SimpleGroup';
import PaymentSection from './components/PaymentSection';
import PhotoUrls from './components/PhotoUrls';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';
import { getProductsByCategory } from '../../../features/product/productApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { getAllStretchAdditional } from '../../../features/strechAdditional/strechAdditionalApi';

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

  groupedStretchTextureData: TextureRow[];
  groupedStretchProfilData: SimpleRow[];
  groupedLightPlatformData: SimpleRow[];
  groupedLightRingData: SimpleRow[];
  groupedAdditionalData: SimpleRow[];

  date: string; // ISO yyyy-mm-ddTHH:mm
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

const dedupById = <T extends { _id: string }>(arr: T[]): T[] => {
  const map = new Map<string, T>();
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    map.set(it._id, it);
  }
  return Array.from(map.values());
};

const toGroupedFromTexture = (rows: TextureRow[]) =>
  rows
    .filter((r) => r.itemId && (r.name?.trim() ?? '') !== '')
    .map((r) => {
      const num = (v: unknown, d = 0) => {
        const n = Number.parseFloat(String(v ?? ''));
        return Number.isFinite(n) ? n : d;
      };
      const name = (r.name ?? '').trim();
      const height = num(r.height);
      const width = num(r.width);
      const qty = +(height * width || 0).toFixed(3);
      const price = num(r.price);
      const sum =
        r.sum !== undefined && r.sum !== null && String(r.sum) !== ''
          ? num(r.sum)
          : +(qty * price).toFixed(2);
      return { name, height, width, qty, price, sum };
    });

const toGrouped = (rows: SimpleRow[]) =>
  rows
    .filter((r) => r.itemId && (r.name?.trim() ?? '') !== '')
    .map((r) => ({
      name: r.name,
      qty: Number.parseFloat(String(r.qty ?? 0)) || 0,
      price: Number.parseFloat(String(r.price ?? 0)) || 0,
      sum: Number.parseFloat(String(r.sum ?? 0)) || 0,
    }));

/* ---------------- component ---------------- */

const AddCoopCeilinOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const userFromStore = useAppSelector(selectUser);
  const userId: string = (userFromStore as any)?.profile.userId ?? '';

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      buyerMode: 'existing',
      buyer: {},
      groupedStretchTextureData: [],
      groupedStretchProfilData: [],
      groupedLightPlatformData: [],
      groupedLightRingData: [],
      groupedAdditionalData: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      buyerComment: '',
      paymentMethod: 'cash',
      balance: '',
      picUrl: [],
      _picUrlDraft: '',
    },
  });

  const [ready, setReady] = React.useState(false);

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

  const [buyers, setBuyers] = React.useState<BuyerShort[]>([]);
  const [textures, setTextures] = React.useState<CatalogItem[]>([]);
  const [profils, setProfils] = React.useState<CatalogItem[]>([]);
  const [platforms, setPlatforms] = React.useState<CatalogItem[]>([]);
  const [rings, setRings] = React.useState<CatalogItem[]>([]);
  const [additionals, setAdditionals] = React.useState<CatalogItem[]>([]);

  React.useEffect(() => {
    if (!ready) return;

    // Buyers
    dispatch(allCoopStretchBuyerThunk(cookies))
      .unwrap()
      .then((res: any) => {
        const arr = pickList(res, ['buyers', 'list', 'data', 'items', 'result']);
        setBuyers(arr.map((b: any) => ({ _id: b._id, name: b.name, phone1: b.phone1 })));
      })
      .catch(() => setBuyers([]));

    // Textures 
    dispatch(getAllStretchTexture(cookies))
      .unwrap()
      .then((res: any) =>
        setTextures(
          normCatalog(pickList(res, ['stretchTexture', 'textures', 'allStretchTexture', 'list', 'data', 'items'])),
        ),
      )
      .catch(() => setTextures([]));

    // Additional 
    dispatch(getAllStretchAdditional(cookies))
      .unwrap()
      .then((res: any) =>
        setAdditionals(
          normCatalog(pickList(res, ['stretchAdditional'])),
        ),
      )
      .catch(() => setTextures([]));

    (async () => {
      try {
        const [profRes, platRes] = await Promise.all([
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a794201acb8962fc25c963', // Profil

            }),
          ).unwrap(),
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a63e084452458093923a8f', // Light Platform

            }),
          ).unwrap(),
        ]);

        setProfils(normCatalog(profRes?.items || []));
        setPlatforms(normCatalog(platRes?.items || []));
      } catch {
        setProfils([]);
        setPlatforms([]);
      }
    })();

    (async () => {
      try {
        const [r1, r2] = await Promise.all([
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a639cb4452458093923951', // Light Ring 

            }),
          ).unwrap(),
          dispatch(
            getProductsByCategory({
              cookies,
              categoryId: '65a639f04452458093923955', // Light Ring B

            }),
          ).unwrap(),
        ]);

        const merged = dedupById([...(r1?.items || []), ...(r2?.items || [])]
        );
        setRings(normCatalog(merged));
      } catch {
        setRings([]);
      }
    })();
  }, [dispatch, cookies, ready]);

  const buyerMode = watch('buyerMode');

  const texRows = watch('groupedStretchTextureData');
  const profRows = watch('groupedStretchProfilData');
  const platRows = watch('groupedLightPlatformData');
  const ringRows = watch('groupedLightRingData');
  const additionalRows = watch('groupedAdditionalData');

  const texKey = React.useMemo(() => JSON.stringify(texRows ?? []), [texRows]);
  const profKey = React.useMemo(() => JSON.stringify(profRows ?? []), [profRows]);
  const platKey = React.useMemo(() => JSON.stringify(platRows ?? []), [platRows]);
  const ringKey = React.useMemo(() => JSON.stringify(ringRows ?? []), [ringRows]);
  const additionalRow = React.useMemo(() => JSON.stringify(additionalRows ?? []), [ringRows]);

  const total = React.useMemo(() => {
    const n = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
    const t1 = (texRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t2 = (profRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t3 = (platRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t4 = (ringRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    const t5 = (additionalRows ?? []).reduce((a: number, r: any) => a + n(r.sum), 0);
    return +(t1 + t2 + t3 + t4 + t5).toFixed(2);
  }, [texKey, profKey, platKey, ringKey, additionalRow, texRows, profRows, platRows, ringRows, additionalRows ]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!userId) {
      alert('Պրոֆիլը չի բեռնվել․ փորձեք կրկին.');
      return;
    }

    const stretchTextureOrder = {
      groupedStretchTextureData: toGroupedFromTexture(values.groupedStretchTextureData),
      groupedStretchProfilData: toGrouped(values.groupedStretchProfilData),
      groupedLightPlatformData: toGrouped(values.groupedLightPlatformData),
      groupedLightRingData: toGrouped(values.groupedLightRingData),
      groupedAdditionalData: toGrouped(values.groupedAdditionalData),

      date: values.date ? new Date(values.date).toISOString() : undefined,
      buyerComment: values.buyerComment || '',
      balance: Number.parseFloat(String(values.balance ?? 0)) || 0,
      paymentMethod: values.paymentMethod,
      picUrl: values.picUrl || [],
    };

    const buyer =
      values.buyerMode === 'existing'
        ? { buyerId: values.buyerId?.trim() }
        : {
          name: values.buyer.name?.trim(),
          phone1: values.buyer.phone1?.trim(),
          phone2: values.buyer.phone2?.trim(),
          region: values.buyer.region?.trim(),
          address: values.buyer.address?.trim(),
        };

    try {
      const res = await dispatch(
        createCoopOrder({
          cookies,
          payload: { stretchTextureOrder, buyer, userId },
        }),
      ).unwrap();

      alert('Order created: ' + res.orderId);
      navigate('/coopStretchceiling/report');
    } catch (e: any) {
      alert(e?.message || 'Failed to create order');
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
            <div className="card dense">
              <BuyerSection
                buyerMode={buyerMode}
                setBuyerMode={(m) => setValue('buyerMode', m)}
                register={register as UseFormRegister<FormValues>}
                errors={errors as FieldErrors<FormValues>}
                buyers={buyers}
                setValue={setValue as UseFormSetValue<FormValues>}
                watch={watch as UseFormWatch<FormValues>}
              />
            </div>

            {/* groups */}
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
              <div className="card dense">
                <SimpleGroup
                  title="Additional"
                  control={control as Control<FormValues>}
                  name="groupedAdditionalData"
                  catalog={additionals}
                  setValue={setValue as UseFormSetValue<FormValues>}
                  getValues={getValues as UseFormGetValues<FormValues>}
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
          <button type="submit" disabled={isSubmitting || !userId}>
            {isSubmitting ? 'Saving…' : 'Create order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoopCeilinOrder;
