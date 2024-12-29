import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import './tagStretchOrder.css'
import { allStretchWork } from '../../features/StrechWork/strechWorkApi';
import { useNavigate } from 'react-router-dom';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Data } from './TagStretchOrder';

interface WorkSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  workRowId: Array<string>;
  removeWorkRow: (rowId: string) => void;
}

const WorkSection: React.FC<WorkSectionProps> = ({
  register,
  setValue,
  getValues,
  workRowId,
  removeWorkRow,
}: WorkSectionProps) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();


  const [stretchWork, setStretchWork] = useState<Array<Data>>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const stretchOrderResult = await dispatch(allStretchWork(cookies)).unwrap();
        handleResult(stretchOrderResult);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    const handleResult = (result: any) => {
      if ("error" in result) {
        alert(result);
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      } else {
        processResult(result);
      }
    };

    const processResult = (result: any) => {
      if (result) {
        setStretchWork(result.work)
      }
    };

    fetchData();
  }, []);



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

  const workSum = (rowKey: string, quantity: number, price: number): void => {
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
                <th>Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                workRowId.map((rowKey: string, index: number) => {
                  return (
                    <tr key={index}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`workId_${rowKey}`, { required: true })}
                          onChange={(e) => selectWorkPrice(e, rowKey)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchWork ? (stretchWork.length > 0 ? (
                            stretchWork.map((e: Data) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
                              </option>
                            ))
                          ) : null
                          ) : (
                            <p>Loading...</p>)}
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

export default WorkSection;
