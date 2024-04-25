import React, { FC, useState, useEffect } from 'react';
import './tagStretchOrder.css'
import AdditionalSection from './AdditionalSection';
import LightPlatformSection from './LightPlatformSection';
import LightRingSection from './LightRingSection';
import ProfilSection from './ProfilSection';
import StretchTexturesSection from './StretchTexturesSection';
import { v4 as uuidv4 } from 'uuid';
import BardutyunSection from './BardutyunSection';
import OtherSection from './OtherSection';
import { UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface RoomSectionProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>
    getValues: UseFormGetValues<any>
    roomId: string;
    room: any;
    stretchTextureData: any;
    stretchAdditionalData: any;
    stretchProfilData: any;
    stretchLightPlatformData: any;
    stretchLightRingData: any;
    stretchBardutyunData: any;
}

const RoomSection: FC<RoomSectionProps> = (
    {
        register,
        reset,
        setValue,
        watch,
        getValues,
        roomId,
        room,
        stretchTextureData,
        stretchAdditionalData,
        stretchProfilData,
        stretchLightPlatformData,
        stretchLightRingData,
        stretchBardutyunData,

    }: RoomSectionProps) => {

    //////stretch Section
    const [stretchRowId, setStretchRowId] = useState<string[]>([]);
    const addNewRow = () => {
        setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };

    const removeStretchRow = (index: string, roomId: string) => {
        reset({ [`stretch_${index}/${roomId}`]: '' })
        setStretchRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    ///////Additional Section
    const [additionalRowId, setAdditionalRowId] = useState<string[]>([]);
    function addAdditionalRow() {
        setAdditionalRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    }
    function removeAdditionalRow(index: string, roomId: any): void {
        reset({ [`additional_${index}/${roomId}`]: '' })
        setAdditionalRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }

    /////Profil Seqtion
    const [profilRowId, setProfilRowId] = useState<string[]>([]);
    function addProfilRow() {
        setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    }

    function removeProfilRow(index: string, roomId: string) {
        reset({ [`profil_${index}/${roomId}`]: '' })
        setProfilRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Platform Section
    const [lightPlatformRowId, setLightPlatformRowId] = useState<string[]>([])

    function addLightPlatformRow() {
        setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
    }

    function removeLightPlatformRowId(index: string, roomId: any) {
        console.log(`lightPlatform_${index}/${roomId}`, 62);

        reset({ [`lightPlatform_${index}/${roomId}`]: '' })
        setLightPlatformRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Ring Section
    const [lightRingRowId, setLightRingRowId] = useState<string[]>([])

    function addLightRingRow() {
        setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string])
    }

    function removeLightRingRowId(index: string, roomId: string) {
        reset({ [`lightRing_${index}/${roomId}`]: '' })
        setLightRingRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }

    /////////////Bardutyun///////////
    const [bardutyunRowId, setBardutyunRowId] = useState<string[]>([]);
    const addBardutyunNewRow = () => {
        setBardutyunRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };

    const removeBardutyunRow = (index: string, roomId: string) => {
        reset({ [`bardutyun_${index}/${roomId}`]: '' })
        setBardutyunRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    /////////////OtherSection///////////
    const [otherRowId, setOtherRowId] = useState<string[]>([]);
    const addOtherNewRow = () => {
        setOtherRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as string]);
    };

    const removeOtherRow = (index: string, roomId: any) => {
        reset({ [`other_${index}/${roomId}`]: '' })
        setOtherRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    let displayView: string = ""
    if (room.isChecked) {
        displayView = "block"
    } else {
        displayView = "none"
    }



    return (
        <div style={{
            display: displayView
        }}>
            <React.Fragment >

                <div key={roomId} style={{ margin: "auto" }}>
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
                        <button
                            type="button"
                            onClick={addBardutyunNewRow}>
                            Բարդություն
                        </button>
                        <button
                            type="button"
                            onClick={addAdditionalRow}>
                            Այլ Ապրանք
                        </button>
                        <button
                            type="button"
                            onClick={addOtherNewRow}>
                            Լրացուցիչ
                        </button>
                    </div>

                    <StretchTexturesSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        stretchRowId={stretchRowId}
                        removeStretchRow={removeStretchRow}
                        roomId={roomId}
                        stretchTexture={stretchTextureData}

                    />
                    <ProfilSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        profilRowId={profilRowId}
                        removeProfilRow={removeProfilRow}
                        roomId={roomId}
                        stretchProfil={stretchProfilData}
                    />
                    <LightRingSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightRingRowId={lightRingRowId}
                        removeLightRingRowId={removeLightRingRowId}
                        roomId={roomId}
                        stretchLightRing={stretchLightRingData}
                    />
                    <LightPlatformSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        lightPlatformRowId={lightPlatformRowId}
                        removeLightPlatformRowId={removeLightPlatformRowId}
                        roomId={roomId}
                        stretchLightPlatform={stretchLightPlatformData}
                    />
                    <BardutyunSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        bardutyunRowId={bardutyunRowId}
                        removeBardutyunRow={removeBardutyunRow}
                        roomId={roomId}
                        stretchBardutyun={stretchBardutyunData}
                    />
                    <AdditionalSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        additionalRowId={additionalRowId}
                        removeAdditionalRow={removeAdditionalRow}
                        roomId={roomId}
                        stretchAdditional={stretchAdditionalData}
                    />
                    <OtherSection
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        otherRowId={otherRowId}
                        removeOtherRow={removeOtherRow}
                        roomId={roomId}
                    />
                </div>


            </React.Fragment>
        </div>
    );
};

export default RoomSection;
