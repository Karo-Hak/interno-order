import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { selectStretchProfil } from '../../strechProfil/strechProfilSlice';
import { getAllStretchProfil } from '../../strechProfil/strechProfilApi';

const ProfilSection: React.FC<any> = ({register, reset, setValue, editingProfils}: any) => {

  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['access_token']);
  const [rowId, setRowId] = useState<number[]>([]);


  useEffect(() => {
    dispatch(getAllStretchProfil(cookies)).unwrap().then(res => {
      if ("error" in res) {
        // setCookie("access_token", '', { path: '/' })
        // navigate("/")
        alert(res)
      }
    })
  }, []);

  const stretchProfil = useAppSelector(selectStretchProfil)
  function addRow() {
    setRowId(prevRowId => [...prevRowId, prevRowId.length + 1]);
  }

  useEffect(() => {
    if (editingProfils) {
      const newRows = Object.values(editingProfils).map((el: any, index: number) => {
        const rowKey = index + 1;
        setValue(`profil_${rowKey}`, el.profil);
        setValue(`profilQuantity_${rowKey}`, el.profilQuantity);
        return rowKey;
      });
      setRowId(newRows);

    }
  }, [editingProfils, setValue]);

  function removeRow(index: number, event: any, el: any): void {
    reset({ [`additional_${el}`]: event.target.value })
    setRowId(prevRowId => prevRowId.filter((_, i) => i !== index));
  }

  return (
    <div className="formdivStretch">
      Պրոֆիլ
      {
        rowId.map((el: any, index: any) => {
          return (
            <div className="divStretchInput" key={Math.random()}>
              <select id="selectCoop" key={Math.random()} {...register("profil_" + el)}>
                {
                  stretchProfil.arrStretchProfil && stretchProfil.arrStretchProfil.length > 0 ?
                    stretchProfil.arrStretchProfil.map((e: any) => {
                      return (
                        <option key={e._id} value={e._id}>{e.name}</option>
                      )
                    })
                    :
                    null
                }
              </select>
              <input
                id="quantity"
                key={Math.random()}
                type="number"
                className="inputNumber"
                placeholder="Quantity"
                {...register("profilQuantity_" + el)}
              />
              <button
                className='btn'
                type="button"
                onClick={(e) => removeRow(index, e, el)}
              >
                Հեռացնել
              </button>
            </div>
          )
        })
      }
      <button type="button" className='btn' onClick={addRow}>Ավելացնել տող</button>
    </div>
  );
};

export default ProfilSection;
