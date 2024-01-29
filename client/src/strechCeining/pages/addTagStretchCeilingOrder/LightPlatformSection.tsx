import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { selectStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformSlice';
import { getAllStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformApi';

const LightPlatformSection: React.FC<any> = ({ register }: any) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const [rowId, setRowId] = useState<number[]>([]);


  useEffect(() => {
    dispatch(getAllStretchLightPlatform(cookies)).unwrap().then(res => {
      if ("error" in res) {
        // setCookie("access_token", '', { path: '/' })
        // navigate("/")
        alert(res)
      }
    })
  }, []);

  const stretchLightPlatform = useAppSelector(selectStretchLightPlatform)

  function addRow() {
    rowId.push(rowId.length + 1)
    setRowId([...rowId])
  }

  function removeRow(event: any) {
    rowId.splice(event, 1)
    console.log(rowId);
    setRowId([...rowId])
  }

  return (
    <div className="dzgvox_arastax_material">
      {
        rowId.map((el: any, index: any) => {
          return (
            <div className="divStretchInput1" key={Math.random()}>
              <select id="selectCoop" key={Math.random()} {...register("lightPlatform_" + el)}>

                {
                  stretchLightPlatform.arrStretchLightPlatform && stretchLightPlatform.arrStretchLightPlatform.length > 0 ?
                    stretchLightPlatform.arrStretchLightPlatform.map((e: any) => {
                      return (
                        <option key={e._id} value={e._id} >{e.name}</option>
                      )
                    })
                    :
                    null
                }
              </select>
              <input id="quantity" key={Math.random()} type="number" className="dzgvox_arastax_quantity" placeholder="Quantity"  {...register("lightPlatformQuantity_" + el)} />
              <button className='btn btn1' type="button" onClick={(e) => removeRow(index)} >Հեռացնել</button>
            </div>
          )
        })
      }
      <button type="button" className='btn btn1' onClick={addRow}>Լույսի Պլատֆորմ</button>
    </div>
  );
};

export default LightPlatformSection;
