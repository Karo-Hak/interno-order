import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditLightRingSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  lightRingRowId: string[];
  removeLightRingRowId: (rowId: string, roomId: string) => void
  roomId: string;
  stretchLightRing: { arrStretchLightRing: Array<any> };
  lightRingId: Array<{ id: string; price: number; quantity: number }>;
}


const EditLightRingSection: React.FC<EditLightRingSectionProps> = ({
  register,
  setValue,
  lightRingRowId,
  removeLightRingRowId,
  roomId,
  stretchLightRing, 
  lightRingId
}: EditLightRingSectionProps) => {

  useEffect(() => {
    lightRingRowId.forEach((rowId: any, index: number) => {
      setValue(`lightRingId_${rowId}/${roomId}`, lightRingId[index].id);
      if (lightRingId[index].price) {
        setValue(`lightRingPrice_${rowId}/${roomId}`, lightRingId[index].price);
      } else {
        setValue(`lightRingPrice_${rowId}/${roomId}`, 0);
      }
      if (lightRingId[index].quantity) {
        setValue(`lightRingQuantity_${rowId}/${roomId}`, lightRingId[index].quantity);
      } else {
        setValue(`lightRingQuantity_${rowId}/${roomId}`, 0);
      }

    });
  }, [lightRingId]);

  const selectLightRingPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightRing = stretchLightRing.arrStretchLightRing.find((e: any) => e._id === selectedId);

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
                            stretchLightRing.arrStretchLightRing && stretchLightRing.arrStretchLightRing.length > 0 ?
                              stretchLightRing.arrStretchLightRing.map((e: any) => {
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

export default EditLightRingSection;
