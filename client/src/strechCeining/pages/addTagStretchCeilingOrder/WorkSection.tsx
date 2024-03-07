import React, { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import './tagStretchOrder.css'
import { allStretchWork } from '../../StrechWork/strechWorkApi';
import { selectStretchWork } from '../../StrechWork/strechWorkSlice';

const WorkSection: React.FC<any> = ({ register, setValue, workRowId, removeWorkRow }: any) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);


  useEffect(() => {
    dispatch(allStretchWork(cookies)).unwrap().then(res => {
      if ("error" in res) {
        // setCookie("access_token", '', { path: '/' })
        // navigate("/")
        alert(res)
      }
    })
  }, []);

  const stretchWork = useAppSelector(selectStretchWork)



  const selectWorkPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const work = stretchWork.arrStretchWork.find((e: any) => e._id === selectedId);

    if (work) {
      setValue(`workName_${rowKey}`, work.workName,);
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
                    <tr key={index}>
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

export default WorkSection;
