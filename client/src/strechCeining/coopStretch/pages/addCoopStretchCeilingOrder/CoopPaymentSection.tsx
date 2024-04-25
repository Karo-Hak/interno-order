import React, { FC, useEffect } from 'react';
import './tagStretchOrder.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';

interface CoopPaymentSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  setPrepayment: (value: number) => void;
  prepayment: number;
  balance: number;
  setBalance: (value: number) => void;
}

const CoopPaymentSection: FC<CoopPaymentSectionProps> = ({ register, setValue, setPrepayment, prepayment, balance, setBalance }:CoopPaymentSectionProps) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();


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
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CoopPaymentSection;
