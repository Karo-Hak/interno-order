import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditStretchProfilsSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  workRowId: string[];
  removeWorkRow: (rowId: any) => void
  stretchWork: { arrStretchWork: Array<any> };
  workId: Array<{ work: string; workPrice: number; workQuantity: number }>;
}


const EditWorkSection: React.FC<EditStretchProfilsSectionProps> = ({
  register,
  setValue,
  workRowId,
  removeWorkRow,
  stretchWork,
  workId
}: EditStretchProfilsSectionProps) => {


  useEffect(() => {
    console.log(workId);
    
    workRowId.forEach((rowId: any, index: number) => {
      setValue(`work_${rowId}`, workId[index].work);
      if (workId[index].workPrice) {
        setValue(`workPrice_${rowId}`, workId[index].workPrice);
      } else {
        setValue(`workPrice_${rowId}`, 0);
      }
      if (workId[index].workQuantity) {
        setValue(`workQuantity_${rowId}`, workId[index].workQuantity);
      } else {
        setValue(`workQuantity_${rowId}`, 0);
      }

    });
  }, [workId]);


  const selectWorkPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const work = stretchWork.arrStretchWork.find((e: any) => e._id === selectedId);

    if (work) {
      setValue(`workPrice_${rowKey}`, work.workPrice)
    } else {
      setValue(`workPrice_${rowKey}`, 0)
    }
  };


  return (<div style={{ marginLeft: "5px", width: "100%" }}>
    {
      workRowId.length > 0 ?
        <div>
          <table className="table tableSection">
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th>Աշխատանք</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                workRowId.map((rowKey: any, index: any) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`work_${rowKey}`, { required: true })}
                          onChange={(e) => selectWorkPrice(e, rowKey)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchWork.arrStretchWork && stretchWork.arrStretchWork.length > 0 ?
                            stretchWork.arrStretchWork.map((e: any) => (
                              <option key={e._id} value={e._id} >
                                {e.workName}
                              </option>
                            ))
                            : null}
                        </select>

                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Price"
                          {...register(`workPrice_${rowKey}`)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Quantity"
                          {...register(`workQuantity_${rowKey}`)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeWorkRow(rowKey)}
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
  </div>
  );
};

export default EditWorkSection;
