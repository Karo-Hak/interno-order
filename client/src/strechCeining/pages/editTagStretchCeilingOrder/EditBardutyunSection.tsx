import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditBardutyunSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  bardutyunRowId: string[];
  removeBardutyunRow: (rowId: string, roomId: string) => void
  roomId: string;
  stretchBardutyun: { arrStretchBardutyun: Array<any> };
  bardutyunId: Array<{ bardutyun: string; bardutyunPrice: number; bardutyunQuantity: number }>;
}

const EditBardutyunSection: React.FC<EditBardutyunSectionProps> = ({
  register,
  setValue,
  bardutyunRowId,
  removeBardutyunRow,
  roomId,
  stretchBardutyun,
  bardutyunId
}: EditBardutyunSectionProps) => {

  useEffect(() => {
    bardutyunRowId.forEach((rowId: any, index: number) => {
      setValue(`bardutyun_${rowId}/${roomId}`, bardutyunId[index].bardutyun);
      
      if (bardutyunId[index].bardutyunPrice) {
        setValue(`bardutyunPrice_${rowId}/${roomId}`, bardutyunId[index].bardutyunPrice);
      } else {
        setValue(`bardutyunPrice_${rowId}/${roomId}`, 0);
      }
      if (bardutyunId[index].bardutyunQuantity) {
        setValue(`bardutyunQuantity_${rowId}/${roomId}`, bardutyunId[index].bardutyunQuantity);
      } else {
        setValue(`bardutyunQuantity_${rowId}/${roomId}`, 0);
      }

    });
  }, [bardutyunId]);

  const stretchBardutyunPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const bardutyun = stretchBardutyun.arrStretchBardutyun.find((e: any) => e._id === selectedId);
    if (bardutyun) {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, bardutyun.price);
    } else {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, 0);
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
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {bardutyunRowId.map((el: any) => (
                <tr key={el}>
                  <td style={{ minWidth: "250px", }}>
                    <select
                      {...register(`bardutyun_${el}/${roomId}`)}
                      onChange={(e) => stretchBardutyunPrice(e, el, roomId)}
                    >
                      <option>Ընտրել Տեսակը</option>
                      {stretchBardutyun.arrStretchBardutyun && stretchBardutyun.arrStretchBardutyun.length > 0 ?
                        stretchBardutyun.arrStretchBardutyun.map((bardutyun: any) => (
                          <option key={bardutyun._id} value={bardutyun._id}>{bardutyun.name}</option>
                        ))
                        : null}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Price"
                      {...register(`bardutyunPrice_${el}/${roomId}`)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Quantity"
                      {...register(`bardutyunQuantity_${el}/${roomId}`)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeBardutyunRow(el, roomId)}>
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
