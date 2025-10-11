import React from 'react';
import { useForm, SubmitHandler, Control, UseFormSetValue, UseFormGetValues, UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectUser } from '../../../../features/user/userSlice';
import { userProfile } from '../../../../features/user/userApi';

import './coopReturn.css';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';

import ReturnBuyerBlock from './components/ReturnBuyerBlock';
import ReturnGroups from './components/ReturnGroups';
import ReturnSidebar from './components/ReturnSidebar';

import { allCoopStretchBuyerThunk } from '../../features/coopStrechBuyer/coopStrechBuyerApi';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';
import { getAllStretchProfil } from '../../../features/strechProfil/strechProfilApi';
import { getAllStretchLightPlatform } from '../../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../../features/strechLightRing/strechLightRingApi';
import { createCoopReturn } from '../../features/coopReturn/coopReturnApi';

type BuyerMode = 'existing' | 'new';
type BuyerShort = { _id: string; name: string; phone1?: string };
type CatalogItem = { _id: string; name: string; price: number };

export type FormValues = {
  buyerMode: BuyerMode;
  buyerId?: string;
  buyer: { name?: string; phone1?: string; phone2?: string; region?: string; address?: string };
  groupedStretchTextureData: any[];
  groupedStretchProfilData: any[];
  groupedLightPlatformData: any[];
  groupedLightRingData: any[];
  date: string;
  reason: string;
  comment: string;
  picUrl: string[];
  _picUrlDraft?: string;
  orderId?: string;
};

const pickList = (res: any, keys: string[] = []) => {
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
    name: x.name ?? x.textureName ?? x.profilName ?? x.lightPlatformName ?? x.lightRingName ?? x.title ?? x.label ?? '',
    price: Number(x.price ?? x.pricePerQty ?? x.unitPrice ?? x.cost ?? x.amount ?? 0),
  }));

// мапперы
const toGroupedFromTexture = (rows: any[]) =>
  (rows ?? []).filter((r: any) => r.itemId && (r.name?.trim?.() ?? '') !== '')
    .map((r: any) => {
      const num = (v: any, d = 0) => { const n = Number.parseFloat(String(v ?? '')); return Number.isFinite(n) ? n : d; };
      const name = String(r.name ?? '').trim();
      const height = num(r.height);
      const width = num(r.width);
      const qty = num(r.qty);
      const price = num(r.price);
      const sum = r.sum != null && String(r.sum) !== '' ? num(r.sum) : +(qty * price).toFixed(2);
      return { name, height, width, qty, price, sum };
    });

const toGrouped = (rows: any[]) =>
  (rows ?? []).filter((r: any) => r.itemId && (r.name?.trim?.() ?? '') !== '')
    .map((r: any) => {
      const num = (v: any, d = 0) => { const n = Number.parseFloat(String(v ?? '')); return Number.isFinite(n) ? n : d; };
      return { name: r.name, qty: num(r.qty), price: num(r.price), sum: num(r.sum ?? (num(r.qty) * num(r.price))), width: 0, height: 0 };
    });

const AddCoopReturn: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const userFromStore = useAppSelector(selectUser);
  const userId: string = (userFromStore as any)?.profile.userId ?? '';

  const {
    register, control, handleSubmit, setValue, getValues, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      buyerMode: 'existing',
      buyer: {},
      groupedStretchTextureData: [],
      groupedStretchProfilData: [],
      groupedLightPlatformData: [],
      groupedLightRingData: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      reason: '',
      comment: '',
      picUrl: [],
      _picUrlDraft: '',
      orderId: params.id,
    },
  });

  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!cookies?.access_token) { navigate('/'); return; }
        await dispatch(userProfile(cookies)).unwrap();
        if (mounted) setReady(true);
      } catch {
        setCookie('access_token', '', { path: '/' });
        navigate('/');
      }
    })();
    return () => { mounted = false; };
  }, [dispatch, cookies, navigate, setCookie]);

  const [buyers, setBuyers] = React.useState<BuyerShort[]>([]);
  const [textures, setTextures] = React.useState<CatalogItem[]>([]);
  const [profils, setProfils] = React.useState<CatalogItem[]>([]);
  const [platforms, setPlatforms] = React.useState<CatalogItem[]>([]);
  const [rings, setRings] = React.useState<CatalogItem[]>([]);

  React.useEffect(() => {
    if (!ready) return;
    dispatch(allCoopStretchBuyerThunk(cookies)).unwrap()
      .then((res: any) => {
        const arr = pickList(res, ['buyers', 'list', 'data', 'items', 'result']);
        setBuyers(arr.map((b: any) => ({ _id: b._id, name: b.name, phone1: b.phone1 })));
      })
      .catch(() => setBuyers([]));

    dispatch(getAllStretchTexture(cookies)).unwrap()
      .then((res: any) => setTextures(normCatalog(pickList(res, ['stretchTexture','textures','allStretchTexture','list','data','items']))))
      .catch(() => setTextures([]));

    dispatch(getAllStretchProfil(cookies)).unwrap()
      .then((res: any) => setProfils(normCatalog(pickList(res, ['stretchProfil','profils','allStretchProfil','list','data','items']))))
      .catch(() => setProfils([]));

    dispatch(getAllStretchLightPlatform(cookies)).unwrap()
      .then((res: any) => setPlatforms(normCatalog(pickList(res, ['stretchLightPlatform','lightPlatforms','allStretchLightPlatform','list','data','items']))))
      .catch(() => setPlatforms([]));

    dispatch(getAllStretchLightRing(cookies)).unwrap()
      .then((res: any) => setRings(normCatalog(pickList(res, ['stretchLightRing','lightRings','allStretchLightRing','list','data','items']))))
      .catch(() => setRings([]));
  }, [dispatch, cookies, ready]);

  const buyerMode = watch('buyerMode');

  const total = React.useMemo(() => {
    const n = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
    const t1 = (watch('groupedStretchTextureData') || []).reduce((a, r) => a + n(r.sum), 0);
    const t2 = (watch('groupedStretchProfilData') || []).reduce((a, r) => a + n(r.sum), 0);
    const t3 = (watch('groupedLightPlatformData') || []).reduce((a, r) => a + n(r.sum), 0);
    const t4 = (watch('groupedLightRingData') || []).reduce((a, r) => a + n(r.sum), 0);
    return +(t1 + t2 + t3 + t4).toFixed(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(watch('groupedStretchTextureData')),
    JSON.stringify(watch('groupedStretchProfilData')),
    JSON.stringify(watch('groupedLightPlatformData')),
    JSON.stringify(watch('groupedLightRingData')),
  ]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!userId) { alert('Պրոֆիլը չի բեռնվել․ փորձեք կրկին.'); return; }
    const payload = {
      date: values.date ? new Date(values.date).toISOString() : undefined,
      groupedStretchTextureData: toGroupedFromTexture(values.groupedStretchTextureData),
      groupedStretchProfilData: toGrouped(values.groupedStretchProfilData),
      groupedLightPlatformData: toGrouped(values.groupedLightPlatformData),
      groupedLightRingData: toGrouped(values.groupedLightRingData),
      reason: values.reason?.trim() || '',
      comment: values.comment?.trim() || '',
      picUrl: values.picUrl || [],
      buyerId: values.buyerMode === 'existing' ? String(values.buyerId ?? '') : '',
      orderId: values.orderId?.trim() || undefined,
      userId,
    };
    if (!payload.buyerId) { alert('Ընտրեք գնորդին (այժմ՝ միայն գոյություն ունեցող)'); return; }

    try {
      await dispatch(createCoopReturn({ cookies, payload })).unwrap();
      alert('Վերադարձը ստեղծված է');
      navigate('/coopStretchceiling/viewCoopReturnList');
    } catch (e: any) {
      alert(e?.message || 'Չստացվեց ստեղծել վերադարձ');
    }
  };

  if (!ready) return <div style={{ padding: 16 }}><h3>Loading profile…</h3></div>;

  return (
    <div style={{ padding: 10, margin: '0 auto' }}>
      <CoopStretchMenu />
      <h2>Ստեղծել Վերադարձ (Coop)</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="compact-form">
        <div className="layout">
          {/* MAIN */}
          <div className="col-main">
            <ReturnBuyerBlock
              buyerMode={buyerMode}
              setBuyerMode={(m) => setValue('buyerMode', m)}
              register={register as unknown as UseFormRegister<FormValues>}
              errors={errors as FieldErrors<FormValues>}
              buyers={buyers}
              setValue={setValue as UseFormSetValue<FormValues>}
              watch={watch as UseFormWatch<FormValues>}
              onlyExisting
            />

            <div className="card dense">
              <label>Ամսաթիվ</label>
              <input type="datetime-local" {...register('date')} />
            </div>

            <ReturnGroups
              control={control as unknown as Control<FormValues>}
              setValue={setValue as UseFormSetValue<FormValues>}
              getValues={getValues as UseFormGetValues<FormValues>}
              textures={textures}
              profils={profils}
              platforms={platforms}
              rings={rings}
              fieldNames={{
                texture: 'groupedStretchTextureData',
                profil: 'groupedStretchProfilData',
                platform: 'groupedLightPlatformData',
                ring: 'groupedLightRingData',
              }}
              forceQtyVisible
            />

            <div className="card dense">
              <label>Պատճառ</label>
              <input {...register('reason')} placeholder="օր.՝ չափը չի համապատասխանել" />
              <label>Մեկնաբանություն</label>
              <textarea {...register('comment')} rows={2} />
            </div>
          </div>

          {/* SIDE */}
          <ReturnSidebar register={register} setValue={setValue} watch={watch} total={total} />
        </div>

        <div className="actions sticky">
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" disabled={isSubmitting || !userId}>
            {isSubmitting ? 'Saving…' : 'Create Return'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoopReturn;
