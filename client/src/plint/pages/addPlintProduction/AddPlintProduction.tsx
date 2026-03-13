import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import { userProfile } from '../../../features/user/userApi';
import { getAllPlint } from '../../features/plint/plintApi';
import { PlintProps } from '../../features/plint/plintSlice';
import { PlintMenu } from '../../../component/menu/PlintMenu';

import {
  newPlintProduction,
  getPlintProductions,
  removePlintProduction,   
} from '../../features/plintProduction/plintProductionApi';

import './addPlintProduction.css';

export const AddPlintProduction = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['access_token']);

  const { arrPlint } = useAppSelector((state) => state.plint);
  const { items: productions, total } = useAppSelector((state) => state.plintProduction);

  const [userId, setUserId] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string>(''); 

  const { register, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      name: '',
      quantity: 1,
      plint: '',
      user: '',
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const userRes = await dispatch(userProfile(cookies)).unwrap();
        const foundId =
          userRes?._id ||
          userRes?.user?._id ||
          userRes?.user?.userId; // ← у тебя ID здесь

        if (foundId) {
          setUserId(foundId);
          setValue('user', foundId);
        } else {
          console.warn('⚠️ userProfile не вернул userId/_id:', userRes);
        }

        await dispatch(getAllPlint(cookies)).unwrap();
        await dispatch(getPlintProductions({ cookies, query: { limit: 200 } }));
      } catch (error) {
        setCookie('access_token', '', { path: '/' });
        navigate('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  const onSelectPlint = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selected = arrPlint.find((p) => p._id === id);
    setValue('plint', id);
    if (selected) setValue('name', selected.name);
  };

  const onSubmit = async (form: any) => {
    if (!userId) return alert('No user');
    const payload = {
      date: form.date,
      name: form.name,
      quantity: Number(form.quantity),
      plint: form.plint,
      user: userId,
    };

    const res: any = await dispatch(
      newPlintProduction({ plintProduction: payload, cookies })
    ).unwrap();

    if (res?.error) {
      alert('❌ Error: ' + res.error);
      return;
    }

    alert('✅ Производство добавлено!');
    reset({
      date: new Date().toISOString().slice(0, 10),
      name: '',
      quantity: 1,
      plint: '',
      user: userId,
    });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Ջնջե՞լ այս արտադրանքը։');
    if (!ok) return;
    try {
      setDeletingId(id);
      const res: any = await dispatch(removePlintProduction({ id, cookies })).unwrap();
      if (!res?.ok) {
        alert('❌ Չստացվեց ջնջել');
      }
    } catch (e: any) {
      alert('❌ Սխալ ջնջելիս: ' + (e?.message ?? 'Unknown error'));
    } finally {
      setDeletingId('');
    }
  };

  return (
    <>
      <PlintMenu />
      <div className="addStretchBuyer_head_name">Շրիշակ Մուտքի փաստաթուղթ</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divAddProduction">
          <div className="divLabel">
            <label>Ամսաթիվ</label>
            <input type="date" {...register('date', { required: true })} />
          </div>
          <div className="divLabel">
            <label>Անվանում</label>
            <select {...register('plint', { required: true })} onChange={onSelectPlint}>
              <option value="">Ընտրել</option>
              {arrPlint.map((e: PlintProps) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="divLabel">
            <label>Քանակ</label>
            <input type="number" min={1} {...register('quantity', { required: true })} />
          </div>
          <input type="hidden" {...register('user')} value={userId} />
          <button>Գրանցել</button>
        </div>
      </form>

      <div className="productionTableContainer">
        <h3>Արտադրանքների ցանկ ({total})</h3>
        <table className="productionTable">
          <thead>
            <tr>
              <th>Ամսաթիվ</th>
              <th>Անվանում</th>
              <th>Քանակ</th>
              <th style={{ width: 120 }}>Գործողություններ</th> 
            </tr>
          </thead>
          <tbody>
            {productions.map((p: any) => (
              <tr key={p._id}>
                <td>{new Date(p.date).toLocaleDateString('hy-AM')}</td>
                <td>{p.plint?.name ?? '-'}</td>
                <td>{p.quantity}</td>
                <td>
                  <button
                    onClick={() => onDelete(p._id)}
                    disabled={deletingId === p._id}
                    className="btn-danger"
                    title="Ջնջել"
                  >
                    {deletingId === p._id ? 'Ջնջում...' : 'Ջնջել'}
                  </button>
                </td>
              </tr>
            ))}
            {productions.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>
                  Դատարկ է
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
