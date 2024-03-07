
export const filterOrder = (
    order: any,
    room: any,
    stretchTextureData: any,
    stretchAdditionalData: any,
    stretchProfilData: any,
    stretchLightPlatformData: any,
    stretchLightRingData: any,
    stretchBardutyunData: any,
    stretchWorkData:any

) => {

    const stretchCeiling: any = {}
    const profil: any = {}
    const lightPlatform: any = {}
    const lightRing: any = {}
    const additional: any = {}
    const bardutyun: any = {}
    const work: any = {}
    const other: any = {}
    const groupedWorks: any = {}
    const rooms: Record<string, any> = {};







    for (const roomItem of room) {
        const roomId: string = roomItem.id;
        const roomName: string = roomItem.name;

        rooms[roomName + "_" + roomId] = {
            id: roomId,
            name: roomName,
            groupedStretchCeilings: {},
            groupedProfils: {},
            groupedLightPlatforms: {},
            groupedLightRings: {},
            groupedAdditionals: {},
            groupedBardutyuns: {},
            groupedOthers: {}
        };
    }

    for (const [e, value] of Object.entries(order)) {
        if (e.substring(0, 7) === "stretch" && value !== "Ընտրել Տեսակը") {
            stretchCeiling[e] = value
        } else if (e.substring(0, 6) === "profil" && value !== "Ընտրել Տեսակը") {
            profil[e] = value
        } else if (e.substring(0, 13) === "lightPlatform" && value !== "Ընտրել Տեսակը") {
            lightPlatform[e] = value
        } else if (e.substring(0, 9) === "lightRing" && value !== "Ընտրել Տեսակը") {
            lightRing[e] = value
        } else if (e.substring(0, 10) === "additional" && value !== "Ընտրել Տեսակը") {
            additional[e] = value
        } else if (e.substring(0, 9) === "bardutyun" && value !== "Ընտրել Տեսակը") {
            bardutyun[e] = value
        } else if (e.substring(0, 4) === "work" && value !== "Ընտրել Տեսակը") {
            work[e] = value
        } else if (e.substring(0, 5) === "other" && value !== "Ընտրել Տեսակը") {
            other[e] = value
        }
    }
console.log(stretchCeiling);

    for (const [elWork, valueWork] of Object.entries(work)) {

        if (elWork.substring(0, 4) === "work") {
            
            stretchWorkData.forEach((element: any) => {
                if (valueWork === element._id) {
                    work["workName_" + elWork.split('_')[1]] = element.workName
                }
            });
        }
        
    }

    for (const [elWork, valueWork] of Object.entries(work)) {
        const [property, index] = elWork.split('_');
        if (!groupedWorks[index]) {
            groupedWorks[index] = {};
        }
        groupedWorks[index][property] = valueWork;
    }
   


    for (const [el, value] of Object.entries(rooms)) {

        for (const [elOther, valueOther] of Object.entries(other)) {

            if (elOther.slice(elOther.indexOf('/') + 1) === value.id) {
                const [property, index] = elOther.split('_', 2);

                if (!value.groupedOthers[index]) {
                    value.groupedOthers[index] = {};
                }

                value.groupedOthers[index][property] = valueOther;
            }
        }

        for (const [elStretch, valueStretch] of Object.entries(stretchCeiling)) {
            if (elStretch.substring(0, 14) === "stretchTexture") {
                stretchTextureData.forEach((element: any) => {
                    if (valueStretch === element._id) {
                        stretchCeiling["stretchName_" + elStretch.split('_')[1]] = element.name
                    }
                });

            }
        }
        for (const [elStretch, valueStretch] of Object.entries(stretchCeiling)) {
            if (elStretch.slice(elStretch.indexOf('/') + 1) === value.id) {

                const [property, index] = elStretch.split('_', 2);

                if (!value.groupedStretchCeilings[index]) {
                    value.groupedStretchCeilings[index] = {};
                }

                value.groupedStretchCeilings[index][property] = valueStretch;
            }
        }

        for (const [elAdditional, valueAdditional] of Object.entries(additional)) {

            if (elAdditional.substring(0, 10) === "additional") {
                stretchAdditionalData.forEach((element: any) => {
                    if (valueAdditional === element._id) {
                        additional["additionalName_" + elAdditional.split('_')[1]] = element.name
                    }
                });
            }
        }
        for (const [elAdditional, valueAdditional] of Object.entries(additional)) {
            if (elAdditional.slice(elAdditional.indexOf('/') + 1) === value.id) {
                const [property, index] = elAdditional.split('_', 2);

                if (!value.groupedAdditionals[index]) {
                    value.groupedAdditionals[index] = {};
                }

                value.groupedAdditionals[index][property] = valueAdditional;
            }

        }

        for (const [elProfil, valueProfil] of Object.entries(profil)) {

            if (elProfil.substring(0, 6) === "profil") {
                stretchProfilData.forEach((element: any) => {
                    if (valueProfil === element._id) {
                        profil["profilName_" + elProfil.split('_')[1]] = element.name
                    }
                });
            }
        }
        for (const [elProfil, valueProfil] of Object.entries(profil)) {
            if (elProfil.slice(elProfil.indexOf('/') + 1) === value.id) {
                const [property, index] = elProfil.split('_', 2);

                if (!value.groupedProfils[index]) {
                    value.groupedProfils[index] = {};
                }

                value.groupedProfils[index][property] = valueProfil;
            }
        }

        for (const [elLightPlatform, valueLightPlatform] of Object.entries(lightPlatform)) {

            if (elLightPlatform.substring(0, 13) === "lightPlatform") {
                stretchLightPlatformData.forEach((element: any) => {
                    if (valueLightPlatform === element._id) {
                        lightPlatform["lightPlatformName_" + elLightPlatform.split('_')[1]] = element.name
                    }
                });
            }
        }
        for (const [elLightPlatform, valueLightPlatform] of Object.entries(lightPlatform)) {

            if (elLightPlatform.slice(elLightPlatform.indexOf('/') + 1) === value.id) {
                const [property, index] = elLightPlatform.split('_', 2);

                if (!value.groupedLightPlatforms[index]) {
                    value.groupedLightPlatforms[index] = {};
                }

                value.groupedLightPlatforms[index][property] = valueLightPlatform;
            }
        }

        for (const [elLightRing, valueLightRing] of Object.entries(lightRing)) {

            if (elLightRing.substring(0, 9) === "lightRing") {
                stretchLightRingData.forEach((element: any) => {
                    if (valueLightRing === element._id) {
                        lightRing["lightRingName_" + elLightRing.split('_')[1]] = element.name
                    }
                });
            }
        }
        for (const [elLightRing, valueLightRing] of Object.entries(lightRing)) {

            if (elLightRing.slice(elLightRing.indexOf('/') + 1) === value.id) {
                const [property, index] = elLightRing.split('_', 2);

                if (!value.groupedLightRings[index]) {
                    value.groupedLightRings[index] = {};
                }

                value.groupedLightRings[index][property] = valueLightRing;
            }
        }

        for (const [elBardutyun, valueBardutyun] of Object.entries(bardutyun)) {

            if (elBardutyun.substring(0, 9) === "bardutyun") {
                stretchBardutyunData.forEach((element: any) => {
                    if (valueBardutyun === element._id) {
                        bardutyun["bardutyunName_" + elBardutyun.split('_')[1]] = element.name
                    }
                });
            }
        }
        for (const [elBardutyun, valueBardutyun] of Object.entries(bardutyun)) {

            if (elBardutyun.slice(elBardutyun.indexOf('/') + 1) === value.id) {
                const [property, index] = elBardutyun.split('_', 2);

                if (!value.groupedBardutyuns[index]) {
                    value.groupedBardutyuns[index] = {};
                }

                value.groupedBardutyuns[index][property] = valueBardutyun;
            }
        }

    }
    return { rooms, groupedWorks }
}
