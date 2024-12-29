import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Data } from './TagStretchOrder';

interface LightPlatformSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  lightPlatformRowId: Array<string>;
  removeLightPlatformRowId: (rowId: string, roomId: string) => void;
  roomId: string;
  stretchLightPlatform: Array<Data>;
}

const LightPlatformSection: React.FC<LightPlatformSectionProps> = ({
  register,
  setValue,
  getValues,
  lightPlatformRowId,
  removeLightPlatformRowId,
  roomId,
  stretchLightPlatform
}: LightPlatformSectionProps) => {

  const selectLightPlatformPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightPlatform = stretchLightPlatform.find((e: Data) => e._id === selectedId);

    if (lightPlatform) {
      setValue(`lightPlatformPrice_${rowKey}/${roomId}`, lightPlatform.price)
      setValue(`lightPlatformQuantity_${rowKey}/${roomId}`, "")
      lightPlatformSum(rowKey, lightPlatform.price, 0)
    } else {
      setValue(`lightPlatformPrice_${rowKey}/${roomId}`, 0)
    }
  };

  const lightPlatformSum = (rowId: string, price: number, quantity: number): void => {
    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`lightPlatformSum_${rowId}/${roomId}`, totalPrice);
    } else {
      setValue(`lightPlatformSum_${rowId}/${roomId}`, 0);
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
                  <th>Քանակ</th>
                  <th>Գին</th>
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
                            {...register(`lightPlatformId_${rowKey}/${roomId}`)}
                            onChange={(e) => selectLightPlatformPrice(e, rowKey, roomId)}>
                            <option>Ընտրել Տեսակը</option>
                            {
                              stretchLightPlatform.length > 0 ?
                                stretchLightPlatform.map((e: any) => {
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
                            id={`lightPlatformQuantity_${rowKey}/${roomId}`}
                            placeholder="Quantity"
                            {...register(`lightPlatformQuantity_${rowKey}/${roomId}`)}
                            onChange={(e: { target: { value: string } }) =>
                              lightPlatformSum(rowKey, parseFloat(getValues(`lightPlatformPrice_${rowKey}/${roomId}`)), parseFloat(e.target.value))}
                          />
                        </td>
                        <td>
                          <input
                            id={`lightPlatformPrice_${rowKey}/${roomId}`}
                            placeholder="Price"
                            {...register(`lightPlatformPrice_${rowKey}/${roomId}`)}
                            onChange={(e: { target: { value: string } }) =>
                              lightPlatformSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`lightPlatformQuantity_${rowKey}/${roomId}`)))}
                          />
                        </td>
                        <td>
                          <input
                            id={`lightPlatformSum_${rowKey}/${roomId}`}
                            placeholder="Sum"
                            {...register(`lightPlatformSum_${rowKey}/${roomId}`)} />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeLightPlatformRowId(rowKey, roomId)}>
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

export default LightPlatformSection;
