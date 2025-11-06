import React, { useEffect, useState } from 'react';
import { http } from '../../../../api/http';
import { PlintProps } from '../../../features/plint/plintSlice';
import { useAppDispatch } from '../../../../app/hooks';
import { getAllPlint } from '../../../features/plint/plintApi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

type Product = {
    _id: string;
    name: string;
    retailPriceAMD: number;
    sku?: string;
    stockBalance?: number;
};

type Props = {
    cookies?: { access_token?: string };
    value?: { id?: string; name?: string; sku?: string; price?: number };
    onSelect: (p: { id: string; name: string; sku?: string; price: number }) => void;
    limit?: number;
};

const authHeader = (t?: string) => (t ? { Authorization: `Bearer ${t}` } : {});

const ProductSelect: React.FC<Props> = ({ value, onSelect, limit = 500 }) => {
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string>(value?.id || '');
    const [products, setProducts] = useState<PlintProps[]>([]);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();




    useEffect(() => {
        (async () => {
            try {
                const res = await dispatch(getAllPlint(cookies)).unwrap();
                if (res?.error) {
                    setCookie('access_token', '', { path: '/' });
                    navigate('/');
                } else if (res?.plint) {
                    setProducts(res.plint);
                } else if (Array.isArray(res)) {
                    setProducts(res);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [dispatch, cookies, navigate, setCookie]);

    useEffect(() => {
        if (!selectedId) return;
        const p = products.find((x) => x._id === selectedId);
        if (p) {
            onSelect({ id: p._id, name: p.name,  price: Number(p.retailPriceAMD) || 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    return (
        <div>
            <label className="lbl">Плинтус</label>
            <select
                className="inp"
                disabled={loading}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
            >
                <option value="">— выберите плинтус —</option>
                {products.map((p) => (
                    <option key={p._id} value={p._id}>
                        {p.name}  
                    </option>
                ))}
            </select>
            {loading && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Загрузка списка…</div>}

            {/* Показать текущее выбранное значение (read-only) */}
            {value?.name && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                    Выбрано: <b>{value.name}</b>  {value.price ? `· ${value.price} ֏` : ''}
                </div>
            )}
        </div>
    );
};

export default ProductSelect;
