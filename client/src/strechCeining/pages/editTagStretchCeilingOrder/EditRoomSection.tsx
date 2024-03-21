import React, { FC, useEffect, useState } from 'react';
import { UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import EditStretchTexturesSection from './EditStretchTexturesSection';
import EditProfilSection from './EditProfilSection';
import EditLightPlatformSection from './EditLightPlatformSection';
import EditLightRingSection from './EditLightRingSection';
import EditBardutyunSection from './EditBardutyunSection';
import EditAdditionalSection from './EditAdditionalSection';
import EditOtherSection from './EditOtherSection';


interface EditRoomSectionProps {
    register: UseFormRegister<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>
    roomId: any;
    room: any;
    stretchTextureData: any;
    stretchAdditionalData: any;
    stretchProfilData: any;
    stretchLightPlatformData: any;
    stretchLightRingData: any;
    stretchBardutyunData: any;
    rooms: any[]

}

const EditRoomSection: FC<EditRoomSectionProps> = (
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
        stretchBardutyunData,
        rooms
    }: EditRoomSectionProps) => {

    const [stretchRowId, setStretchRowId] = useState<any[]>([]);
    const [stretchTextureId, setStretchTextureId] = useState<any[]>([]);

    const [profilRowId, setProfilRowId] = useState<any[]>([]);
    const [profilId, setProfilId] = useState<any[]>([]);

    const [lightPlatformRowId, setLightPlatformRowId] = useState<any[]>([])
    const [lightPlatformId, setLightPlatformId] = useState<any[]>([]);

    const [lightRingRowId, setLightRingRowId] = useState<any[]>([])
    const [lightRingId, setLightRingId] = useState<any[]>([]);

    const [bardutyunRowId, setBardutyunRowId] = useState<any[]>([]);
    const [bardutyunId, setBardutyunId] = useState<any[]>([])

    const [additionalRowId, setAdditionalRowId] = useState<any[]>([]);
    const [additionalId, setAdditionalId] = useState<any[]>([])

    const [otherRowId, setOtherRowId] = useState<any[]>([]);
    const [otherId, setOtherId] = useState<any[]>([])


    useEffect(() => {

        rooms.forEach((el: any) => {
            if (el.id === roomId && el.groupedStretchCeilings) {
                Object.entries(el.groupedStretchCeilings).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setStretchRowId((prevRowId) => [...prevRowId, rowId]);
                    const textur = value
                    setStretchTextureId((prevRowId) => [...prevRowId, textur]);
                });
            }
            if (el.id === roomId && el.groupedProfils) {
                Object.entries(el.groupedProfils).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setProfilRowId((prevRowId) => [...prevRowId, rowId]);
                    const profil = value
                    setProfilId((prevRowId) => [...prevRowId, profil]);
                });
            }
            if (el.id === roomId && el.groupedLightPlatforms) {
                Object.entries(el.groupedLightPlatforms).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setLightPlatformRowId((prevRowId) => [...prevRowId, rowId]);
                    const lightPlatform = value
                    setLightPlatformId((prevRowId) => [...prevRowId, lightPlatform]);
                });
            }
            if (el.id === roomId && el.groupedLightRings) {
                Object.entries(el.groupedLightRings).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setLightRingRowId((prevRowId) => [...prevRowId, rowId]);
                    const lightRing = value
                    setLightRingId((prevRowId) => [...prevRowId, lightRing]);
                });
            }
            if (el.id === roomId && el.groupedBardutyuns) {
                Object.entries(el.groupedBardutyuns).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setBardutyunRowId((prevRowId) => [...prevRowId, rowId]);
                    const bardutyun = value
                    setBardutyunId((prevRowId) => [...prevRowId, bardutyun]);
                });
            }
            if (el.id === roomId && el.groupedAdditionals) {
                Object.entries(el.groupedAdditionals).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setAdditionalRowId((prevRowId) => [...prevRowId, rowId]);
                    const additional = value
                    setAdditionalId((prevRowId) => [...prevRowId, additional]);
                });
            }
            if (el.id === roomId && el.groupedOthers) {
                Object.entries(el.groupedOthers).forEach(([key, value]: [string, any], index: number) => {
                    const rowId = key.split('/')[0];
                    setOtherRowId((prevRowId) => [...prevRowId, rowId]);
                    const other = value
                    setOtherId((prevRowId) => [...prevRowId, other]);
                });
            }
        });

    }, [rooms])


    //////stretch Section
    const addNewRow = () => {
        setStretchRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeStretchRow = (index: any, roomId: any) => {
        reset({ [`stretch_${index}/${roomId}`]: '' })
        setStretchRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };


    /////Profil Seqtion
    function addProfilRow() {
        setProfilRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    }

    function removeProfilRow(index: number, roomId: any) {
        reset({ [`profil_${index}/${roomId}`]: '' })
        setProfilRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }

    //////Light Ring Section

    function addLightRingRow() {
        setLightRingRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number])
    }

    function removeLightRingRowId(index: any, roomId: any) {
        reset({ [`lightRing_${index}/${roomId}`]: '' })
        setLightRingRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }

    //////Light Platform Section

    function addLightPlatformRow() {
        setLightPlatformRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number])
    }

    function removeLightPlatformRowId(index: any, roomId: any) {
        console.log(`lightPlatform_${index}/${roomId}`, 62);

        reset({ [`lightPlatform_${index}/${roomId}`]: '' })
        setLightPlatformRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    }


    /////////////Bardutyun///////////
    const addBardutyunNewRow = () => {
        setBardutyunRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeBardutyunRow = (index: any, roomId: any) => {
        reset({ [`bardutyun_${index}/${roomId}`]: '' })
        setBardutyunRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
    };

    ///////Additional Section
    function addAdditionalRow() {
        setAdditionalRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    }
    function removeAdditionalRow(index: number, roomId: any): void {
        reset({ [`additional_${index}/${roomId}`]: '' })
        setAdditionalRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));

    }
    /////////////OtherSection///////////
    const addOtherNewRow = () => {
        setOtherRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeOtherRow = (index: number, roomId: any) => {
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

                    <EditStretchTexturesSection
                        register={register}
                        setValue={setValue}
                        stretchRowId={stretchRowId}
                        removeStretchRow={removeStretchRow}
                        roomId={roomId}
                        stretchTexture={stretchTextureData}
                        stretchTextureId={stretchTextureId}

                    />

                    <EditProfilSection
                        register={register}
                        setValue={setValue}
                        profilRowId={profilRowId}
                        removeProfilRow={removeProfilRow}
                        roomId={roomId}
                        stretchProfil={stretchProfilData}
                        profilId={profilId}
                    />

                    <EditLightRingSection
                        register={register}
                        setValue={setValue}
                        lightRingRowId={lightRingRowId}
                        removeLightRingRowId={removeLightRingRowId}
                        roomId={roomId}
                        stretchLightRing={stretchLightRingData}
                        lightRingId={lightRingId}
                    />

                    <EditLightPlatformSection
                        register={register}
                        setValue={setValue}
                        lightPlatformRowId={lightPlatformRowId}
                        removeLightPlatformRowId={removeLightPlatformRowId}
                        roomId={roomId}
                        stretchLightPlatform={stretchLightPlatformData}
                        lightPlatformId={lightPlatformId}
                    />

                    <EditBardutyunSection
                        register={register}
                        setValue={setValue}
                        bardutyunRowId={bardutyunRowId}
                        removeBardutyunRow={removeBardutyunRow}
                        roomId={roomId}
                        stretchBardutyun={stretchBardutyunData}
                        bardutyunId={bardutyunId}
                    />

                    <EditAdditionalSection
                        register={register}
                        setValue={setValue}
                        additionalRowId={additionalRowId}
                        removeAdditionalRow={removeAdditionalRow}
                        roomId={roomId}
                        stretchAdditional={stretchAdditionalData}
                        additionalId={additionalId}
                    />

                    <EditOtherSection
                        register={register}
                        setValue={setValue}
                        otherRowId={otherRowId}
                        removeOtherRow={removeOtherRow}
                        roomId={roomId}
                        otherId={otherId}
                    />
                </div>
            </React.Fragment>
        </div>
    );
};

export default EditRoomSection;
