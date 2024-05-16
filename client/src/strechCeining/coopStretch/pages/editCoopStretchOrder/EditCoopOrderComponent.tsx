import React, { FC, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { StretchTextureProps } from '../../../features/strechTexture/strechTextureSlice';
import { StretchProfilProps } from '../../../features/strechProfil/strechProfilSlice';
import { StretchLightRingProps } from '../../../features/strechLightRing/strechLightRingSlice';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';
import EditCoopStretchTexturesSection from './EditCoopStretchTexturesSection';
import { CoopLightPlatformProps, CoopLightRingProps, CoopStretchProfilProps, CoopStretchTextureProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';
import EditCoopProfilSection from './EditCoopProfilSection';
import EditCoopLightPlatformSection from './EditCoopLightPlatformSection';
import EditCoopLightRingSection from './EditCoopLightRingSection';

interface EditCoopOrderComponentProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
    getValues: UseFormGetValues<any>;
    stretchTextureData: StretchTextureProps[];
    orderTexture: CoopStretchTextureProps[];
    stretchProfilData: StretchProfilProps[];
    orderProfil: CoopStretchProfilProps[];
    stretchLightPlatformData: StretchLightPlatformProps[];
    orderLightPlatform: CoopLightPlatformProps[];
    stretchLightRingData: StretchLightRingProps[];
    orderLightRing: CoopLightRingProps[];
    setOrderTexture: any;
    setOrderProfil: any;
    setOrderLightPlatform: any;
    setOrderLightRing: any;
}

const EditCoopOrderComponent: FC<EditCoopOrderComponentProps> = (
    {
        register,
        reset,
        setValue,
        watch,
        getValues,
        stretchTextureData,
        orderTexture,
        stretchProfilData,
        orderProfil,
        stretchLightPlatformData,
        orderLightPlatform,
        stretchLightRingData,
        orderLightRing,
        setOrderTexture,
        setOrderProfil,
        setOrderLightPlatform,
        setOrderLightRing

    }: EditCoopOrderComponentProps) => {

    //////stretch Section
    const [stretchRowId, setStretchRowId] = useState<string[]>([]);
    const addNewRow = () => {
        setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };
    const removeStretchRow = (rowId: string, index: number) => {
        reset({ [`stretchId_${rowId}`]: '' });
        setStretchRowId(prevRowId => prevRowId.filter((id) => id !== rowId));
        setOrderTexture((prevEl: any) => {
            const newArray = [...prevEl];
            newArray.splice(index, 1);
            return newArray;
        });
    };


    /////Profil Seqtion
    const [profilRowId, setProfilRowId] = useState<string[]>([]);
    function addProfilRow() {
        setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    }

    function removeProfilRow(rowId: string, index: number) {
        reset({ [`profilId_${rowId}`]: '' })
        setProfilRowId(prevRowId => prevRowId.filter((_, i) => _ !== rowId));
        setOrderProfil((prevEl: any) => {
            const newArray = [...prevEl];
            newArray.splice(index, 1);
            return newArray
        })
    }

    //////Light Platform Section
    const [lightPlatformRowId, setLightPlatformRowId] = useState<string[]>([])

    function addLightPlatformRow() {
        setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])

    }

    function removeLightPlatformRowId(rowId: string, index: number) {
        reset({ [`lightPlatformId_${rowId}`]: '' })
        setLightPlatformRowId(prevRowId => prevRowId.filter((_, i) => _ !== rowId));
        setOrderLightPlatform((prevEl: any) => {
            const newArray = [...prevEl];
            newArray.splice(index, 1);
            return newArray
        })
    }

    //////Light Ring Section
    const [lightRingRowId, setLightRingRowId] = useState<string[]>([])

    function addLightRingRow() {
        setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
    }

    function removeLightRingRowId(rowId: string, index: number) {
        reset({ [`lightRingId_${rowId}`]: '' })
        setLightRingRowId(prevRowId => prevRowId.filter((_, i) => _ !== rowId));
        setOrderLightRing((prevEl: any) => {
            const newArray = [...prevEl];
            newArray.splice(index, 1);
            return newArray
        })
    }

    useEffect(() => {
        if (stretchRowId.length === 0) {
            orderTexture.forEach(() => {
                setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
            })
        }

    }, [orderTexture])

    useEffect(() => {
        if (profilRowId.length === 0) {
            orderProfil.forEach(() => {
                setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
            })
        }
    }, [orderProfil])

    useEffect(() => {
        if (lightPlatformRowId.length === 0) {
            orderLightPlatform.forEach(() => {
                setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
            })
        }
    }, [orderLightPlatform])

    useEffect(() => {
        if (lightRingRowId.length === 0) {
            orderLightRing.forEach(() => {
                setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
            })
        }
    }, [orderLightRing])


    return (
        <div >
            <React.Fragment >

                <div style={{ margin: "auto" }}>
                    <div style={{ display: "flex", margin: "5px" }}>
                        <button
                            type="button"
                            onClick={addNewRow}>
                            Ձգվող Առաստաղ
                        </button>
                        <button
                            type="button"
                            onClick={addProfilRow}>
                            Պրոֆիլ
                        </button>
                        <button
                            type="button"
                            onClick={addLightRingRow}>
                            Լույսի Օղակ
                        </button>
                        <button
                            type="button"
                            onClick={addLightPlatformRow}>
                            Լույսի Պլատֆորմ
                        </button>
                    </div>

                    <EditCoopStretchTexturesSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        stretchRowId={stretchRowId}
                        removeStretchRow={removeStretchRow}
                        stretchTexture={stretchTextureData}
                        orderTexture={orderTexture}

                    />
                    <EditCoopProfilSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        profilRowId={profilRowId}
                        removeProfilRow={removeProfilRow}
                        stretchProfil={stretchProfilData}
                        orderProfil={orderProfil}
                    />
                    <EditCoopLightRingSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightRingRowId={lightRingRowId}
                        removeLightRingRowId={removeLightRingRowId}
                        stretchLightRing={stretchLightRingData}
                        orderLightRing={orderLightRing}
                    />
                    <EditCoopLightPlatformSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightPlatformRowId={lightPlatformRowId}
                        removeLightPlatformRowId={removeLightPlatformRowId}
                        stretchLightPlatform={stretchLightPlatformData}
                        orderLightPlatform={orderLightPlatform}
                    />

                </div>


            </React.Fragment>
        </div>
    );
};

export default EditCoopOrderComponent;
