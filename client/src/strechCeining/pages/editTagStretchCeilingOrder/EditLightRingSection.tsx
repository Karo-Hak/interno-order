import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { selectStretchLightRing } from '../../strechLightRing/strechLightRingSlice';
import { getAllStretchLightRing } from '../../strechLightRing/strechLightRingApi';

const LightRingSection: React.FC<any> = ({ register, reset, setValue, editingLightRings }: any) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const [rowId, setRowId] = useState<number[]>([]);


  useEffect(() => {
    dispatch(getAllStretchLightRing(cookies)).unwrap().then(res => {
      if ("error" in res) {
        // setCookie("access_token", '', { path: '/' })
        // navigate("/")
        alert(res)
      }
    })

  }, []);

  const stretchLightRing = useAppSelector(selectStretchLightRing)

  function addRow() {
    setRowId(prevRowId => [...prevRowId, prevRowId.length + 1]);
  }
  useEffect(() => {
    if (editingLightRings) {
      const newRows = Object.values(editingLightRings).map((el: any, index: number) => {
        const rowKey = index + 1;
        setValue(`lightRing_${rowKey}`, el.lightRing);
        setValue(`lightRingQuantity_${rowKey}`, el.lightRingQuantity);
        return rowKey;
      });
      setRowId(newRows);

    }
  }, [editingLightRings, setValue]);

  function removeRow(index: number, event: any, el: any): void {
    reset({ [`additional_${el}`]: event.target.value })
    setRowId(prevRowId => prevRowId.filter((_, i) => i !== index));
  }
  return (
    <div className="formdivStretch">
      Լույսի Օղակ
      {
        rowId.map((el: any, index: any) => {
          return (
            <div className="divStretchInput" key={Math.random()}>
              <select id="selectCoop" key={Math.random()} {...register("lightRing_" + el)}>

                {
                  stretchLightRing.arrStretchLightRing && stretchLightRing.arrStretchLightRing.length > 0 ?
                  stretchLightRing.arrStretchLightRing.map((e: any) => {
                      return (
                        <option key={e._id} value={e._id}>{e.name}</option>
                      )
                    })
                    :
                    null
                }
              </select>
              <input id="quantity" key={Math.random()} type="number" className="inputNumber" placeholder="Quantity"  {...register("lightRingQuantity_" + el)} />
              <button className='btn' type="button" onClick={(e) => removeRow(index, e, el)} >Հեռացնել</button>
            </div>
          )
        })
      }
      <button type="button" className='btn' onClick={addRow}>Ավելացնել տող</button>
    </div>
  );
};

export default LightRingSection;
