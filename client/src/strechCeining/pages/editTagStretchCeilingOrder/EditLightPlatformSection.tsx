import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';


interface EditLightPlatformSectionProps {

  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  lightPlatformRowId: string[]; 
  removeLightPlatformRowId: (rowId: string, roomId: string) => void 
  roomId: string;
  stretchLightPlatform: { arrStretchLightPlatform: Array<any> }; 
  lightPlatformId: Array<{ id: string; price: number; quantity: number }>;
}

const EditLightPlatformSection: React.FC<EditLightPlatformSectionProps> = ({
  register,
  setValue,
  lightPlatformRowId,
  removeLightPlatformRowId,
  roomId,
  stretchLightPlatform,
  lightPlatformId
}: EditLightPlatformSectionProps) => {

  useEffect(() => {
    lightPlatformRowId.forEach((rowId: any, index: number) => {
        setValue(`lightPlatformId_${rowId}/${roomId}`, lightPlatformId[index].id);
        if (lightPlatformId[index].price) {
            setValue(`lightPlatformPrice_${rowId}/${roomId}`, lightPlatformId[index].price);
        } else {
            setValue(`lightPlatformPrice_${rowId}/${roomId}`, 0);
        }
        if (lightPlatformId[index].quantity) {
            setValue(`lightPlatformQuantity_${rowId}/${roomId}`, lightPlatformId[index].quantity);
        } else {
            setValue(`lightPlatformQuantity_${rowId}/${roomId}`, 0);
        }

    });
}, [lightPlatformId]);

  const selectLightPlatformPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightPlatform = stretchLightPlatform.arrStretchLightPlatform.find((e: any) => e._id === selectedId);

    if (lightPlatform) {
      setValue(`lightPlatformPrice_${rowKey}/${roomId}`, lightPlatform.price)
    } else {
      setValue(`lightPlatformPrice_${rowKey}/${roomId}`, 0)
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
                  <th>Հեռացնել</th>
                </tr>
              </thead>
              <tbody >
                {
                  lightPlatformRowId.map((rowKey: any, index: any) => {
                    return (
                      <tr key={index}>
                        <td style={{ minWidth: "250px", }}>
                          <select
                            {...register(`lightPlatformId_${rowKey}/${roomId}`)}
                            onChange={(e) => selectLightPlatformPrice(e, rowKey, roomId)}>
                            <option>Ընտրել Տեսակը</option>
                            {
                              stretchLightPlatform.arrStretchLightPlatform && stretchLightPlatform.arrStretchLightPlatform.length > 0 ?
                                stretchLightPlatform.arrStretchLightPlatform.map((e: any) => {
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
                            type="number"
                            placeholder="Price"
                            {...register(`lightPlatformPrice_${rowKey}/${roomId}`)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="Quantity"
                            {...register(`lightPlatformQuantity_${rowKey}/${roomId}`)} />
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

export default EditLightPlatformSection;
