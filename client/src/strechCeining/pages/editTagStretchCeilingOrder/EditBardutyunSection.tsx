import React, { ChangeEvent, useEffect } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Data } from '../addTagStretchCeilingOrder/TagStretchOrder';

interface EditBardutyunSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  bardutyunRowId: string[];
  removeBardutyunRow: (rowId: string, roomId: string) => void
  roomId: string;
  stretchBardutyun: Array<Data>;
  bardutyunId: Array<Data>;
}

const EditBardutyunSection: React.FC<EditBardutyunSectionProps> = ({
  register,
  setValue,
  getValues,
  bardutyunRowId,
  removeBardutyunRow,
  roomId,
  stretchBardutyun,
  bardutyunId
}: EditBardutyunSectionProps) => {

  useEffect(() => {
    bardutyunRowId.forEach((rowId: any, index: number) => {
      setValue(`bardutyunId_${rowId}/${roomId}`, bardutyunId[index].id);
      
      if (bardutyunId[index].price) {
        setValue(`bardutyunPrice_${rowId}/${roomId}`, bardutyunId[index].price);
      } else {
        setValue(`bardutyunPrice_${rowId}/${roomId}`, 0);
      }
      if (bardutyunId[index].quantity) {
        setValue(`bardutyunQuantity_${rowId}/${roomId}`, bardutyunId[index].quantity);
      } else {
        setValue(`bardutyunQuantity_${rowId}/${roomId}`, 0);
      }
      if (bardutyunId[index].sum) {
        setValue(`bardutyunSum_${rowId}/${roomId}`, bardutyunId[index].sum);
      } else {
        setValue(`bardutyunSum_${rowId}/${roomId}`, bardutyunId[index].price * bardutyunId[index].quantity);
      }

    });
  }, [bardutyunId]);

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
      setValue(`bardutyunSum_${rowId}/${roomId}`,  Math.ceil(totalPrice));
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
                <th>Քանակ</th>
                <th>Գին</th>
                <th >Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {bardutyunRowId.map((rowId: string) => (
                <tr key={rowId}>
                  <td style={{ minWidth: "250px", }}>
                    <select
                      {...register(`bardutyunId_${rowId}/${roomId}`)}
                      onChange={(e) => stretchBardutyunPrice(e, rowId, roomId)}
                    >
                      <option>Ընտրել Տեսակը</option>
                      {stretchBardutyun && stretchBardutyun.length > 0 ?
                        stretchBardutyun.map((bardutyun: Data) => (
                          <option key={bardutyun._id} value={bardutyun._id}>{bardutyun.name}</option>
                        ))
                        : null}
                    </select>
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
                      placeholder="Price"
                      id={`bardutyunPrice_${rowId}/${roomId}`}
                      {...register(`bardutyunPrice_${rowId}/${roomId}`)}
                      onChange={(e: { target: { value: string } }) =>
                        bardutyunSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`bardutyunQuantity_${rowId}/${roomId}`)))}
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

export default EditBardutyunSection;
