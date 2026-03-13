import { selectUser } from '../../../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { addNewPlint, getAllPlint, updatePlintPrice } from '../../features/plint/plintApi';
import { PlintProps } from '../../features/plint/plintSlice';
import { useForm } from 'react-hook-form';

type FormValues = {
  _id?: string;
  name: string;
  retailPriceAMD: number | string;
  wholesalePriceAMD: number | string;
};

export const AddPlint: React.FC = (): JSX.Element => {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset, setError } =
    useForm<FormValues>({ defaultValues: { name: '', retailPriceAMD: '', wholesalePriceAMD: '' } });

  const user = useAppSelector(selectUser);
  const [plint, setPlint] = useState<PlintProps[]>([]);
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const [checkedPlint, setCheckedPlint] = useState(false); // true → обновление цен

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(getAllPlint(cookies)).unwrap();
        if (res?.error) {
          setCookie('access_token', '', { path: '/' });
          navigate('/');
        } else if (res?.plint) {
          setPlint(res.plint);
        } else if (Array.isArray(res)) {
          setPlint(res);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [dispatch, cookies, navigate, setCookie]);

  function handleCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    setCheckedPlint(checked);
    reset({ name: '', retailPriceAMD: '', wholesalePriceAMD: '', _id: undefined });
  }

  function selectedPlintPrice(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    const found = plint.find((p) => p._id === selectedId);
    if (found) {
      setValue('_id', found._id);
      setValue('name', found.name);
      setValue('retailPriceAMD', found.retailPriceAMD);
      setValue('wholesalePriceAMD', found.wholesalePriceAMD);
    }
  }

  const onSubmitPlint = async (values: FormValues) => {
    const name = (values.name ?? '').trim();
    const retailPriceAMD = Number(values.retailPriceAMD);
    const wholesalePriceAMD = Number(values.wholesalePriceAMD);

    if (!Number.isFinite(retailPriceAMD) || retailPriceAMD < 0) {
      setError('retailPriceAMD', { type: 'validate', message: 'Մանրածախ գին ≥ 0' });
      return;
    }
    if (!Number.isFinite(wholesalePriceAMD) || wholesalePriceAMD < 0) {
      setError('wholesalePriceAMD', { type: 'validate', message: 'Մեծածախ գին ≥ 0' });
      return;
    }

    try {
      if (checkedPlint) {
        if (!values._id) {
          setError('_id', { type: 'required', message: 'Ընտրեք ապրանք' });
          return;
        }
        const res = await dispatch(
          updatePlintPrice({
            plint: { _id: values._id, retailPriceAMD, wholesalePriceAMD },
            cookies,
          })
        ).unwrap();

        if (res?.error) {
          alert(res.error);
          return;
        }

        setPlint((prev) =>
          prev.map((p) =>
            p._id === res._id ? { ...p, retailPriceAMD: res.retailPriceAMD, wholesalePriceAMD: res.wholesalePriceAMD } : p
          )
        );
        alert('Գինը թարմացվեց');
        reset({ name: '', retailPriceAMD: '', wholesalePriceAMD: '', _id: undefined });
      } else {
        if (!name) {
          setError('name', { type: 'required', message: 'Մուտքագրեք անվանում' });
          return;
        }

        const res = await dispatch(
          addNewPlint({
            plint: { name, retailPriceAMD, wholesalePriceAMD, stockBalance: 0 }, // временно 0
            cookies,
          })
        ).unwrap();

        if (res?.error) {
          alert(res.error);
          return;
        }
        if (res && res._id) setPlint((prev) => [res, ...prev]);
        alert('Ապրանքը գրանցվեց');
        reset({ name: '', retailPriceAMD: '', wholesalePriceAMD: '' });
      }
    } catch (e: any) {
      const msg = e?.payload?.message || e?.message || 'Սխալ';
      alert(msg);
    }
  };

  return (
    <>
      <PlintMenu />
      <div>
        <form onSubmit={handleSubmit(onSubmitPlint)}>
          <div style={{ display: 'flex', margin: 20, gap: 10 }}>
            <div className="divLabel">
              <label htmlFor="Checkbox">Թարմացնել գինը</label>
              <input id="Checkbox" type="checkbox" onChange={handleCheckbox} checked={checkedPlint} />
            </div>

            <div className="divLabel">
              <label htmlFor="name">Անվանում</label>
              {!checkedPlint ? (
                <input id="name" type="text" placeholder="Name" {...register('name', { required: true })} />
              ) : (
                <select id="selectPlint" {...register('_id', { required: true })} onChange={selectedPlintPrice}>
                  <option value="">Ընտրել ապրանք</option>
                  {plint.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              )}
              {errors._id && <small style={{ color: 'crimson' }}>{String(errors._id.message)}</small>}
            </div>

            <div className="divLabel">
              <label htmlFor="retailPriceAMD">Մանրածախ Գին (AMD)</label>
              <input
                id="retailPriceAMD"
                type="number"
                inputMode="numeric"
                placeholder="Retail"
                {...register('retailPriceAMD', { required: true })}
              />
              {errors.retailPriceAMD && <small style={{ color: 'crimson' }}>{String(errors.retailPriceAMD.message)}</small>}
            </div>

            <div className="divLabel">
              <label htmlFor="wholesalePriceAMD">Մեծածախ Գին (AMD)</label>
              <input
                id="wholesalePriceAMD"
                type="number"
                inputMode="numeric"
                placeholder="Wholesale"
                {...register('wholesalePriceAMD', { required: true })}
              />
              {errors.wholesalePriceAMD && (
                <small style={{ color: 'crimson' }}>{String(errors.wholesalePriceAMD.message)}</small>
              )}
            </div>

            <button disabled={isSubmitting}>Գրանցել</button>
          </div>
        </form>

        {plint.length > 0 && (
          <div style={{ margin: 20, width: 600 }}>
            <table className="tableName">
              <thead>
                <tr>
                  <th>Անվանում</th>
                  <th>Մանրածախ Գին</th>
                  <th>Մեծածախ Գին</th>
                  <th>Քանակ</th>
                </tr>
              </thead>
              <tbody>
                {plint.map((e) => (
                  <tr key={e._id}>
                    <td>{e.name}</td>
                    <td>{e.retailPriceAMD}</td>
                    <td>{e.wholesalePriceAMD}</td>
                    <td>{e.stockBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
