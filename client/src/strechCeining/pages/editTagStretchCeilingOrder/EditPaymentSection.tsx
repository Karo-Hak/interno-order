import React, { FC, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectStretchWorker } from '../../features/StrechWorker/strechWorkerSlice';
import { allStretchWorker } from '../../features/StrechWorker/strechWorkerApi';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditPaymentSection {
  register: UseFormRegister<any>;
  setOrderSum: (value: number) => void;
  paymentMethod: string;
  setValue: UseFormSetValue<any>;
  balance: number;
  prepayment: number;
  groundTotal: number;
  buyerComment: string;
  stretchWorkerId: { _id?: string }
  stretchWorkerSalary: number;
  setPrepeyment: (value: number) => void;
}

const EditPaymentSection: FC<EditPaymentSection> = ({
  register,
  setOrderSum,
  paymentMethod,
  setValue,
  balance,
  prepayment,
  groundTotal,
  buyerComment,
  stretchWorkerId,
  stretchWorkerSalary,
  setPrepeyment
}: EditPaymentSection) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(allStretchWorker(cookies)).unwrap().then(res => {
      if ("error" in res) {
        setCookie("access_token", '', { path: '/' })
        navigate("/")
      }
    })
  }, [])

  useEffect(() => {
    setValue('paymentMethod', paymentMethod);
    setValue('balance', balance || 0);
    setValue('prepayment', prepayment);
    setValue('groundTotal', balance - prepayment || 0);
    setValue('buyerComment', buyerComment);
    setValue('stWorkerSalary', stretchWorkerSalary);
    if (stretchWorkerId) {
      setValue('stWorkerId', stretchWorkerId._id);
    }
  }, [paymentMethod, balance, prepayment, buyerComment, stretchWorkerId])

  const worker = useAppSelector(selectStretchWorker)
  

  return (
    <div >
      <table className='paymentSection' >
        <thead>
          <tr style={{ background: "#dfdce0" }}>
            <th>Վճարման միջոց</th>
            <th>Գումար</th>
            <th>Կանխավճար</th>
            <th>Մնացորդ</th>
            <th>Նկարագրություն</th>
            <th>Աշխատակից</th>
            <th>Աշխատավարձ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select id="pey" {...register("paymentMethod", { required: true })}>
                <option value={"cash"}>Կանխիկ</option>
                <option value={"transfer"}>Փոխանցում</option>
                <option value={"pos"}>Պոս Տերմինալ</option>
                <option value={"credit"}>Ապառիկ</option>
                <option value={"inecoPay"}>Ինեկո Փեյ</option>
                <option value={"idram"}>Իդրամ</option>
              </select>
            </td>
            <td>
              <input
                id="balance"
                type="number"
                placeholder="Balance"
                {...register('balance')}
              />
            </td>
            <td>
              <input id="prepayment" type="number" placeholder="prepayment" {...register('prepayment')} onChange={(e) => setPrepeyment(+e.target.value)} />
            </td>
            <td>
              <input id="Sum" type="number" placeholder="Sum" {...register('groundTotal')} onChange={(e) => setOrderSum(+e.target.value)} />
            </td>
            <td>
              <textarea className="buyerCommentBuyerSection" placeholder="Buyer Comment" {...register('buyerComment')} />
            </td>
            <td>
              <select id="selectCoop" {...register('stWorkerId')} >
                <option>Աշխատակից</option>
                {worker.arrStretchWorker &&
                  worker.arrStretchWorker.length > 0 ? (
                  worker.arrStretchWorker.map((e: any) => {
                    return (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    );
                  })
                ) : null}
              </select>
            </td>
            <td>
              <input id="salary" type="number" placeholder="Salary" {...register('stWorkerSalary')} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditPaymentSection;
