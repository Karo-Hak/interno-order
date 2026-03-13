import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { userProfile } from '../../../features/user/userApi';
import { selectUser } from '../../../features/user/userSlice';
import { allStretchBuyer, newStretchBuyer } from '../../features/StrechBuyer/strechBuyerApi';
import { selectStretchBuyer } from '../../features/StrechBuyer/strechBuyerSlice';
import { StretchMenu } from '../../../component/menu/StretchMenu';

type CreateBuyerForm = {
  buyerName: string;
  buyerPhone1: string;
  buyerPhone2?: string;
  buyerRegion?: string;
  buyerAddress?: string;
};

export const StretchBuyer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['access_token']);
  const user = useAppSelector(selectUser);
  const buyer = useAppSelector(selectStretchBuyer);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateBuyerForm>({ mode: 'onTouched' });

  useEffect(() => {
    (async () => {
      const r1 = await dispatch(userProfile(cookies)).unwrap();
      if (r1 && typeof r1 === 'object' && 'error' in r1) {
        setCookie('access_token', '', { path: '/' });
        navigate('/');
        return;
      }
      const r2 = await dispatch(allStretchBuyer(cookies)).unwrap();
      if (r2 && typeof r2 === 'object' && 'error' in r2) {
        setCookie('access_token', '', { path: '/' });
        navigate('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const onSubmit = async (form: CreateBuyerForm) => {
    const res = await dispatch(newStretchBuyer({ stretchBuyer: form, cookies })).unwrap();
    if (res && typeof res === 'object' && 'error' in res) {
      alert((res as any).error);
      return;
    }
    await dispatch(allStretchBuyer(cookies));
    reset();
  };

  return (
    <>
      <StretchMenu />
      <div className="addStretchBuyer_head_name">Ձգվող Առաստաղ (Գնորդ)</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="addStrerchBuyer_info">
          <div className="addStrerchBuyer_info_section">
            <label htmlFor="buyerName">Անուն</label>
            <input
              id="buyerName"
              type="text"
              placeholder="Name"
              {...register('buyerName', { required: 'Պարտադիր դաշտ' })}
            />
            {errors.buyerName && <small>{errors.buyerName.message}</small>}
          </div>

          <div className="addStrerchBuyer_info_section">
            <label htmlFor="buyerPhone1">Հեռախոս 1</label>
            <input
              id="buyerPhone1"
              type="tel" // телефон не как number
              placeholder="Phone"
              {...register('buyerPhone1', {
                required: 'Պարտադիր դաշտ',
                minLength: { value: 5, message: 'Չափազանց կարճ' },
              })}
            />
            {errors.buyerPhone1 && <small>{errors.buyerPhone1.message}</small>}
          </div>

          <div className="addStrerchBuyer_info_section">
            <label htmlFor="buyerPhone2">Հեռախոս 2</label>
            <input
              id="buyerPhone2"
              type="tel"
              placeholder="Phone (optional)"
              {...register('buyerPhone2')}
            />
          </div>

          <div className="addStrerchBuyer_info_section">
            <label htmlFor="buyerRegion">Մարզ</label>
            <input
              id="buyerRegion"
              type="text"
              placeholder="Region"
              {...register('buyerRegion')}
            />
          </div>

          <div className="addStrerchBuyer_info_section">
            <label htmlFor="buyerAddress">Հասցե</label>
            <input
              id="buyerAddress"
              type="text"
              placeholder="Address"
              {...register('buyerAddress')}
            />
          </div>

          <div className="addStrerchBuyer_info_section">
            <button type="submit" disabled={isSubmitting}>Գրանցել</button>
          </div>
        </div>
      </form>

      {buyer.arrStretchBuyer?.length > 0 && (
        <div className="addStretchBuyer_table">
          <div className="addStretchBuyer_head_name">Գնորդների ցուցակ</div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Անուն</th>
                <th scope="col">Հեռախոս</th>
                <th scope="col">Հեռախոս</th>
                <th scope="col">Մարզ</th>
                <th scope="col">Հասցե</th>
              </tr>
            </thead>
            <tbody>
              {buyer.arrStretchBuyer.map((e: any) => (
                <tr key={e._id}>
                  <td>{e.buyerName}</td>
                  <td>{e.buyerPhone1}</td>
                  <td>{e.buyerPhone2}</td>
                  <td>{e.buyerRegion}</td>
                  <td>{e.buyerAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
