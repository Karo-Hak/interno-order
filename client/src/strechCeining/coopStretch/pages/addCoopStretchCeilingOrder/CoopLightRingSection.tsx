import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { StretchLightRingProps } from '../../../features/strechLightRing/strechLightRingSlice';


interface CoopLightRingSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  lightRingRowId: Array<string>;
  removeLightRingRowId: (rowId: string) => void;
  stretchLightRing: Array<StretchLightRingProps>;
}

const CoopLightRingSection: React.FC<CoopLightRingSectionProps> = ({
  register,
  setValue,
  getValues,
  lightRingRowId,
  removeLightRingRowId,
  stretchLightRing }: CoopLightRingSectionProps) => {


  const selectLightRingPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const lightRing = stretchLightRing.find((e: StretchLightRingProps) => e._id === selectedId);

    if (lightRing) {
      setValue(`lightRingPrice_${rowKey}`, lightRing.coopPrice)
      setValue(`lightRingQuantity_${rowKey}`, "")
      lightRingSum(rowKey, lightRing.price, 0)
    } else {
      setValue(`lightRingPrice_${rowKey}`, 0)
    }
  };

  function lightRingSum(rowId: string, price: number, quantity: number): void {
    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`lightRingSum_${rowId}`, totalPrice);
    } else {
      setValue(`lightRingSum_${rowId}`, 0)
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
                <th>Գումար</th>
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
                          {...register(`lightRingId_${rowKey}`)}
                          onChange={(e) => selectLightRingPrice(e, rowKey)}>
                          <option>Ընտրել Տեսակը</option>
                          {
                            stretchLightRing.length > 0 ?
                              stretchLightRing.map((e: StretchLightRingProps) => {
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
                          id={`lightRingPrice_${rowKey}`}
                          placeholder="Price"
                          {...register(`lightRingPrice_${rowKey}`)}
                          onChange={(e: { target: { value: string } }) =>
                            lightRingSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`lightRingQuantity_${rowKey}`)))}
                        />

                      </td>
                      <td>
                        <input
                          id={`lightRingQuantity_${rowKey}`}
                          placeholder="Quantity"
                          {...register(`lightRingQuantity_${rowKey}`)}
                          onChange={(e: { target: { value: string } }) =>
                            lightRingSum(rowKey, parseFloat(getValues(`lightRingPrice_${rowKey}`)), parseFloat(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          id={`lightRingSum_${rowKey}`}
                          placeholder="Sum"
                          {...register(`lightRingSum_${rowKey}`)} />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeLightRingRowId(rowKey)}
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

export default CoopLightRingSection;
