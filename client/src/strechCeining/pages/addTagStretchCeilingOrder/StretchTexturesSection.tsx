
import React, { ChangeEvent } from 'react';

import './tagStretchOrder.css';

const StretchTexturesSection: React.FC<any> = ({ register, setValue, stretchRowId, removeStretchRow, roomId, stretchTexture }: any) => {
    

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

export default StretchTexturesSection;
