import React, { ChangeEvent } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import './plintRetailOrder.css';
import { PlintProps } from '../../features/plint/plintSlice';

interface PlintSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>
    plintRowId: Array<string>
    removePlintRow: (rowId: string) => void
    plint: Array<PlintProps>;
}

const PlintRetailSection: React.FC<PlintSectionProps> = ({
    register,
    setValue,
    getValues,
    plintRowId,
    removePlintRow,
    plint,
}: PlintSectionProps) => {


    const selectPlintPrice = (event: ChangeEvent<HTMLSelectElement>, rowId: string): void => {
        const selectedId = event.target.value;

        const texture = plint.find((e: PlintProps) => e._id === selectedId);
        if (texture) {
            setValue(`plintPrice_${rowId}`, texture.price1);
            deletInputs(rowId)
            textureSum(rowId, +texture.price1, 0)
        } else {
            setValue(`plintPrice_${rowId}`, 0);
        }
    };

    function deletInputs(rowId: string) {
        setValue(`plintQuantity_${rowId}`, "");
        setValue(`plintSum_${rowId}`, 0);
    }


    const textureSum = (rowId: string, price: number, quantity: number): void => {
        const totalPrice = price * quantity;
        if (totalPrice) {
            
            setValue(`plintSum_${rowId}`, Math.ceil(totalPrice));
        } else {
            setValue(`plintSum_${rowId}`, 0);
        }
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
                            {plintRowId.map((rowId: any) => (
                                <tr key={rowId}>
                                    <td style={{ minWidth: "250px" }}>
                                        <select
                                            {...register(`plintId_${rowId}`)}
                                            onChange={(e) => selectPlintPrice(e, rowId)}
                                        >

                                            <option>Ընտրել Տեսակը</option>
                                            {plint.length > 0
                                                ? plint.map((element: any) => (
                                                    <option key={`plintId_${rowId}_${element._id}`} value={element._id}>{element.name}</option>
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
                                            placeholder="Sum"
                                            id={`plintQuantity_${rowId}`}
                                            {...register(`plintQuantity_${rowId}`)}
                                            onChange={(e) => textureSum(rowId, parseFloat(getValues(`plintPrice_${rowId}`)), parseFloat(e.target.value),)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`sum_${rowId}`}
                                            placeholder="Sum"
                                            {...register(`plintSum_${rowId}`)}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => removePlintRow(rowId)}>
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

export default PlintRetailSection;
