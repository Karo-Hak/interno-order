import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllStretchTexture } from '../../strechTexture/strechTextureApi';
import { selectStretchTexture } from '../../strechTexture/strechTextureSlice';
import { useCookies } from 'react-cookie';


const StretchTexturesSection: React.FC<any> = ({ register, reset, setValue, editingStretchTexture }: any) => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);

    const [texturePrices, setTexturePrices] = useState<{ [key: string]: number }>({});
    const [priceValues, setPriceValues] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        dispatch(getAllStretchTexture(cookies)).unwrap().then(res => {
            if ('error' in res) {
                alert(res);
            }
        });

    }, []);

    const stretchTexture = useAppSelector(selectStretchTexture);

    const [rowId, setRowId] = useState<number[]>([]);

    function addRow() {
        setRowId(prevRowId => [...prevRowId, prevRowId.length + 1]);
    }

    useEffect(() => {
        if (editingStretchTexture) {
            const newRows = Object.values(editingStretchTexture).map((el: any, index: number) => {
                const rowKey = index + 1;
                setValue(`stretchTexture_${rowKey}`, el.stretchTexture);
                setValue(`stretchPrice_${rowKey}`, el.stretchPrice);
                setValue(`stretchWidth_${rowKey}`, el.stretchWidth);
                setValue(`stretchHeight_${rowKey}`, el.stretchHeight);
                setValue(`stretchSquer_${rowKey}`, el.stretchSquer);
                setValue(`stretchTotal_${rowKey}`, el.stretchTotal);
                return rowKey;
            });
            setRowId(newRows);
        }
    }, [editingStretchTexture, setValue]);

    function removeRow(index: number, event: any, rowKey: number): void {
        reset({ [`stretchTexture_${rowKey}`]: event.target.value });
        setRowId(prevRowId => prevRowId.filter((_, i) => i !== index));
    }

    const selectTexturePrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
        const selectedId = event.target.value;
        const texture = stretchTexture.arrStretchTexture.find((e: any) => e._id === selectedId);
        if (texture) {
            setPriceValues(prevValues => ({ ...prevValues, [rowKey]: texture.price }));
            setValue(`stretchPrice_${rowKey}`, texture.price)
        } else {
            setTexturePrices(prevPrices => ({ ...prevPrices, [rowKey]: 0 }));
            setPriceValues(prevValues => ({ ...prevValues, [rowKey]: 0 }));
        }
    };


    const selectedSquerValues = (event: ChangeEvent<HTMLInputElement>, rowKey: string): void => {
        const squerField = `stretchSquer_${rowKey}`;
        const widthField = `width_${rowKey}`;
        const heightField = `height_${rowKey}`;
        const form = event.target.form;
        if (form instanceof HTMLFormElement) {
            const widthValue = parseFloat(form[widthField]?.value) || 0;
            const heightValue = parseFloat(form[heightField]?.value) || 0;
            const squerValue = (widthValue / 100) * (heightValue / 100)
            setValue(squerField, squerValue.toFixed(2));
        }
    };
    const selectedTotalValues = (event: ChangeEvent<HTMLInputElement>, rowKey: string): void => {
        const totalField = `stretchTotal_${rowKey}`;
        const squerField = `stretchSquer_${rowKey}`;
        const priceField = `stretchPrice_${rowKey}`;
        const form = event.target.form;
        if (form instanceof HTMLFormElement) {
            const priceValue = parseFloat(form[priceField]?.value) || 0;
            const squerValue = parseFloat(form[squerField]?.value) || 0;
            const totalValue = priceValue * squerValue
            setValue(totalField, totalValue.toFixed(2));
        }

    };



    return (
        <div className="formdivStretch">
            Ձգվող Առաստաղ
            {rowId.map((el: any, index: any) => (
                <div key={el}>
                    <select
                        key={el}
                        {...register("stretchTexture_" + el)}
                        onChange={(e) => selectTexturePrice(e, el)}
                    >
                        <option>Ձգվող Առաստաղ</option>

                        {stretchTexture.arrStretchTexture && stretchTexture.arrStretchTexture.length > 0
                            ? stretchTexture.arrStretchTexture.map((e: any) => (
                                <option key={e._id} value={e._id}>{e.name}</option>
                            ))
                            : null}
                    </select>
                    <input
                        id={`price_${el}`}
                        type="number"
                        className="inputNumber"
                        placeholder="Price"
                        value={priceValues[el] || 0}
                        {...register(`stretchPrice_${el}`)}
                        onChange={(e) => {
                            setPriceValues(prevValues => ({ ...prevValues, [el]: parseFloat(e.target.value) }));
                            selectedSquerValues(e, el);
                            selectedTotalValues(e, el)
                        }}
                    />
                    <input
                        key={Math.random()}
                        className="inputNumber"
                        type='number'
                        id={`width_${el}`}
                        placeholder="Width"
                        {...register("stretchWidth_" + el)}
                        onChange={(e) => {
                            selectedSquerValues(e, el);
                            selectedTotalValues(e, el)
                        }}
                    />
                    <input
                        key={Math.random()}
                        className="inputNumber"
                        type='number'
                        id={`height_${el}`}
                        placeholder="Height"
                        {...register("stretchHeight_" + el)}
                        onChange={(e) => {
                            selectedSquerValues(e, el)
                            selectedTotalValues(e, el)
                        }}
                    />
                    <input
                        key={Math.random()}
                        className="inputNumber"
                        id={`squer_${el}`}
                        placeholder="Squer"
                        {...register("stretchSquer_" + el)}
                        onChange={(e) => selectedTotalValues(e, el)}
                    />
                    <input
                        key={Math.random()}
                        className="inputNumber"
                        type='number'
                        id={`total_${el}`}
                        placeholder="Total"
                        {...register("stretchTotal_" + el)}
                    />
                    <button className='btn' type="button" onClick={(e) => removeRow(index, e, el)} >Հեռացնել</button>
                </div>
            ))}
            <button type="button" className='btn' onClick={addRow}>Ավելացնել տող</button>
        </div>
    );
};

export default StretchTexturesSection;
