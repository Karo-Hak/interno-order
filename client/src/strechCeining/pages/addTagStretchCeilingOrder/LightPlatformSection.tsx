import React, { ChangeEvent } from 'react';

const LightPlatformSection: React.FC<any> = ({ register, lightPlatformRowId, removeLightPlatformRowId, setValue, roomId, stretchLightPlatform }: any) => {

  const selectLightPlatformPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightPlatform = stretchLightPlatform.find((e: any) => e._id === selectedId);

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

export default LightPlatformSection;
