import React, { ChangeEvent, useEffect } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Data } from '../addTagStretchCeilingOrder/TagStretchOrder';

interface EditStretchProfilsSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  workRowId: string[];
  removeWorkRow: (rowId: any) => void;
  stretchWork: Array<Data>;
  workId: Array<Data>;
}


const EditWorkSection: React.FC<EditStretchProfilsSectionProps> = ({
  register,
  setValue,
  getValues,
  workRowId,
  removeWorkRow,
  stretchWork,
  workId
}: EditStretchProfilsSectionProps) => {


  useEffect(() => {
    workRowId.forEach((rowId: string, index: number) => {
      setValue(`workId_${rowId}`, workId[index].id);
      setValue(`workName_${rowId}`, workId[index].name,);
      if (workId[index].price) {
        setValue(`workPrice_${rowId}`, workId[index].price);
      } else {
        setValue(`workPrice_${rowId}`, 0);
      }
      if (workId[index].quantity) {
        setValue(`workQuantity_${rowId}`, workId[index].quantity);
      } else {
        setValue(`workQuantity_${rowId}`, 0);
      }
      if (workId[index].sum) {
        setValue(`workSum_${rowId}`, workId[index].sum);
      } else {
        setValue(`workSum_${rowId}`, workId[index].price * workId[index].quantity);
      }

    });
  }, [workId]);


  const selectWorkPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const work = stretchWork.find((e: Data) => e._id === selectedId);
    if (work) {
      setValue(`workPrice_${rowKey}`, work.price)
      setValue(`workQuantity_${rowKey}`, "")
      workSum(rowKey, 0, work.price)
    } else {
      setValue(`workPrice_${rowKey}`, "")
    }
  };

  const workSum = (rowKey: any, quantity: number, price: number): void => {
    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`workSum_${rowKey}`, totalPrice);
    } else {
      setValue(`workSum_${rowKey}`, 0);
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
                <th>Քանակ</th>
                <th>Գին</th>
                <th >Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                workRowId.map((rowKey: string) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`workId_${rowKey}`, { required: true })}
                          onChange={(e) => selectWorkPrice(e, rowKey)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchWork && stretchWork.length > 0 ?
                            stretchWork.map((e: Data) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
                              </option>
                            ))
                            : null}
                        </select>

                      </td>
                      <td>
                        <input
                          id={`workQuantity_${rowKey}`}
                          placeholder="Quantity"
                          {...register(`workQuantity_${rowKey}`)}
                          onChange={(e) => workSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`workPrice_${rowKey}`)))}
                        />
                      </td>
                      <td>
                        <input
                          id={`workPrice_${rowKey}`}
                          placeholder="Price"
                          {...register(`workPrice_${rowKey}`)}
                          onChange={(e) => workSum(rowKey, parseFloat(getValues(`workQuantity_${rowKey}`)), parseFloat(e.target.value))}

                        />
                      </td>
                      <td>
                        <input
                          id={`workSum_${rowKey}`}
                          placeholder="Sum"
                          {...register(`workSum_${rowKey}`)}
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
