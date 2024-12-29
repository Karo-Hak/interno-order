import React, { FC, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import EditPlintSection from './EditPlintSection';
import { PlintProps } from '../../features/plint/plintSlice';

interface EditPlintOrderComponentProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
    getValues: UseFormGetValues<any>;
    plintData: PlintProps[];
    orderPlint: PlintProps[];
    setOrderPlint: React.Dispatch<React.SetStateAction<PlintProps[]>>;
    setIsCalculated: React.Dispatch<React.SetStateAction<boolean>>;

}

const EditPlintOrderComponent: FC<EditPlintOrderComponentProps> = (
    {
        register,
        reset,
        setValue,
        watch,
        getValues,
        plintData,
        orderPlint,
        setOrderPlint,
        setIsCalculated


    }: EditPlintOrderComponentProps) => {


    const [plintRowId, setPlintRowId] = useState<string[]>([]);
    const addNewRow = () => {
        setPlintRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };
    const removePlintRow = (rowId: string, index: number) => {
        reset({ [`plintId_${rowId}`]: '' });
        setPlintRowId(prevRowId => prevRowId.filter((id) => id !== rowId));
        setOrderPlint((prevEl: any) => {
            const newArray = [...prevEl];
            newArray.splice(index, 1);
            return newArray;
        });
        setIsCalculated(false)
    };

    useEffect(() => {
        if (plintRowId.length === 0) {
            orderPlint.forEach(() => {
                setPlintRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
            })
        }

    }, [orderPlint])


    return (
        <div >
            <React.Fragment >

                <div style={{ margin: "auto" }}>
                    <div style={{ display: "flex", margin: "5px" }}>
                        <button
                            type="button"
                            onClick={addNewRow}>
                            Շրիշակ
                        </button>
                    </div>

                    <EditPlintSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        plintRowId={plintRowId}
                        removePlintRow={removePlintRow}
                        plint={plintData}
                        orderPlint={orderPlint}
                        setIsCalculated={setIsCalculated}

                    />

                </div>


            </React.Fragment>
        </div>
    );
};

export default EditPlintOrderComponent;
