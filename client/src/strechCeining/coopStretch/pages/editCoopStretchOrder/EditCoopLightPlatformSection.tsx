import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';
import { CoopLightPlatformProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';

interface EditCoopLightPlatformSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  lightPlatformRowId: Array<string>;
  removeLightPlatformRowId: (rowId: string, index: number) => void;
  stretchLightPlatform: Array<StretchLightPlatformProps>;
  orderLightPlatform: Array<CoopLightPlatformProps>
}

const EditCoopLightPlatformSection: React.FC<EditCoopLightPlatformSectionProps> = ({
  register,
  setValue,
  getValues,
  lightPlatformRowId,
  removeLightPlatformRowId,
  stretchLightPlatform,
  orderLightPlatform
}: EditCoopLightPlatformSectionProps) => {

  useEffect(() => {
    orderLightPlatform.forEach((el: CoopLightPlatformProps, index: number) => {
        setValue(`lightPlatformId_${lightPlatformRowId[index]}`, el.id)
        setValue(`lightPlatformPrice_${lightPlatformRowId[index]}`, el.price)
        setValue(`lightPlatformQuantity_${lightPlatformRowId[index]}`, el.quantity)
        setValue(`lightPlatformSum_${lightPlatformRowId[index]}`, el.sum)
    })

}, [orderLightPlatform, lightPlatformRowId])

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
                      <tr key={rowKey}>
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
                            onClick={() => removeLightPlatformRowId(rowKey, index)}>
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

export default EditCoopLightPlatformSection;
