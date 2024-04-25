import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';

interface CoopLightPlatformSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  lightPlatformRowId: Array<string>;
  removeLightPlatformRowId: (rowId: string) => void;
  stretchLightPlatform: Array<StretchLightPlatformProps>;
}

const CoopLightPlatformSection: React.FC<CoopLightPlatformSectionProps> = ({
  register,
  setValue,
  getValues,
  lightPlatformRowId,
  removeLightPlatformRowId,

  stretchLightPlatform
}:CoopLightPlatformSectionProps) => {

  const selectLightPlatformPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const lightPlatform = stretchLightPlatform.find((e: StretchLightPlatformProps) => e._id === selectedId);

    if (lightPlatform) {
      setValue(`lightPlatformPrice_${rowKey}`, lightPlatform.coopPrice)
      setValue(`lightPlatformQuantity_${rowKey}`, "")
      lightPlatformSum(rowKey, lightPlatform.price, 0)
    } else {
      setValue(`lightPlatformPrice_${rowKey}`, 0)
    }
  };

  const lightPlatformSum = (rowId: string, price: number, quantity: number): void => {
    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`lightPlatformSum_${rowId}`, totalPrice);
    } else {
      setValue(`lightPlatformSum_${rowId}`, 0);
    }
  };

  return (
    <>
      {
        lightPlatformRowId.length > 0 ?
          <div style={{ marginLeft: "5px", width: "100%" }}>
            <table className="table tableSection" >
              <thead>
                <tr
                  style={{ background: "#dfdce0" }}>
                  <th>Լույսի Պլատֆորմ</th>
                  <th>Գին</th>
                  <th>Քանակ</th>
                  <th>Գումար</th>
                  <th>Հեռացնել</th>
                </tr>
              </thead>
              <tbody >
                {
                  lightPlatformRowId.map((rowKey: string, index: number) => {
                    return (
                      <tr key={index}>
                        <td style={{ minWidth: "250px", }}>
                          <select
                            {...register(`lightPlatformId_${rowKey}`)}
                            onChange={(e) => selectLightPlatformPrice(e, rowKey)}>
                            <option>Ընտրել Տեսակը</option>
                            {
                              stretchLightPlatform.length > 0 ?
                                stretchLightPlatform.map((e: StretchLightPlatformProps) => {
                                  return (
                                    <option key={e._id} value={e._id} >{e.name}</option>
                                  )
                                })
                                :
                                null
                            }
                          </select>
                        </td>
                        <td>
                          <input
                            id={`lightPlatformPrice_${rowKey}`}
                            placeholder="Price"
                            {...register(`lightPlatformPrice_${rowKey}`)}
                            onChange={(e: { target: { value: string } }) =>
                              lightPlatformSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`lightPlatformQuantity_${rowKey}`)))}
                          />
                        </td>
                        <td>
                          <input
                            id={`lightPlatformQuantity_${rowKey}`}
                            placeholder="Quantity"
                            {...register(`lightPlatformQuantity_${rowKey}`)}
                            onChange={(e: { target: { value: string } }) =>
                              lightPlatformSum(rowKey, parseFloat(getValues(`lightPlatformPrice_${rowKey}`)), parseFloat(e.target.value))}
                          />
                        </td>
                        <td>
                          <input
                            id={`lightPlatformSum_${rowKey}`}
                            placeholder="Sum"
                            {...register(`lightPlatformSum_${rowKey}`)} />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeLightPlatformRowId(rowKey)}>
                            Հեռացնել
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          : null
      }
    </>
  );
};

export default CoopLightPlatformSection;
