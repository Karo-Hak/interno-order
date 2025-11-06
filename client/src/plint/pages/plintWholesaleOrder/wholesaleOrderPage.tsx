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
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import './wholesaleOrder.css';

import { http } from '../../../api/http';
import { createPlintBuyer, getPlintBuyers } from '../../features/plintBuyer/plintBuyerApi';
import BuyerSectionPlint from './components/BuyerSectionPlint';
import PaymentSectionPlint from './components/PaymentSectionPlint';
import { SimpleRow } from '../../../strechCeining/coopStretch/pages/addCoopCeilingOrder/components/SimpleGroup';
import ItemsGroup from './components/ItemsGroup';
import DeliverySection from './components/DeliverySection';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { createPlintWholesaleOrder } from '../../features/plintWholesaleOrder/plintWholesaleOrderApi';

export type BuyerMode = 'existing' | 'new';
type BuyerShort = { _id: string; name: string; phone1?: string };
type AgentShort = { _id: string; name: string; phone1?: string };
type CatalogItem = { _id: string; name: string; price: number; sku?: string };

// ---------- ФОРМА ----------
export type FormValues = {
    buyerMode: BuyerMode;
    buyerId?: string;
    buyer: { name?: string; phone1?: string; phone2?: string; region?: string; address?: string };

    agentId?: string;

    items: SimpleRow[];

    delivery: boolean;
    deliveryAddress?: string;
    deliveryPhone?: string;
    deliverySum?: number | '';

    date: string;
    buyerComment: string;
    paymentMethod: 'cash' | 'card' | 'transfer' | 'other';

    balance: number | '';

    agentDiscount: number | ''; // %
    agentSum: number | '';      // вычисляемое поле = (balance - deliverySum) * (agentDiscount/100)
};

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

const normProducts = (arr: any[]): CatalogItem[] =>
    (arr ?? []).map((x: any) => ({
        _id: String(x._id ?? x.id ?? crypto.randomUUID()),
        name: String(x.name ?? x.title ?? ''),
        price: Number(x.wholesalePriceAMD ?? x.price ?? 0),
        sku: x.sku ? String(x.sku) : undefined,
    }));

const normPhone = (s?: string) => (s ? s.replace(/[^\d]/g, '') : '');
const isHex24 = (s?: string) => !!s && /^[0-9a-fA-F]{24}$/.test(s);

const AddPlintWholesaleOrder: React.FC = () => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const userFromStore = useAppSelector(selectUser);
    const userId: string = (userFromStore as any)?.profile?.userId ?? '';

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
            agentId: '',
            items: [],
            delivery: false,
            deliveryAddress: '',
            deliveryPhone: '',
            deliverySum: '',
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16),
            buyerComment: '',
            paymentMethod: 'cash',
            balance: '',              // будет синхронизироваться с total
            agentDiscount: '',        // %
            agentSum: '',             // = (balance - deliverySum) * agentDiscount%
        },
    });

    const [ready, setReady] = React.useState(false);
    const [buyers, setBuyers] = React.useState<BuyerShort[]>([]);
    const [agents, setAgents] = React.useState<AgentShort[]>([]);
    const [products, setProducts] = React.useState<CatalogItem[]>([]);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!cookies?.access_token) { navigate('/'); return; }
                await dispatch(userProfile(cookies)).unwrap();
                if (!mounted) return;

                try {
                    const { data } = await http.get('/plint-buyer', {
                        headers: cookies.access_token ? { Authorization: `Bearer ${cookies.access_token}` } : {},
                        params: { limit: 200, skip: 0 },
                    });
                    const arr = pickList(data, ['items', 'buyers', 'data', 'list', 'result']);
                    setBuyers(arr.map((b: any) => ({ _id: b._id, name: b.name, phone1: b.phone1 })));
                } catch { setBuyers([]); }

                try {
                    const { data } = await http.get('/plint-agent', {
                        headers: cookies.access_token ? { Authorization: `Bearer ${cookies.access_token}` } : {},
                        params: { limit: 200, skip: 0 },
                    });
                    const arr = pickList(data, ['items', 'agents', 'data', 'list', 'result']);
                    setAgents(arr.map((b: any) => ({ _id: b._id, name: b.name, phone1: b.phone1 })));
                } catch { setAgents([]); }

                try {
                    const { data } = await http.get('/plint-products/allPlint', {
                        headers: cookies.access_token ? { Authorization: `Bearer ${cookies.access_token}` } : {},
                    });
                    setProducts(normProducts(pickList(data, ['items', 'data', 'list'])));
                } catch { setProducts([]); }

                setReady(true);
            } catch {
                setCookie('access_token', '', { path: '/' });
                navigate('/');
            }
        })();
        return () => { mounted = false; };
    }, [dispatch, cookies, navigate, setCookie]);

    // ---- ИТОГО (total) ----
    const total = React.useMemo(() => {
        const n = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
        const itemsSum = (watch('items') || []).reduce((a, r) => a + n(r.sum), 0);
        const deliverySum = n(watch('deliverySum'));
        return +(itemsSum + deliverySum).toFixed(2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watch('items')), watch('deliverySum')]);

    // Синхронизируем balance = total (раз предоплаты нет)
    React.useEffect(() => {
        setValue('balance', total, { shouldDirty: true, shouldValidate: false });
        // также пересчитаем агентскую сумму при изменении total
        const agentId = watch('agentId');
        const disc = Number(watch('agentDiscount')) || 0;
        const delSum = Number(watch('deliverySum')) || 0;
        if (isHex24(agentId) && disc >= 0) {
            const s = +((total - delSum) * (disc / 100)).toFixed(2);
            setValue('agentSum', s, { shouldDirty: true, shouldValidate: false });
        } else {
            setValue('agentSum', '', { shouldDirty: true, shouldValidate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    // Когда меняется agentId или agentDiscount — пересчитать agentSum
    React.useEffect(() => {
        const agentId = watch('agentId');
        const discRaw = watch('agentDiscount');
        const disc = Number.parseFloat(String(discRaw ?? ''));
        const bal = Number(watch('balance')) || 0;
        const delSum = Number(watch('deliverySum')) || 0;

        if (isHex24(agentId) && Number.isFinite(disc) && disc >= 0) {
            const s = +((bal - delSum) * (disc / 100)).toFixed(2);
            setValue('agentSum', s, { shouldDirty: true, shouldValidate: false });
        } else {
            setValue('agentSum', '', { shouldDirty: true, shouldValidate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('agentId'), watch('agentDiscount')]);

    const createBuyerIfNeeded = async (values: FormValues): Promise<string> => {
        if (values.buyerMode === 'existing') {
            const id = values.buyerId?.trim();
            if (!id) throw new Error('Ընտրեք գնորդին ցանկից');
            return id;
        }

        const formPhone = values.buyer.phone1?.trim();
        if (formPhone) {
            const queryRes: any = await dispatch(
                getPlintBuyers({ cookies, q: formPhone, limit: 10, skip: 0 })
            ).unwrap();

            const foundArr: any[] = Array.isArray(queryRes?.items)
                ? queryRes.items
                : Array.isArray(queryRes)
                    ? queryRes
                    : [];

            const formDigits = normPhone(formPhone);
            const exists = foundArr.some(
                (b) => normPhone(b.phone1) === formDigits || normPhone(b.phone2) === formDigits
            );

            if (exists) throw new Error('⚠️ Գնորդ այս հեռախոսահամարով արդեն գոյություն ունի');
        }

        const res: any = await dispatch(
            createPlintBuyer({
                buyer: {
                    name: (values.buyer.name ?? '').trim(),
                    phone1: values.buyer.phone1?.trim() || undefined,
                    phone2: values.buyer.phone2?.trim() || undefined,
                    region: values.buyer.region?.trim() || undefined,
                    address: values.buyer.address?.trim() || undefined,
                },
                cookies,
            })
        ).unwrap();

        const newId = res?._id || res?.id;
        if (!newId) throw new Error('Failed to create buyer');
        return String(newId);
    };

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        const num = (v: any, d = 0) => {
            const n = Number.parseFloat(String(v ?? ''));
            return Number.isFinite(n) ? n : d;
        };

        let buyerId: string;
        try {
            buyerId = await createBuyerIfNeeded(values);
        } catch (e: any) {
            alert(e?.message || 'Buyer error'); return;
        }

        const items = (values.items || [])
            .filter(r => r.itemId && (r.name?.trim() ?? '') !== '')
            .map(r => ({
                productId: isHex24(r.itemId) ? r.itemId : undefined,
                name: (r.name ?? '').trim(),
                sku: (r.sku ?? '').trim(),
                qty: num(r.qty),
                price: num(r.price),
                sum: num(r.sum ?? num(r.qty) * num(r.price)),
            }));

        // agentId → agent (бэкенд ожидает agent, и он опционален)
        const agent = isHex24(values.agentId) ? values.agentId : undefined;

        const dto: any = {
            date: values.date ? new Date(values.date).toISOString() : undefined,
            items,
            delivery: !!values.delivery,
            deliveryAddress: values.deliveryAddress?.trim() || '',
            deliveryPhone: values.deliveryPhone?.trim() || '',
            deliverySum: num(values.deliverySum),
            paymentMethod: values.paymentMethod,
            buyerComment: values.buyerComment?.trim() || '',
            prepayment: 0,
            buyer: buyerId,
            userId: userId,
            agent, // опционально
            agentDiscount: values.agentDiscount === '' ? undefined : num(values.agentDiscount),
            agentSum: values.agentSum === '' ? undefined : num(values.agentSum),
        };

        try {
            const res = await dispatch(createPlintWholesaleOrder({ cookies, dto })).unwrap();
            alert('Order created: ' + (res?._id || res?.orderId || 'OK'));
            navigate('/plint/report/monthly');
        } catch (e: any) {
            alert(e?.message || 'Failed to create order');
        }
    };

    if (!ready) return <div style={{ padding: 16 }}><h3>Loading…</h3></div>;

    return (
        <>
            <PlintMenu />

            <div style={{ padding: 10, margin: '0 auto' }}>
                <h2>Ստեղծել պատվեր (Plint Retail)</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="compact-form">
                    <div className="layout">
                        <div className="col-main">
                            <div className="card dense">
                                <BuyerSectionPlint
                                    buyerMode={watch('buyerMode')}
                                    setBuyerMode={(m) => setValue('buyerMode', m as 'existing' | 'new')}
                                    register={register as UseFormRegister<FormValues>}
                                    errors={errors as FieldErrors<FormValues>}
                                    buyers={buyers}
                                    agents={agents}
                                    setValue={setValue as UseFormSetValue<FormValues>}
                                    watch={watch as UseFormWatch<FormValues>}
                                />
                            </div>

                            <div className="card dense">
                                <ItemsGroup
                                    title="Պլինտուս / Plinths"
                                    control={control as unknown as Control<FormValues>}
                                    name="items"
                                    catalog={products}
                                    setValue={setValue as UseFormSetValue<FormValues>}
                                    getValues={getValues as UseFormGetValues<FormValues>}
                                />
                            </div>

                            <div className="card dense">
                                <DeliverySection register={register} watch={watch} setValue={setValue} />
                            </div>
                        </div>

                        <aside className="col-side">
                            <div className="card dense sticky-side">
                                <PaymentSectionPlint total={total} register={register} setValue={setValue} />
                                {/* Показать текущий баланс для наглядности */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <span style={{ opacity: 0.75 }}>Balance (UI)</span>
                                    <strong>{(Number(watch('balance')) || total).toLocaleString()}</strong>
                                </div>
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
        </>
    );
};

export default AddPlintWholesaleOrder;
