
import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditStretchTexturesSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    stretchRowId: string[]; 
    removeStretchRow: (rowId: string, roomId: string) => void 
    roomId: string;
    stretchTexture: { arrStretchTexture: Array<any> }; 
    stretchTextureId: Array<{ stretchTexture: string; stretchPrice: number; stretchSquer: number }>;
}

const EditStretchTexturesSection: React.FC<EditStretchTexturesSectionProps> = ({
    register,
    setValue,
    stretchRowId,
    removeStretchRow,
    roomId,
    stretchTexture,
    stretchTextureId
}: EditStretchTexturesSectionProps) => {


    useEffect(() => {
        stretchRowId.forEach((rowId: any, index: number) => {
            setValue(`stretchTexture_${rowId}/${roomId}`, stretchTextureId[index].stretchTexture);
            if (stretchTextureId[index].stretchPrice) {
                setValue(`stretchPrice_${rowId}/${roomId}`, stretchTextureId[index].stretchPrice);
            } else {
                setValue(`stretchPrice_${rowId}/${roomId}`, 0);
            }
            if (stretchTextureId[index].stretchSquer) {
                setValue(`stretchSquer_${rowId}/${roomId}`, stretchTextureId[index].stretchSquer);
            } else {
                setValue(`stretchSquer_${rowId}/${roomId}`, 0);
            }

        });
    }, [stretchTextureId]);


    const selectTexturePrice = (event: ChangeEvent<HTMLSelectElement>, rowId: any): void => {
        const selectedId = event.target.value;
        const texture = stretchTexture.arrStretchTexture.find((e: any) => e._id === selectedId);
        if (texture) {
            setValue(`stretchPrice_${rowId}/${roomId}`, texture.price);
        } else {
            setValue(`stretchPrice_${rowId}/${roomId}`, 0);
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
                                <th>Հեռացնել</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stretchRowId.map((rowId: any) => (
                                <tr key={rowId}>
                                    <td style={{ minWidth: "250px", }}>
                                        <select
                                            {...register(`stretchTexture_${rowId}/${roomId}`)}
                                            onChange={(e) => selectTexturePrice(e, rowId)}
                                        >
                                            <option>Ընտրել Տեսակը</option>
                                            {stretchTexture.arrStretchTexture && stretchTexture.arrStretchTexture.length > 0
                                                ? stretchTexture.arrStretchTexture.map((texture: any) => (
                                                    <option key={texture._id} value={texture._id}>{texture.name}</option>
                                                ))
                                                : null}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            {...register(`stretchPrice_${rowId}/${roomId}`)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Squer"
                                            {...register(`stretchSquer_${rowId}/${roomId}`)}
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
