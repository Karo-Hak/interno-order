import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from "react-hook-form";


interface AdditionalSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  otherRowId: Array<string>;
  removeOtherRow: (rowId: string, roomId: string) => void;
  roomId: string;
}

const OtherSection: React.FC<AdditionalSectionProps> = ({
  register,
  setValue,
  getValues,
  otherRowId,
  removeOtherRow,
  roomId,
}: AdditionalSectionProps) => {


  useEffect(() => {
    otherRowId.forEach((rowKey: string) => {
      setValue(`otherType_${rowKey}/${roomId}`, "Այլ")
    });

  }, [otherRowId])

  const otherSum = (rowId: string, price: number, quantity: number): void => {
    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`otherSum_${rowId}/${roomId}`, totalPrice);
    } else {
      setValue(`otherSum_${rowId}/${roomId}`, 0);
    }
  };

  return (<>
    {
      otherRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection">
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th style={{ width: "300px" }}>Լրացուցիչ</th>
                <th>Քանակ</th>
                <th>Գին</th>
                <th>Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                otherRowId.map((rowId: string) => (
                  <tr key={rowId}>
                    <td style={{ minWidth: "250px", }}>
                      <input
                        type="text"
                        placeholder="Name"
                        {...register(`otherName_${rowId}/${roomId}`)}

                      />
                    </td>
                    <td>
                      <input
                        id={`otherQuantity_${rowId}/${roomId}`}
                        placeholder="Quantity"
                        {...register(`otherQuantity_${rowId}/${roomId}`)}
                        onChange={(e: { target: { value: string } }) =>
                          otherSum(rowId, parseFloat(getValues(`otherPrice_${rowId}/${roomId}`)), parseFloat(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        id={`otherPrice_${rowId}/${roomId}`}
                        placeholder="Price"
                        {...register(`otherPrice_${rowId}/${roomId}`)}
                        onChange={(e: { target: { value: string } }) =>
                          otherSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`otherQuantity_${rowId}/${roomId}`)))}
                      />
                    </td>
                    <td>
                      <input
                        id={`otherSum_${rowId}/${roomId}`}
                        placeholder="Sum"
                        {...register(`otherSum_${rowId}/${roomId}`)}
                      />
                    </td>
                    <td>
                      <button
                        type="button" onClick={() => removeOtherRow(rowId, roomId)}>
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

export default OtherSection;
