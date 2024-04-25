import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Data } from './TagStretchOrder';


interface BardutyunSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  bardutyunRowId: Array<string>;
  removeBardutyunRow: (rowId: string, roomId: string) => void;
  roomId: string;
  stretchBardutyun: Array<Data>;
}

const BardutyunSection: React.FC<BardutyunSectionProps> = ({
  register,
  setValue,
  getValues,
  bardutyunRowId,
  removeBardutyunRow,
  roomId,
  stretchBardutyun
}: BardutyunSectionProps) => {


  const stretchBardutyunPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const bardutyun = stretchBardutyun.find((e: { _id: string }) => e._id === selectedId);
    if (bardutyun) {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, bardutyun.price);
      setValue(`bardutyunQuantity_${rowKey}/${roomId}`, "")
      bardutyunSum(rowKey, bardutyun.price, 0)
    } else {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, 0);
    }
  };

  const bardutyunSum = (rowId: string, price: number, quantity: number): void => {

    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`bardutyunSum_${rowId}/${roomId}`, totalPrice);
    } else {
      setValue(`bardutyunSum_${rowId}/${roomId}`, 0);
    }
  };

  return (
    <div style={{ marginLeft: "5px", width: "100%" }} >
      {
        bardutyunRowId && bardutyunRowId.length > 0 ?

          <table className="table tableSection" >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th>Բարդություն</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {bardutyunRowId.map((rowId: any) => (
                <tr key={rowId}>
                  <td style={{ minWidth: "250px", }}>
                    <select
                      {...register(`bardutyunId_${rowId}/${roomId}`)}
                      onChange={(e) => stretchBardutyunPrice(e, rowId, roomId)}
                    >
                      <option>Ընտրել Տեսակը</option>
                      {stretchBardutyun.length > 0 ?
                        stretchBardutyun.map((bardutyun: { _id: string, name: string }) => (
                          <option key={bardutyun._id} value={bardutyun._id}>{bardutyun.name}</option>
                        ))
                        : null}
                    </select>
                  </td>
                  <td>
                    <input
                      placeholder="Price"
                      id={`bardutyunPrice_${rowId}/${roomId}`}
                      {...register(`bardutyunPrice_${rowId}/${roomId}`)}
                      onChange={(e: { target: { value: string } }) =>
                        bardutyunSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`bardutyunQuantity_${rowId}/${roomId}`)))}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Quantity"
                      id={`bardutyunQuantity_${rowId}/${roomId}`}
                      {...register(`bardutyunQuantity_${rowId}/${roomId}`)}
                      onChange={(e: { target: { value: string } }) =>
                        bardutyunSum(rowId, parseFloat(getValues(`bardutyunPrice_${rowId}/${roomId}`)), parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Sum"
                      id={`bardutyunSum_${rowId}/${roomId}`}
                      {...register(`bardutyunSum_${rowId}/${roomId}`)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeBardutyunRow(rowId, roomId)}>
                      Հեռացնել
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : null
      }
    </div>
  );
};

export default BardutyunSection;
