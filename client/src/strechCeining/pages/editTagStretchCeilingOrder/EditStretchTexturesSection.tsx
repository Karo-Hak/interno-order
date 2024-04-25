
import React, { ChangeEvent, useEffect } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Data } from '../addTagStretchCeilingOrder/TagStretchOrder';

interface EditStretchTexturesSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    stretchRowId: number[];
    removeStretchRow: (rowId: number, roomId: string) => void;
    roomId: string;
    stretchTexture: Array<Data>;
    stretchTextureId: Array<Data>;
}

const EditStretchTexturesSection: React.FC<EditStretchTexturesSectionProps> = ({
    register,
    setValue,
    getValues,
    stretchRowId,
    removeStretchRow,
    roomId,
    stretchTexture,
    stretchTextureId
}: EditStretchTexturesSectionProps) => {


    useEffect(() => {
        stretchRowId.forEach((rowId: any, index: number) => {
            setValue(`stretchId_${rowId}/${roomId}`, stretchTextureId[index].id);
            if (stretchTextureId[index].price) {
                setValue(`stretchPrice_${rowId}/${roomId}`, stretchTextureId[index].price);
            } else {
                setValue(`stretchPrice_${rowId}/${roomId}`, 0);
            }
            if (stretchTextureId[index].quantity) {
                setValue(`stretchQuantity_${rowId}/${roomId}`, stretchTextureId[index].quantity);
            } else {
                setValue(`stretchQuantity_${rowId}/${roomId}`, 0);
            }
            if (stretchTextureId[index].sum) {
                setValue(`stretchSum_${rowId}/${roomId}`, stretchTextureId[index].sum);
            } else {
                setValue(`stretchSum_${rowId}/${roomId}`, stretchTextureId[index].price * stretchTextureId[index].quantity);
            }

        });
    }, [stretchTextureId]);



    const selectTexturePrice = (event: ChangeEvent<HTMLSelectElement>, rowId: number): void => {
        const selectedId = event.target.value;
        const texture = stretchTexture.find((e: Data) => e._id === selectedId);
        if (texture) {
            setValue(`stretchPrice_${rowId}/${roomId}`, texture.price);
            setValue(`stretchQuantity_${rowId}/${roomId}`, "");
            textureSum(rowId, texture.price, 0)
        } else {
            setValue(`stretchPrice_${rowId}/${roomId}`, 0);
        }
    };

    const textureSum = (rowId: number, price: number, quantity: number): void => {
        const totalPrice = +price * +quantity;
        if (totalPrice) {
            setValue(`stretchSum_${rowId}/${roomId}`, Math.ceil(totalPrice));
        } else {
            setValue(`stretchSum_${rowId}/${roomId}`, 0);
        }
    };


    return (
        <div style={{ marginLeft: "5px", width: "100%" }}>
            {
                stretchRowId && stretchRowId.length > 0 ?
                    <table className="table tableSection" >
                        <thead>
                            <tr style={{ background: "#dfdce0" }}>
                                <th >Ձգվող Առաստաղ</th>
                                <th>Գին</th>
                                <th>Քանակ</th>
                                <th >Գումար</th>
                                <th>Հեռացնել</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stretchRowId.map((rowId: number) => (
                                <tr key={rowId}>
                                    <td style={{ minWidth: "250px", }}>
                                        <select
                                            {...register(`stretchId_${rowId}/${roomId}`)}
                                            onChange={(e) => selectTexturePrice(e, rowId)}
                                        >
                                            <option>Ընտրել Տեսակը</option>
                                            {stretchTexture && stretchTexture.length > 0
                                                ? stretchTexture.map((texture: Data) => (
                                                    <option key={texture._id} value={texture._id}>{texture.name}</option>
                                                ))
                                                : null}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Price"
                                            id={`stretchPrice_${rowId}/${roomId}`}
                                            {...register(`stretchPrice_${rowId}/${roomId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`stretchQuantity_${rowId}/${roomId}`)))}

                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Squer"
                                            id={`stretchQuantity_${rowId}/${roomId}`}
                                            {...register(`stretchQuantity_${rowId}/${roomId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(getValues(`stretchPrice_${rowId}/${roomId}`)), parseFloat(e.target.value),)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`stretchSum_${rowId}/${roomId}`}
                                            placeholder="Sum"
                                            {...register(`stretchSum_${rowId}/${roomId}`)}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => removeStretchRow(rowId, roomId)}>
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

export default EditStretchTexturesSection;
