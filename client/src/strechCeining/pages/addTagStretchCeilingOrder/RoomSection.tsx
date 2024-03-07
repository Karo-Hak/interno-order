import React, { FC, useState } from 'react';
import './tagStretchOrder.css'
import AdditionalSection from './AdditionalSection';
import LightPlatformSection from './LightPlatformSection';
import LightRingSection from './LightRingSection';
import ProfilSection from './ProfilSection';
import StretchTexturesSection from './StretchTexturesSection';
import { v4 as uuidv4 } from 'uuid';
import BardutyunSection from './BardutyunSection';
import OtherSection from './OtherSection';

interface RoomSectionProps {
    register: any;
    reset: any;
    setValue: any;
    roomId: any;
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
        roomId,
        room,
        stretchTextureData,
        stretchAdditionalData,
        stretchProfilData,
        stretchLightPlatformData,
        stretchLightRingData,
        stretchBardutyunData
    }: RoomSectionProps) => {

    //////stretch Section
    const [stretchRowId, setStretchRowId] = useState<number[]>([]);
    const addNewRow = () => {
        setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };
console.log(stretchRowId);

    const removeStretchRow = (index: any, roomId: any) => {
        reset({ [`stretchTexture_${index}/${roomId}`]: '' })
        setStretchRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    ///////Additional Section
    const [additionalRowId, setAdditionalRowId] = useState<number[]>([]);
    function addAdditionalRow() {
        setAdditionalRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    }
    function removeAdditionalRow(index: number, roomId: any): void {
        reset({ [`additional_${index}/${roomId}`]: '' })
        setAdditionalRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }

    /////Profil Seqtion
    const [profilRowId, setProfilRowId] = useState<number[]>([]);
    function addProfilRow() {
        setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    }

    function removeProfilRow(index: number, roomId: any) {
        reset({ [`profil_${index}/${roomId}`]: '' })
        setProfilRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Platform Section
    const [lightPlatformRowId, setLightPlatformRowId] = useState<number[]>([])

    function addLightPlatformRow() {
        setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number])
    }

    function removeLightPlatformRowId(index: number, roomId: any) {
        console.log(`lightPlatform_${index}/${roomId}`, 62);

        reset({ [`lightPlatform_${index}/${roomId}`]: '' })
        setLightPlatformRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Ring Section
    const [lightRingRowId, setLightRingRowId] = useState<number[]>([])

    function addLightRingRow() {
        setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number])
    }

    function removeLightRingRowId(index: number, roomId: any) {
        reset({ [`lightRing_${index}/${roomId}`]: '' })
        setLightRingRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }

    /////////////Bardutyun///////////
    const [bardutyunRowId, setBardutyunRowId] = useState<number[]>([]);
    const addBardutyunNewRow = () => {
        setBardutyunRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeBardutyunRow = (index: number, roomId: any) => {
        reset({ [`bardutyun_${index}/${roomId}`]: '' })
        setBardutyunRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    /////////////OtherSection///////////
    const [otherRowId, setOtherRowId] = useState<number[]>([]);
    const addOtherNewRow = () => {
        setOtherRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeOtherRow = (index: number, roomId: any) => {
        reset({ [`other_${index}/${roomId}`]: '' })
        setOtherRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };



    return (
        <div>
            <React.Fragment >
                {room.isChecked && (
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
                                Լռացուցիչ
                            </button>
                        </div>

                        <StretchTexturesSection
                            register={register}
                            reset={reset}
                            setValue={setValue}
                            stretchRowId={stretchRowId}
                            removeStretchRow={removeStretchRow}
                            roomId={roomId}
                            stretchTexture={stretchTextureData}

                        />
                        <ProfilSection
                            register={register}
                            setValue={setValue}
                            profilRowId={profilRowId}
                            removeProfilRow={removeProfilRow}
                            roomId={roomId}
                            stretchProfil={stretchProfilData}
                        />
                        <LightRingSection
                            register={register}
                            lightRingRowId={lightRingRowId}
                            removeLightRingRowId={removeLightRingRowId}
                            setValue={setValue}
                            roomId={roomId}
                            stretchLightRing={stretchLightRingData}
                        />
                        <LightPlatformSection
                            register={register}
                            lightPlatformRowId={lightPlatformRowId}
                            removeLightPlatformRowId={removeLightPlatformRowId}
                            setValue={setValue}
                            roomId={roomId}
                            stretchLightPlatform={stretchLightPlatformData}
                        />
                        <BardutyunSection
                            register={register}
                            setValue={setValue}
                            bardutyunRowId={bardutyunRowId}
                            removeBardutyunRow={removeBardutyunRow}
                            roomId={roomId}
                            stretchBardutyun={stretchBardutyunData}
                        />
                        <AdditionalSection
                            register={register}
                            setValue={setValue}
                            additionalRowId={additionalRowId}
                            removeAdditionalRow={removeAdditionalRow}
                            roomId={roomId}
                            stretchAdditional={stretchAdditionalData}
                        />
                        <OtherSection
                            register={register}
                            otherRowId={otherRowId}
                            removeOtherRow={removeOtherRow}
                            roomId={roomId}
                        />
                    </div>

                )}
            </React.Fragment>
        </div>
    );
};

export default RoomSection;
