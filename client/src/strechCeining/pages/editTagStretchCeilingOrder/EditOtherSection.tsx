import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface EditOtherSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  otherRowId: string[];
  removeOtherRow: (rowId: any, roomId: string) => void
  roomId: string;
  otherId: Array<{ otherName: string; otherPrice: number; otherQuantity: number }>;
}

const EditOtherSection: React.FC<EditOtherSectionProps> = ({
  register,
  setValue,
  otherRowId,
  removeOtherRow,
  roomId,
  otherId
}: EditOtherSectionProps) => {


  useEffect(() => {
    otherRowId.forEach((rowId: any, index: number) => {
      setValue(`otherName_${rowId}/${roomId}`, otherId[index].otherName);
      if (otherId[index].otherPrice) {
        setValue(`otherPrice_${rowId}/${roomId}`, otherId[index].otherPrice);
      } else {
        setValue(`otherPrice_${rowId}/${roomId}`, 0);
      }
      if (otherId[index].otherQuantity) {
        setValue(`otherQuantity_${rowId}/${roomId}`, otherId[index].otherQuantity);
      } else {
        setValue(`otherQuantity_${rowId}/${roomId}`, 0);
      }

    });
  }, [otherId]);


  return (<>
    {
      otherRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection"  >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th style={{ width: "300px" }}>Լրացուցիչ</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                otherRowId.map((rowId: any) => (
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
                        type="number"
                        placeholder="Price"
                        {...register(`otherPrice_${rowId}/${roomId}`)}

                      />
                    </td>
                    <td>
                      <input
                        id={`quantity_${rowId}`}
                        type="number"
                        placeholder="Quantity"
                        {...register(`otherQuantity_${rowId}/${roomId}`)}
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

export default EditOtherSection;
