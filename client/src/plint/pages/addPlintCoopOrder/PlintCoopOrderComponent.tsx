import React, { FC, useState } from 'react';
import './plintCoopOrder.css'
import { v4 as uuidv4 } from 'uuid';
import { UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form';
import { PlintProps } from '../../features/plint/plintSlice';
import PlintRetailSection from './PlintRetailSection';


interface PlintOrderComponentProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    plintData: PlintProps[];

}

const PlintRetailOrderComponent: FC<PlintOrderComponentProps> = (
    {
        register,
        reset,
        setValue,
        getValues,
        plintData,

    }: PlintOrderComponentProps) => {

    //////Plint Section
    const [plintRowId, setPlintRowId] = useState<string[]>([]);
    const addNewRow = () => {
        setPlintRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };

    const removePlintRow = (index: string) => {
        reset({ [`plint_${index}`]: '' })
        setPlintRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };


    return (
        <div >
            <React.Fragment >
                <div style={{ margin: "auto" }}>
                    <div style={{ display: "flex", margin: "5px" }}>
                        <select id='code' {...register("code")}>
                            <option value={"INT"}>INT</option>
                            <option value={"TAG"}>TAG</option>
                        </select>
                        <button
                            type="button"
                            onClick={addNewRow}>
                            Շրիշակ
                        </button>
                    </div>

                    <PlintRetailSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        plintRowId={plintRowId}
                        removePlintRow={removePlintRow}
                        plint={plintData}

                    />

                </div>


            </React.Fragment>
        </div>
    );
};

export default PlintRetailOrderComponent;
