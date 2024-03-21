import { useEffect } from "react";

const OtherSection: React.FC<any> = ({ register, otherRowId, removeOtherRow, roomId, setValue }: any) => {


  useEffect(() => {
    otherRowId.forEach((rowKey: any) => {
      setValue(`otherType_${rowKey}/${roomId}`, "other")
    });

  }, [otherRowId])

  return (<>
    {
      otherRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection">
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

export default OtherSection;
