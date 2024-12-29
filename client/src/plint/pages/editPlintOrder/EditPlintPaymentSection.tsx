import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useAppDispatch } from '../../../app/hooks';


interface EditPlintPaymentSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  setPrepayment: (value: number) => void;
  prepayment: number;
  balance: number;
  setBalance: (value: number) => void;
  paymentMethod: string;
  comment: string,
  coopDiscount: number,
  coopTotal: number,
  deliverySum: number,
  delivery: boolean,
  setDelivery: (value: boolean) => void
}

const EditPlintPaymentSection: FC<EditPlintPaymentSectionProps> = ({
  register,
  setValue,
  setPrepayment,
  prepayment,
  balance,
  setBalance,
  paymentMethod,
  comment,
  coopDiscount,
  coopTotal,
  deliverySum,
  delivery,
  setDelivery
}: EditPlintPaymentSectionProps) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();






  function handleCheckboxDelivery(event: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = event.target.checked;
    
    setDelivery(isChecked); 
  
    setValue("delivery", isChecked); 
  }

  useEffect(() => {
    setValue("delivery", delivery); 
  }, [delivery, setValue]);
  
  
  return (
    <div className='plintPaymenttableDiv'>
      <div className='plintPaymenttableDiv1'>
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
                />
              </td>
              <td>
                <input id="prepayment" type="number" placeholder="prepayment" {...register('prepayment')} />
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
      <div className='plintPaymenttableDiv2'>
        <table className='paymentSection' >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th>Գործ․ %</th>
              <th>Գործ․ գումար</th>
              <th>Առաքում</th>
              <th>Առ․ գումար</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input id="discount" type="text" placeholder="discount" {...register('coopDiscount')} />
              </td>
              <td>
                <input id="coopTotal" type="number" placeholder="coopTotal" {...register('coopTotal')} />
              </td>
              <td>
                <p>Մեր կողմից</p>
                <input
                  id="delivery"
                  type="checkbox"
                  {...register('delivery')} 
                  onChange={handleCheckboxDelivery} 
                  defaultChecked={delivery}
                />
              </td>
              <td>
                <input id="deliverySum" type="number" placeholder="deliverySum" {...register('deliverySum')} />
              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default EditPlintPaymentSection;
