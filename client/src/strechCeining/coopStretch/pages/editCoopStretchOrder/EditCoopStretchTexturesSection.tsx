import React, { ChangeEvent, useEffect, useState } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { StretchTextureProps } from '../../../features/strechTexture/strechTextureSlice';
import { CoopStretchTextureProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';

interface EditCoopStretchTexturesSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>
    stretchRowId: Array<string>
    removeStretchRow: (rowId: string, index: number) => void
    stretchTexture: Array<StretchTextureProps>;
    orderTexture: Array<CoopStretchTextureProps>;

}

const EditCoopStretchTexturesSection: React.FC<EditCoopStretchTexturesSectionProps> = ({
    register,
    setValue,
    getValues,
    stretchRowId,
    removeStretchRow,
    stretchTexture,
    orderTexture,
}: EditCoopStretchTexturesSectionProps) => {

    useEffect(() => {
        orderTexture.forEach((el: CoopStretchTextureProps, index: number) => {
            setValue(`stretchId_${stretchRowId[index]}`, el.id)
            setValue(`stretchPrice_${stretchRowId[index]}`, el.price)
            setValue(`stretchWidth_${stretchRowId[index]}`, el.width)
            setValue(`stretchHeight_${stretchRowId[index]}`, el.height)
            setValue(`stretchQuantity_${stretchRowId[index]}`, el.quantity)
            setValue(`stretchSum_${stretchRowId[index]}`, el.sum)
        })

    }, [orderTexture, stretchRowId])

    function handleCheckboxPrice(event: React.ChangeEvent<HTMLInputElement>, rowId: string) {
        const selectedId = getValues(`stretchId_${rowId}`)
        if (selectedId) {
            const texture = stretchTexture.find((e: StretchTextureProps) => e._id === selectedId);
            if (texture) {
                if (!event.target.checked) {
                    setValue(`stretchPrice_${rowId}`, texture.priceCoopGarpun);
                    deletInputs(rowId)
                } else {
                    setValue(`stretchPrice_${rowId}`, texture.priceCoopOtrez);
                    deletInputs(rowId)
                }
            }
        }
    }

    const selectTexturePrice = (event: ChangeEvent<HTMLSelectElement>, rowId: string): void => {
        const selectedId = event.target.value;

        const texture = stretchTexture.find((e: StretchTextureProps) => e._id === selectedId);
        if (texture) {
            setValue(`stretchPrice_${rowId}`, texture.priceCoopGarpun);
            deletInputs(rowId)
            textureSum(rowId, texture.price, 0)
        } else {
            setValue(`stretchPrice_${rowId}`, 0);
        }
    };

    function deletInputs(rowId: string) {
        setValue(`stretchQuantity_${rowId}`, "");
        setValue(`stretchWidth_${rowId}`, "");
        setValue(`stretchHeight_${rowId}`, "");
        setValue(`stretchSum_${rowId}`, 0);
    }

    const squerSum = (rowId: string, width: number, height: number): void => {
        const totalSquer = width * height
        const price = getValues(`stretchPrice_${rowId}`)
        if (totalSquer) {
            setValue(`stretchQuantity_${rowId}`, totalSquer)
            textureSum(rowId, price, totalSquer)
        } else {
            setValue(`stretchQuantity_${rowId}`, 0);
        }
    }

    const textureSum = (rowId: string, price: number, quantity: number): void => {
        const totalPrice = price * quantity;
        if (totalPrice) {
            setValue(`stretchSum_${rowId}`, Math.ceil(totalPrice));
        } else {
            setValue(`stretchSum_${rowId}`, 0);
        }
    };



    return (
        <div style={{ marginLeft: "5px", width: "100%" }}>
            {
                stretchRowId && stretchRowId.length > 0 ?
                    <table className="table tableSection" >
                        <thead>
                            <tr style={{ background: "#dfdce0" }}>
                                <th >Ձգ. Առաստաղ</th>
                                <th>Գին</th>
                                <th>Երկարություն</th>
                                <th>Լայնություն</th>
                                <th>Ք/Մ</th>
                                <th>Գումար</th>
                                <th>Հեռացնել</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stretchRowId.map((rowId: string, index: number) => (
                                <tr key={rowId}>
                                    <td style={{ minWidth: "250px" }}>
                                        <select
                                            {...register(`stretchId_${rowId}`)}
                                            onChange={(e) => selectTexturePrice(e, rowId)}
                                            value={getValues(`stretchId_${rowId}`)}
                                        >

                                            <option>Ընտրել Տեսակը</option>
                                            {stretchTexture.length > 0
                                                ? stretchTexture.map((texture: any) => (
                                                    <option key={`stretchId_${rowId}_${texture._id}`} value={texture._id}>{texture.name}</option>
                                                ))
                                                : null}
                                        </select>
                                        <input type='checkbox' onChange={(e) => handleCheckboxPrice(e, rowId)} />
                                        (Ատրեզ)
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Price"
                                            id={`stretchPrice_${rowId}`}
                                            {...register(`stretchPrice_${rowId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`stretchQuantity_${rowId}`)))}

                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Width"
                                            id={`stretchWidth_${rowId}`}
                                            {...register(`stretchWidth_${rowId}`)}
                                            onChange={(e) => squerSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`stretchHeight_${rowId}`)))}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Height"
                                            id={`stretchHeight_${rowId}`}
                                            {...register(`stretchHeight_${rowId}`)}
                                            onChange={(e) => squerSum(rowId, parseFloat(getValues(`stretchWidth_${rowId}`)), parseFloat(e.target.value),)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Squer"
                                            id={`stretchQuantity_${rowId}`}
                                            {...register(`stretchQuantity_${rowId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(getValues(`stretchPrice_${rowId}`)), parseFloat(e.target.value),)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`stretchSum_${rowId}`}
                                            placeholder="Sum"
                                            {...register(`stretchSum_${rowId}`)}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => removeStretchRow(rowId, index)}>
                                            Հեռացնել
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : null
            }
        </div>
    );
};

export default EditCoopStretchTexturesSection;
