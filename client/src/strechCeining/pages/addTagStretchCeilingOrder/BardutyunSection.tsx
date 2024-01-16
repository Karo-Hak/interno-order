import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectStretchBardutyun } from "../../strechBardutyun/strechBardutyunSlice";
import { getAllStretchBardutyun } from "../../strechBardutyun/strechBardutyunApi";
import { useCookies } from 'react-cookie';

const BardutyunSection: React.FC<any> = ({ register }: any) => {
  const dispatch = useAppDispatch();

  const [cookies, setCookie] = useCookies(['access_token']);

  const [rowId, setRowId] = useState<number[]>([]);


  useEffect(() => {
    dispatch(getAllStretchBardutyun(cookies)).unwrap().then(res => {
      if ("error" in res) {
        alert(res)
      }
    })
  }, []);

  const stretchBardutyun = useAppSelector(selectStretchBardutyun);

  function addRow() {
    rowId.push(rowId.length + 1)
    setRowId([...rowId])
  }

  function removeRow(event: any) {
    rowId.splice(event, 1)
    setRowId([...rowId])
  }

  return (
    <div className="formdivStretch">
      Բարդություն
      {
        rowId.map((el: any, index: any) => {
          return (
            <div className="divStretchInput" key={Math.random()}>
              <select id="selectCoop" key={Math.random()} {...register("bardutyun_" + el)}>

                {
                  stretchBardutyun.arrStretchBardutyun && stretchBardutyun.arrStretchBardutyun.length > 0 ?
                    stretchBardutyun.arrStretchBardutyun.map((e: any) => {
                      return (
                        <option key={e._id} value={e._id}>{e.name}</option>
                      )
                    })
                    :
                    null
                }
              </select>
              <input id="quantity" key={Math.random()} type="number" className="inputNumber" placeholder="Quantity"  {...register("bardutyunQuantity_" + el)} />
              <button className='btn' type="button" onClick={(e) => removeRow(index)} >Հեռացնել</button>
            </div>
          )
        })
      }
      <button type="button" className='btn' onClick={addRow}>Ավելացնել տող</button>
    </div>
  );
};

export default BardutyunSection;
