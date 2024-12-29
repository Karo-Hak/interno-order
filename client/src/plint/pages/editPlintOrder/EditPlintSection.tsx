import React, { ChangeEvent, useEffect, useState } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { GroupedPlintDataProps, PlintOrderProps } from '../../features/plintOrder/plintOrderSlice';
import { PlintProps } from '../../features/plint/plintSlice';

interface EditPlintSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>
    plintRowId: Array<string>
    removePlintRow: (rowId: string, index: number) => void
    plint: Array<PlintProps>;
    orderPlint: Array<any>;
    setIsCalculated: React.Dispatch<React.SetStateAction<boolean>>;

}

const EditPlintSection: React.FC<EditPlintSectionProps> = ({
    register,
    setValue,
    getValues,
    plintRowId,
    removePlintRow,
    plint,
    orderPlint,
    setIsCalculated
}: EditPlintSectionProps) => {

    useEffect(() => {
        orderPlint.forEach((el: GroupedPlintDataProps, index: number) => {
            if (plintRowId.length > 0) {
                setValue(`plintId_${plintRowId[index]}`, el.id)
                setValue(`plintPrice_${plintRowId[index]}`, el.price)
                setValue(`plintQuantity_${plintRowId[index]}`, el.quantity)
                setValue(`plintSum_${plintRowId[index]}`, el.sum)
            }
        })
    }, [orderPlint, plintRowId])




    const selectPlintPrice = (event: ChangeEvent<HTMLSelectElement>, rowId: string): void => {
        const selectedId = event.target.value;
        const texture = plint.find((e: PlintProps) => e._id === selectedId);
        if (texture) {
            setValue(`plintPrice_${rowId}`, texture.price);
            textureSum(rowId, +texture.price, 0)
        } else {
            setValue(`plintPrice_${rowId}`, 0);
        }
        setIsCalculated(false)
    };

    const textureSum = (rowId: string, price: number, quantity: number): void => {
        const totalPrice = price * quantity;
        if (totalPrice) {
            setValue(`plintSum_${rowId}`, Math.ceil(totalPrice));
        } else {
            setValue(`plintSum_${rowId}`, 0);
        }
        setIsCalculated(false)
    };

    return (
        <div style={{ marginLeft: "5px", width: "100%" }}>
            {
                plintRowId && plintRowId.length > 0 ?
                    <table className="table tableSection" >
                        <thead>
                            <tr style={{ background: "#dfdce0" }}>
                                <th >Շրիշակ</th>
                                <th>Գին</th>
                                <th>Քանակ</th>
                                <th>Գումար</th>
                                <th>Հեռացնել</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plintRowId.map((rowId: string, index: number) => (
                                <tr key={rowId}>
                                    <td style={{ minWidth: "250px" }}>
                                        <select
                                            {...register(`plintId_${rowId}`)}
                                            onChange={(e) => selectPlintPrice(e, rowId)}
                                            value={getValues(`plintId_${rowId}`)}
                                        >

                                            <option>Ընտրել Տեսակը</option>
                                            {plint.length > 0
                                                ? plint.map((texture: any) => (
                                                    <option key={`plintId_${rowId}_${texture._id}`} value={texture._id}>{texture.name}</option>
                                                ))
                                                : null}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Price"
                                            id={`plintPrice_${rowId}`}
                                            {...register(`plintPrice_${rowId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(e.target.value), parseFloat(getValues(`plintQuantity_${rowId}`)))}

                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Squer"
                                            id={`plintQuantity_${rowId}`}
                                            {...register(`plintQuantity_${rowId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(getValues(`plintPrice_${rowId}`)), parseFloat(e.target.value),)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`plintSum_${rowId}`}
                                            placeholder="Sum"
                                            {...register(`plintSum_${rowId}`)}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => removePlintRow(rowId, index)}>
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

export default EditPlintSection;
