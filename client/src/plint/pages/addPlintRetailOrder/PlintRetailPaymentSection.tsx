import { FC, useEffect, useState } from 'react';
import './plintRetailOrder.css'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';


interface PlintPaymentSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
}

const PlintRetailPaymentSection: FC<PlintPaymentSectionProps> = ({
  register,
  setValue,
}: PlintPaymentSectionProps) => {

  const [delivery, setDelivery] = useState<boolean>(false)

  function handleCheckboxDelivery(event: any) {
    setDelivery(event.target.checked);
  }
  useEffect(() => {
    setValue("delivery", delivery)
  }, [delivery])


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
              <th>Զեղչ %</th>
              <th>
              <input id="delivery" type="checkbox" placeholder="Delivery" {...register('delivery')} onChange={handleCheckboxDelivery} />
                Առաքման Հասցե
                </th>
              <th>Հեռ․</th>
              <th>Առ․ գումար</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input id="discount" type="text" placeholder="discount" {...register('discount')} />
              </td>
              <td>
                <input  style={{minWidth:"200px"}} id="deliveryAddress" type="text" placeholder="Delivery Address" {...register('deliveryAddress')} />
              </td>
              <td>
                <input id="deliveryPhone" type="text" placeholder="Delivery Phone" {...register('deliveryPhone')} onChange={handleCheckboxDelivery} />
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

export default PlintRetailPaymentSection;
