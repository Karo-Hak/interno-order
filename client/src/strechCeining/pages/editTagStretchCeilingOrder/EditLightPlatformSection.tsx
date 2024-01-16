import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { selectStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformSlice';
import { getAllStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformApi';

const LightPlatformSection: React.FC<any> = ({ register, reset, setValue, editingLightPlatforms }: any) => {

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
    setRowId(prevRowId => [...prevRowId, prevRowId.length + 1]);
  }

  useEffect(() => {
    if (editingLightPlatforms) {
      const newRows = Object.values(editingLightPlatforms).map((el: any, index: number) => {
        const rowKey = index + 1;
        setValue(`lightPlatform_${rowKey}`, el.lightPlatform);
        setValue(`lightPlatformQuantity_${rowKey}`, el.lightPlatformQuantity);
        return rowKey;
      });
      setRowId(newRows);

    }
  }, [editingLightPlatforms, setValue]);

  function removeRow(index: number, event: any, el: any): void {
    reset({ [`additional_${el}`]: event.target.value })
    setRowId(prevRowId => prevRowId.filter((_, i) => i !== index));
  }


  return (
    <div className="formdivStretch">
      Լույսի Պլատֆորմ
      {
        rowId.map((el: any, index: any) => {
          return (
            <div className="divStretchInput" key={Math.random()}>
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
              <input id="quantity" key={Math.random()} type="number" className="inputNumber" placeholder="Quantity"  {...register("lightPlatformQuantity_" + el)} />
              <button className='btn' type="button" onClick={(e) => removeRow(index, e, el)} >Հեռացնել</button>
            </div>
          )
        })
      }
      <button type="button" className='btn' onClick={addRow}>Ավելացնել տող</button>
    </div>
  );
};

export default LightPlatformSection;
