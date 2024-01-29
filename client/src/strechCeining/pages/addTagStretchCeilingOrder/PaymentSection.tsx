import React, { FC } from 'react';
import './tagStretchOrder.css'

interface PaymentSectionProps {
  register: any;
  setOrderBalance: (value: number) => void;
  setOrderSum: (value: number) => void;
}

const PaymentSection: FC<PaymentSectionProps> = ({ register, setOrderBalance, setOrderSum }: PaymentSectionProps) => {
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
                onChange={(e) => setOrderBalance(+e.target.value)}
              />

            </td>
            <td>
              <input id="prepayment" type="number" placeholder="prepayment" {...register('prepayment')} />
            </td>
            <td>
              <input id="Sum" type="number" placeholder="Sum" {...register('groundTotal')} onChange={(e) => setOrderSum(+e.target.value)} />
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

export default PaymentSection;
