import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditAdditionalSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  additionalRowId: string[]; 
  removeAdditionalRow: (rowId: any, roomId: string) => void 
  roomId: string;
  stretchAdditional: { arrStretchAdditional: Array<any> }; 
  additionalId: Array<{ additional: string; additionalPrice: number; additionalQuantity: number }>;
}


const EditAdditionalSection: React.FC<EditAdditionalSectionProps> = ({
  register,
  setValue,
  additionalRowId,
  removeAdditionalRow,
  roomId,
  stretchAdditional,
  additionalId

}: EditAdditionalSectionProps) => {

  useEffect(() => {
    additionalRowId.forEach((rowId: any, index: number) => {
        setValue(`additional_${rowId}/${roomId}`, additionalId[index].additional);
        if (additionalId[index].additionalPrice) {
            setValue(`additionalPrice_${rowId}/${roomId}`, additionalId[index].additionalPrice);
        } else {
            setValue(`stretchPrice_${rowId}/${roomId}`, 0);
        }
        if (additionalId[index].additionalQuantity) {
            setValue(`additionalQuantity_${rowId}/${roomId}`, additionalId[index].additionalQuantity);
        } else {
            setValue(`additionalQuantity_${rowId}/${roomId}`, 0);
        }

    });
}, [additionalId]);

  const selectAdditionalPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const additional = stretchAdditional.arrStretchAdditional.find((e: any) => e._id === selectedId);

    if (additional) {
      setValue(`additionalPrice_${rowKey}/${roomId}`, additional.price)
    } else {
      setValue(`additionalPrice_${rowKey}/${roomId}`, 0);
    }
  };

  return (<>
    {
      additionalRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection"  >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th style={{ width: "300px" }}>Այլ Ապրանք</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                additionalRowId.map((el: any) => (
                  <tr key={el}>
                    <td style={{ minWidth: "250px", }}>
                      <select
                        {...register(`additional_${el}` + "/" + roomId)}
                        onChange={(e) => selectAdditionalPrice(e, el, roomId)}
                      >
                        <option>Ընտրել Տեսակը</option>
                        {stretchAdditional.arrStretchAdditional && stretchAdditional.arrStretchAdditional.length > 0 ?
                          stretchAdditional.arrStretchAdditional.map((e: any) => (
                            <option key={e._id} value={e._id} >
                              {e.name}
                            </option>
                          ))
                          : null}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Price"
                        {...register(`additionalPrice_${el}` + "/" + roomId)}

                      />
                    </td>
                    <td>
                      <input
                        id={`quantity_${el}`}
                        type="number"
                        placeholder="Quantity"
                        {...register(`additionalQuantity_${el}` + "/" + roomId)}
                      />
                    </td>
                    <td>
                      <button
                        type="button" onClick={() => removeAdditionalRow(el, roomId)}>
                        Հեռացնել
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        : null
    }
  </>);
};

export default EditAdditionalSection;
