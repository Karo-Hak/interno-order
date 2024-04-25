import React, { ChangeEvent, useEffect } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Data } from '../addTagStretchCeilingOrder/TagStretchOrder';

interface EditLightRingSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  lightRingRowId: string[];
  removeLightRingRowId: (rowId: string, roomId: string) => void;
  roomId: string;
  stretchLightRing: Array<Data>;
  lightRingId: Array<Data>;
}


const EditLightRingSection: React.FC<EditLightRingSectionProps> = ({
  register,
  setValue,
  getValues,
  lightRingRowId,
  removeLightRingRowId,
  roomId,
  stretchLightRing,
  lightRingId
}: EditLightRingSectionProps) => {

  useEffect(() => {
    lightRingRowId.forEach((rowId: string, index: number) => {
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
      if (lightRingId[index].sum) {
        setValue(`lightRingSum_${rowId}/${roomId}`, lightRingId[index].sum);
      } else {
        setValue(`lightRingSum_${rowId}/${roomId}`, +lightRingId[index].price * +lightRingId[index].quantity);
      }

    });
  }, [lightRingId]);


  const selectLightRingPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const lightRing = stretchLightRing.find((e: Data) => e._id === selectedId);

    if (lightRing) {
      setValue(`lightRingPrice_${rowKey}/${roomId}`, lightRing.price)
      setValue(`lightRingQuantity_${rowKey}/${roomId}`, "")
      lightRingSum(rowKey, lightRing.price, 0)
    } else {
      setValue(`lightRingPrice_${rowKey}/${roomId}`, 0)
    }
  };

  function lightRingSum(rowId: string, price: number, quantity: number): void {
    const totalPrice = price * quantity;
    console.log(totalPrice);
    
    if (totalPrice) {
      setValue(`lightRingSum_${rowId}/${roomId}`,  Math.ceil(totalPrice));
    } else {
      setValue(`lightRingSum_${rowId}/${roomId}`, 0)
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
                <th >Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {
                lightRingRowId.map((rowKey: string) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`lightRingId_${rowKey}/${roomId}`)}
                          onChange={(e) => selectLightRingPrice(e, rowKey, roomId)}>
                          <option>Ընտրել Տեսակը</option>
                          {
                            stretchLightRing && stretchLightRing.length > 0 ?
                              stretchLightRing.map((e: Data) => {
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
                          id={`lightRingPrice_${rowKey}/${roomId}`}
                          placeholder="Price"
                          {...register(`lightRingPrice_${rowKey}/${roomId}`)}
                          onChange={(e: { target: { value: string } }) =>
                            lightRingSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`lightRingQuantity_${rowKey}/${roomId}`)))}
                        />

                      </td>
                      <td>
                        <input
                          id={`lightRingQuantity_${rowKey}/${roomId}`}
                          placeholder="Quantity"
                          {...register(`lightRingQuantity_${rowKey}/${roomId}`)}
                          onChange={(e: { target: { value: string } }) =>
                            lightRingSum(rowKey, parseFloat(getValues(`lightRingPrice_${rowKey}/${roomId}`)), parseFloat(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          id={`lightRingSum_${rowKey}/${roomId}`}
                          placeholder="Sum"
                          {...register(`lightRingSum_${rowKey}/${roomId}`)} />
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
