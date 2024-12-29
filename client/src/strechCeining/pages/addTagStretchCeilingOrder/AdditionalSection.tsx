import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';


interface AdditionalSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>
  additionalRowId: Array<string>
  removeAdditionalRow: (rowId: string, roomId: string) => void
  roomId: string;
  stretchAdditional: Array<{ _id: string; name: string; price: number; quantity: number, sum: number }>;
}

const AdditionalSection: React.FC<AdditionalSectionProps> = ({
  register,
  setValue,
  getValues,
  additionalRowId,
  removeAdditionalRow,
  roomId,
  stretchAdditional
}: AdditionalSectionProps) => {


  const selectAdditionalPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const additional = stretchAdditional.find((e: { _id: string }) => e._id === selectedId);

    if (additional) {
      setValue(`additionalPrice_${rowKey}/${roomId}`, additional.price)
      setValue(`additionalQuantity_${rowKey}/${roomId}`, "")
      additionalSum(rowKey, additional.price, 0)
    } else {
      setValue(`additionalPrice_${rowKey}/${roomId}`, 0);
    }
  };

  const additionalSum = (rowId: string, price: number, quantity: number): void => {

    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`additionalSum_${rowId}/${roomId}`, totalPrice);
    } else {
      setValue(`additionalSum_${rowId}/${roomId}`, 0);
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
                <th>Քանակ</th>
                <th>Գին</th>
                <th>Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                additionalRowId.map((rowId: string) => (
                  <tr key={rowId}>
                    <td style={{ minWidth: "250px", }}>
                      <select
                        {...register(`additionalId_${rowId}/${roomId}`)}
                        onChange={(e) => selectAdditionalPrice(e, rowId, roomId)}
                      >
                        <option>Ընտրել Տեսակը</option>
                        {stretchAdditional && stretchAdditional.length > 0 ?
                          stretchAdditional.map((e: { _id: string, name: string }) => (
                            <option key={e._id} value={e._id} >
                              {e.name}
                            </option>
                          ))
                          : null}
                      </select>
                    </td>
                    <td>
                      <input
                        id={`additionalQuantity_${rowId}/${roomId}`}
                        placeholder="Quantity"
                        {...register(`additionalQuantity_${rowId}/${roomId}`)}
                        onChange={(e: { target: { value: string } }) =>
                          additionalSum(rowId, parseFloat(getValues(`additionalPrice_${rowId}/${roomId}`)), parseFloat(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        placeholder="Price"
                        id={`additionalPrice_${rowId}/${roomId}`}
                        {...register(`additionalPrice_${rowId}/${roomId}`)}
                        onChange={(e: { target: { value: string } }) =>
                          additionalSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`additionalQuantity_${rowId}/${roomId}`)))}
                      />
                    </td>
                    <td>
                      <input
                        id={`additionalSum_${rowId}/${roomId}`}
                        placeholder="Sum"
                        {...register(`additionalSum_${rowId}/${roomId}`)}
                      />
                    </td>
                    <td>
                      <button
                        type="button" onClick={() => removeAdditionalRow(rowId, roomId)}>
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

export default AdditionalSection;
