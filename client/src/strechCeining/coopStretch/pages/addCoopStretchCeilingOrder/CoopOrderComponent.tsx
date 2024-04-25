import React, { FC, useState, useEffect } from 'react';
import './tagStretchOrder.css'
import LightPlatformSection from './CoopLightPlatformSection';
import LightRingSection from './CoopLightRingSection';
import ProfilSection from './CoopProfilSection';
import StretchTexturesSection from './CoopStretchTexturesSection';
import { v4 as uuidv4 } from 'uuid';
import { UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import CoopStretchTexturesSection from './CoopStretchTexturesSection';
import CoopProfilSection from './CoopProfilSection';
import CoopLightRingSection from './CoopLightRingSection';
import CoopLightPlatformSection from './CoopLightPlatformSection';
import { StretchTextureProps } from '../../../features/strechTexture/strechTextureSlice';
import { StretchProfilProps } from '../../../features/strechProfil/strechProfilSlice';
import { StretchLightRingProps } from '../../../features/strechLightRing/strechLightRingSlice';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';

interface CoopOrderComponentProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>
    getValues: UseFormGetValues<any>
    stretchTextureData: StretchTextureProps[];
    stretchProfilData: StretchProfilProps[];
    stretchLightPlatformData: StretchLightPlatformProps[];
    stretchLightRingData: StretchLightRingProps[];
}

const CoopOrderComponent: FC<CoopOrderComponentProps> = (
    {
        register,
        reset,
        setValue,
        watch,
        getValues,
        stretchTextureData,
        stretchProfilData,
        stretchLightPlatformData,
        stretchLightRingData,

    }: CoopOrderComponentProps) => {

    //////stretch Section
    const [stretchRowId, setStretchRowId] = useState<string[]>([]);
    const addNewRow = () => {
        setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };

    const removeStretchRow = (index: string) => {
        reset({ [`stretch_${index}`]: '' })
        setStretchRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };


    /////Profil Seqtion
    const [profilRowId, setProfilRowId] = useState<string[]>([]);
    function addProfilRow() {
        setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    }

    function removeProfilRow(index: string) {
        reset({ [`profil_${index}`]: '' })
        setProfilRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Platform Section
    const [lightPlatformRowId, setLightPlatformRowId] = useState<string[]>([])

    function addLightPlatformRow() {
        setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
    }

    function removeLightPlatformRowId(index: string) {
        console.log(`lightPlatform_${index}`, 62);

        reset({ [`lightPlatform_${index}`]: '' })
        setLightPlatformRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Ring Section
    const [lightRingRowId, setLightRingRowId] = useState<string[]>([])

    function addLightRingRow() {
        setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
    }

    function removeLightRingRowId(index: string) {
        reset({ [`lightRing_${index}`]: '' })
        setLightRingRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }







    return (
        <div >
            <React.Fragment >

                <div  style={{ margin: "auto" }}>
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

                    <CoopStretchTexturesSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        stretchRowId={stretchRowId}
                        removeStretchRow={removeStretchRow}
                        stretchTexture={stretchTextureData}

                    />
                    <CoopProfilSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        profilRowId={profilRowId}
                        removeProfilRow={removeProfilRow}
                        stretchProfil={stretchProfilData}
                    />
                    <CoopLightRingSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightRingRowId={lightRingRowId}
                        removeLightRingRowId={removeLightRingRowId}
                        stretchLightRing={stretchLightRingData}
                    />
                    <CoopLightPlatformSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightPlatformRowId={lightPlatformRowId}
                        removeLightPlatformRowId={removeLightPlatformRowId}
                        stretchLightPlatform={stretchLightPlatformData}
                    />

                </div>


            </React.Fragment>
        </div>
    );
};

export default CoopOrderComponent;
