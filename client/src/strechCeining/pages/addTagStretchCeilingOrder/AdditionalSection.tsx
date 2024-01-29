import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectStretchAdditional } from "../../strechAdditional/strechAdditionalSlice";
import { getAllStretchAdditional } from "../../strechAdditional/strechAdditionalApi";
import { useCookies } from 'react-cookie';

const AdditionalSection: React.FC<any> = ({ register, reset, setValue }: any) => {

  const dispatch = useAppDispatch();

  const [cookies, setCookie] = useCookies(['access_token']);
  const [rowId, setRowId] = useState<number[]>([]);
  const [additionalPrices, setAdditionalPrices] = useState<{ [key: string]: number }>({});
  const [priceValues, setPriceValues] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    dispatch(getAllStretchAdditional(cookies)).unwrap().then(res => {
      if ("error" in res) {
        alert(res);
      }
    });
  }, []);

  const stretchAdditional = useAppSelector(selectStretchAdditional);

  function addRow() {
    setRowId(prevRowId => [...prevRowId, prevRowId.length + 1]);
  }

  function removeRow(index: number, event: any, el: any): void {
    reset({ [`additional_${el}`]: event.target.value })
    setRowId(prevRowId => prevRowId.filter((_, i) => i !== index));
  }


  const selectAdditionalPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const additional = stretchAdditional.arrStretchAdditional.find((e: any) => e._id === selectedId);

    if (additional) {
      setPriceValues(prevValues => ({ ...prevValues, [rowKey]: additional.price }));
      setValue(`additionalPrice_${rowKey}`, additional.price)
    } else {
      setPriceValues(prevValues => ({ ...prevValues, [rowKey]: 0 }));
    }
  };


  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>, rowKey: string): void => {
    const quantityField = `additionalQuantity_${rowKey}`;
    const priceField = `additionalPrice_${rowKey}`;
    const totalField = `additionalTotal_${rowKey}`;

    const form = event.target.form;
    if (form instanceof HTMLFormElement) {
      const priceValue = parseFloat(form[priceField]?.value) || 0;
      const quantityValue = parseFloat(form[quantityField]?.value) || 0;
      const totalValue = priceValue * quantityValue;
      setValue(totalField, totalValue.toFixed(2));
    }

  };

  return (
    <div className="formdivStretch1">
      <div className='additionalDiv'>

        {rowId.map((el: any, index: any) => (
          <div className="divStretchInput1" key={el}>
            <select id={`selectCoop_${el}`} {...register(`additional_${el}`)} onChange={(e) => selectAdditionalPrice(e, el)}>
              <option>Լռացուցիչ</option>
              {stretchAdditional.arrStretchAdditional && stretchAdditional.arrStretchAdditional.length > 0
                ? stretchAdditional.arrStretchAdditional.map((e: any) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))
                : null}
            </select>
            <input
              id={`price_${el}`}
              type="number"
              className='stretchInput'
              placeholder="Price"
              value={priceValues[el] || 0}
              {...register(`additionalPrice_${el}`)}
              onChange={(e) => {
                setPriceValues(prevValues => ({ ...prevValues, [el]: parseFloat(e.target.value) }));
                handleQuantityChange(e, el);
              }}
            />
            <input
              id={`quantity_${el}`}
              type="number"
              className='stretchInput'
              placeholder="Quantity"
              {...register(`additionalQuantity_${el}`)}
              onChange={(e) => {
                handleQuantityChange(e, el);
              }}
            />
            <input
              id={`total_${el}`}
              type="number"
              className='stretchInput'
              placeholder="Total"
              {...register(`additionalTotal_${el}`)}
            />
            <button className="btn btn1" type="button" onClick={(e) => removeRow(index, e, el)}>
              Հեռացնել
            </button>
          </div>
        ))}
        <div>

          <button type="button" className="btn btn1" onClick={addRow}>
            Լռացուցիչ
          </button>
        </div>
        <div>


        </div>
      </div>
      <div className='dzgvox_arastax_nkaragrutyun'>

        <textarea
          placeholder='Նկարագրություն'
          {...register(`orderComment`)}
        ></textarea>
      </div>
    </div>

  );
};

export default AdditionalSection;
