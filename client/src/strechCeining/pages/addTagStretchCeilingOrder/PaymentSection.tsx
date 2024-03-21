import React, { FC, useEffect } from 'react';
import './tagStretchOrder.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectStretchWorker } from '../../features/StrechWorker/strechWorkerSlice';
import { allStretchWorker } from '../../features/StrechWorker/strechWorkerApi';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface PaymentSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  setPrepayment: (value: number) => void;
  prepayment: number;
  balance: number;
  setBalance: (value: number) => void;
}

const PaymentSection: FC<PaymentSectionProps> = ({ register, setValue, setPrepayment, prepayment, balance, setBalance }: PaymentSectionProps) => {

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
  const worker = useAppSelector(selectStretchWorker)

  const sumTotal = (e: any) => {
    setBalance(e.target.value)
  }
  const sumPrepeymantTotal = (e: any) => {
    setPrepayment(e.target.value)

  }
  useEffect(() => {
    setValue("groundTotal", balance - prepayment)
  }, [balance, prepayment])

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
                onChange={(e) => sumTotal(e)}

              />
            </td>
            <td>
              <input id="prepayment" type="number" placeholder="prepayment" {...register('prepayment')} onChange={(e) => sumPrepeymantTotal(e)} />
            </td>
            <td>
              <input id="Sum" type="number" placeholder="Sum" {...register('groundTotal')} />
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

export default PaymentSection;
