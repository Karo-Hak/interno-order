import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import './tagStretchOrder.css'
import { allStretchWork } from '../../features/StrechWork/strechWorkApi';
import { useNavigate } from 'react-router-dom';

const WorkSection: React.FC<any> = ({ register, setValue, workRowId, removeWorkRow }: any) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();


  const [stretchWork, setStretchWork] = useState<any>()


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
    const work = stretchWork.find((e: any) => e._id === selectedId);

    if (work) {
      setValue(`workPrice_${rowKey}`, work.price)
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
                    <tr key={index}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`workId_${rowKey}`, { required: true })}
                          onChange={(e) => selectWorkPrice(e, rowKey)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchWork.length > 0 ?
                            stretchWork.map((e: any) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
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

export default WorkSection;
