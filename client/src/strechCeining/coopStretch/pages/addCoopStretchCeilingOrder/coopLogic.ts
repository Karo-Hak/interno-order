
export const filterOrder = (
    order: any,
    stretchTextureData: any,
    stretchProfilData: any,
    stretchLightPlatformData: any,
    stretchLightRingData: any,

) => {

    const stretchCeiling: any = {}
    const profil: any = {}
    const lightPlatform: any = {}
    const lightRing: any = {}

    const groupedStretchCeilings: any = {}
    const groupedProfils: any = {}
    const groupedLightPlatforms: any = {}
    const groupedLightRings: any = {}

    for (const [e, value] of Object.entries(order)) {
        if (e.substring(0, 7) === "stretch" && value !== "Ընտրել Տեսակը") {
            stretchCeiling[e] = value
        } else if (e.substring(0, 6) === "profil" && value !== "Ընտրել Տեսակը") {
            profil[e] = value
        } else if (e.substring(0, 13) === "lightPlatform" && value !== "Ընտրել Տեսակը") {
            lightPlatform[e] = value
        } else if (e.substring(0, 9) === "lightRing" && value !== "Ընտրել Տեսակը") {
            lightRing[e] = value
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

        const [property, index] = elStretch.split('_', 2);
        if (!groupedStretchCeilings[index]) {
            groupedStretchCeilings[index] = {};
        }
        groupedStretchCeilings[index][property.slice(7).toLowerCase()] = valueStretch;

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
        const [property, index] = elProfil.split('_', 2);

        if (!groupedProfils[index]) {
            groupedProfils[index] = {};
        }

        groupedProfils[index][property.slice(6).toLowerCase()] = valueProfil;
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

        const [property, index] = elLightPlatform.split('_', 2);

        if (!groupedLightPlatforms[index]) {
            groupedLightPlatforms[index] = {};
        }

        groupedLightPlatforms[index][property.slice(13).toLowerCase()] = valueLightPlatform;
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
        const [property, index] = elLightRing.split('_', 2);
        if (!groupedLightRings[index]) {
            groupedLightRings[index] = {};
        }
        groupedLightRings[index][property.slice(9).toLowerCase()] = valueLightRing;
    }



    const groupedStretchTextureData = Object.values(groupedStretchCeilings).filter((el: any) => el.id);
    const groupedStretchProfilData = Object.values(groupedProfils).filter((el: any) => el.id);
    const groupedLightPlatformData = Object.values(groupedLightPlatforms).filter((el: any) => el.id);
    const groupedLightRingData = Object.values(groupedLightRings).filter((el: any) => el.id);

    return { groupedStretchTextureData, groupedStretchProfilData, groupedLightPlatformData, groupedLightRingData }
}
