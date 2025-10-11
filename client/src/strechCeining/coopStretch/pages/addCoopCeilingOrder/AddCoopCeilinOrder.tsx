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
import "./addCoopCeilinOrder.css"



import { allCoopStretchBuyerThunk } from '../../features/coopStrechBuyer/coopStrechBuyerApi';
import { createCoopOrder, type PaymentMethod } from '../../features/coopCeilingOrder/coopCeilingOrderApi';

import BuyerSection from './components/BuyerSection';
import TextureGroup, { TextureRow } from './components/TextureGroup';
import SimpleGroup, { SimpleRow } from './components/SimpleGroup';
import PaymentSection from './components/PaymentSection';
import PhotoUrls from './components/PhotoUrls';
import { getAllStretchLightPlatform } from '../../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../../features/strechLightRing/strechLightRingApi';
import { getAllStretchProfil } from '../../../features/strechProfil/strechProfilApi';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';

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

    date: string; // ISO yyyy-mm-ddTHH:mm
    buyerComment: string;
    paymentMethod: PaymentMethod;
    balance: number | '';
    picUrl: string[];
    _picUrlDraft?: string;
};

// --- helpers to extract array from various API shapes ---
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

// normalize catalog items
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
        price: Number(x.price ?? x.pricePerQty ?? x.unitPrice ?? x.cost ?? x.amount ?? 0),
    }));

// DTO mappers (qty for texture = sq)
const toGroupedFromTexture = (rows: TextureRow[]) =>
    rows
        .filter(r => r.itemId && (r.name?.trim() ?? '') !== '')
        .map(r => {
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

            // 👇 добавили qty как алиас sq, чтобы пройти валидацию бэка
            return { name, height, width, qty, price, sum };
        });


const toGrouped = (rows: SimpleRow[]) =>
    rows
        .filter(r => r.itemId && (r.name?.trim() ?? '') !== '')
        .map(r => ({
            name: r.name,
            qty: Number.parseFloat(String(r.qty ?? 0)) || 0,
            price: Number.parseFloat(String(r.price ?? 0)) || 0,
            sum: Number.parseFloat(String(r.sum ?? 0)) || 0,
        }));

const AddCoopCeilinOrder: React.FC = () => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const userFromStore = useAppSelector(selectUser);
    const userId: string =
        (userFromStore as any)?.profile.userId ??
        '';

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
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16),
            buyerComment: '',
            paymentMethod: 'cash',
            balance: '',
            picUrl: [],
            _picUrlDraft: '',
        },
    });

    const [ready, setReady] = React.useState(false);

    // bootstrap: ensure profile is loaded
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // если нет токена — на логин
                if (!cookies?.access_token) {
                    navigate('/');
                    return;
                }
                await dispatch(userProfile(cookies)).unwrap();
                if (mounted) setReady(true);
            } catch {
                // токен невалидный — чистим и уходим на логин
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

    // load reference data
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
            .then((res: any) => setTextures(normCatalog(pickList(res, ['stretchTexture', 'textures', 'allStretchTexture', 'list', 'data', 'items']))))
            .catch(() => setTextures([]));

        dispatch(getAllStretchProfil(cookies))
            .unwrap()
            .then((res: any) => setProfils(normCatalog(pickList(res, ['stretchProfil', 'profils', 'allStretchProfil', 'list', 'data', 'items']))))
            .catch(() => setProfils([]));

        dispatch(getAllStretchLightPlatform(cookies))
            .unwrap()
            .then((res: any) => setPlatforms(normCatalog(pickList(res, ['stretchLightPlatform', 'lightPlatforms', 'allStretchLightPlatform', 'list', 'data', 'items']))))
            .catch(() => setPlatforms([]));

        dispatch(getAllStretchLightRing(cookies))
            .unwrap()
            .then((res: any) => setRings(normCatalog(pickList(res, ['stretchLightRing', 'lightRings', 'allStretchLightRing', 'list', 'data', 'items']))))
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
        if (!userId) {
            alert('Պրոֆիլը չի բեռնվել․ փորձեք կրկին.');
            return;
        }

        const stretchTextureOrder = {
            groupedStretchTextureData: toGroupedFromTexture(values.groupedStretchTextureData),
            groupedStretchProfilData: toGrouped(values.groupedStretchProfilData),
            groupedLightPlatformData: toGrouped(values.groupedLightPlatformData),
            groupedLightRingData: toGrouped(values.groupedLightRingData),

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
            console.log(stretchTextureOrder);

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
            <h2 >
                Ստեղծել պատվեր (Coop)
            </h2>

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

                        {/* Две колонки для групп */}
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
                        </div>
                    </div>

                    {/* SIDE (sticky) */}
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
                    <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" disabled={isSubmitting || !userId}>
                        {isSubmitting ? 'Saving…' : 'Create order'}
                    </button>
                </div>
            </form>

        </div>
    );
};

export default AddCoopCeilinOrder;
