
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
        const roomSum:number = roomItem.sum

        rooms[roomName + "_" + roomId] = {
            id: roomId,
            name: roomName,
            sum: roomSum,
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

    for (const [elWork, valueWork] of Object.entries(work)) {

        if (elWork.substring(0, 4) === "work") {
            
            stretchWorkData.forEach((element: any) => {
                if (valueWork === element._id) {
                    work["WorkName_" + elWork.split('_')[1]] = element.name
                    work["WorkType_" + elWork.split('_')[1]] = "Աշխատանք"
                }
            });
        }
        
    }

    for (const [elWork, valueWork] of Object.entries(work)) {
        const [property, index] = elWork.split('_');
        if (!groupedWorks[index]) {
            groupedWorks[index] = {};
        }
        groupedWorks[index][property.slice(4).toLowerCase()] = valueWork;
    }
   


    for (const [el, value] of Object.entries(rooms)) {

        for (const [elOther, valueOther] of Object.entries(other)) {

            if (elOther.slice(elOther.indexOf('/') + 1) === value.id) {
                const [property, index] = elOther.split('_', 2);

                if (!value.groupedOthers[index]) {
                    value.groupedOthers[index] = {};
                }

                value.groupedOthers[index][property.slice(5).toLowerCase()] = valueOther;
            }
        }

        for (const [elStretch, valueStretch] of Object.entries(stretchCeiling)) {
            
            if (elStretch.substring(0, 9) === "stretchId") {
                stretchTextureData.forEach((element: any) => {
                    if (valueStretch === element._id) {
                        stretchCeiling["stretchName_" + elStretch.split('_')[1]] = element.name
                        stretchCeiling["stretchType_" + elStretch.split('_')[1]] = "Ձգ․ Առաստաղ"
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
                value.groupedStretchCeilings[index][property.slice(7).toLowerCase()] = valueStretch;
            }
        }

        for (const [elAdditional, valueAdditional] of Object.entries(additional)) {

            if (elAdditional.substring(0, 10) === "additional") {
                stretchAdditionalData.forEach((element: any) => {
                    if (valueAdditional === element._id) {
                        additional["additionalName_" + elAdditional.split('_')[1]] = element.name
                        additional["additionalType_" + elAdditional.split('_')[1]] = "Այլ Ապրանք"
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

                value.groupedAdditionals[index][property.slice(10).toLowerCase()] = valueAdditional;
            }

        }

        for (const [elProfil, valueProfil] of Object.entries(profil)) {

            if (elProfil.substring(0, 6) === "profil") {
                stretchProfilData.forEach((element: any) => {
                    if (valueProfil === element._id) {
                        profil["profilName_" + elProfil.split('_')[1]] = element.name
                        profil["profilType_" + elProfil.split('_')[1]] = "Պրոֆիլ"
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

                value.groupedProfils[index][property.slice(6).toLowerCase()] = valueProfil;
            }
        }

        for (const [elLightPlatform, valueLightPlatform] of Object.entries(lightPlatform)) {

            if (elLightPlatform.substring(0, 13) === "lightPlatform") {
                stretchLightPlatformData.forEach((element: any) => {
                    if (valueLightPlatform === element._id) {
                        lightPlatform["lightPlatformName_" + elLightPlatform.split('_')[1]] = element.name
                        lightPlatform["lightPlatformType_" + elLightPlatform.split('_')[1]] = "Լույսի պլատֆորմ"
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

                value.groupedLightPlatforms[index][property.slice(13).toLowerCase()] = valueLightPlatform;
            }
        }

        for (const [elLightRing, valueLightRing] of Object.entries(lightRing)) {

            if (elLightRing.substring(0, 9) === "lightRing") {
                stretchLightRingData.forEach((element: any) => {
                    if (valueLightRing === element._id) {
                        lightRing["lightRingName_" + elLightRing.split('_')[1]] = element.name
                        lightRing["lightRingType_" + elLightRing.split('_')[1]] = "Լույսի օղակ"
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

                value.groupedLightRings[index][property.slice(9).toLowerCase()] = valueLightRing;
            }
        }

        for (const [elBardutyun, valueBardutyun] of Object.entries(bardutyun)) {

            if (elBardutyun.substring(0, 9) === "bardutyun") {
                stretchBardutyunData.forEach((element: any) => {
                    if (valueBardutyun === element._id) {
                        bardutyun["bardutyunName_" + elBardutyun.split('_')[1]] = element.name
                        bardutyun["bardutyunType_" + elBardutyun.split('_')[1]] = "Բարդություն"
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

                value.groupedBardutyuns[index][property.slice(9).toLowerCase()] = valueBardutyun;
            }
        }

    }
    return { rooms, groupedWorks }
}
