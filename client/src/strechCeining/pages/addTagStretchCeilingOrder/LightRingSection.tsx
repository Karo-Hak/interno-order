import React, { ChangeEvent } from 'react';


const LightRingSection: React.FC<any> = ({ register, lightRingRowId, removeLightRingRowId, setValue, roomId, stretchLightRing }: any) => {


  const selectLightRingPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightRing = stretchLightRing.find((e: any) => e._id === selectedId);

    if (lightRing) {
      setValue(`lightRingPrice_${rowKey}/${roomId}`, lightRing.price)
    } else {
      setValue(`lightRingPrice_${rowKey}/${roomId}`, 0)
    }
  };

  return (<>
    {
      lightRingRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection"  >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th>Լույսի Օղակ</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {
                lightRingRowId.map((rowKey: any) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`lightRingId_${rowKey}/${roomId}`)}
                          onChange={(e) => selectLightRingPrice(e, rowKey, roomId)}>
                          <option>Ընտրել Տեսակը</option>
                          {
                            stretchLightRing.length > 0 ?
                              stretchLightRing.map((e: any) => {
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
                          id="price"
                          type="number"
                          placeholder="Price"
                          {...register(`lightRingPrice_${rowKey}/${roomId}`)} />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Quantity"
                          {...register(`lightRingQuantity_${rowKey}/${roomId}`)} />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeLightRingRowId(rowKey, roomId)}
                        >
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
  </>);
};

export default LightRingSection;
