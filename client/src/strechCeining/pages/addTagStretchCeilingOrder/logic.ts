export const filterOrder = (order: any) => {
    const stretchCeiling: any = {}
    const profil: any = {}
    const lightPlatform: any = {}
    const lightRing: any = {}
    const additional: any = {}
    const groupedStretchCeilings: Record<string, Record<string, string>> = {};
    const groupedProfils: Record<string, Record<string, string>> = {};
    const groupedLightPlatforms: Record<string, Record<string, string>> = {};
    const groupedLightRings: Record<string, Record<string, string>> = {};
    const groupedAdditionals: Record<string, Record<string, string>> = {};

    for (const [key, value] of Object.entries(order)) {
        if (key.substring(0, 7) === "stretch") {
            stretchCeiling[key] = value
        } else if (key.substring(0, 6) === "profil") {
            profil[key] = value
        } else if (key.substring(0, 13) === "lightPlatform") {
            lightPlatform[key] = value
        } else if (key.substring(0, 9) === "lightRing") {
            lightRing[key] = value
        } else if (key.substring(0, 10) === "additional") {
            additional[key] = value
        }
    }

    for (const key in stretchCeiling) {
        const [property, index] = key.split('_');
        if (!groupedStretchCeilings[index]) {
            groupedStretchCeilings[index] = {};
        }
        groupedStretchCeilings[index][property] = stretchCeiling[key];
    }
    for (const key in profil) {
        const [property, index] = key.split('_');
        if (!groupedProfils[index]) {
            groupedProfils[index] = {};
        }
        groupedProfils[index][property] = profil[key];
    }
    for (const key in lightPlatform) {
        const [property, index] = key.split('_');
        if (!groupedLightPlatforms[index]) {
            groupedLightPlatforms[index] = {};
        }
        groupedLightPlatforms[index][property] = lightPlatform[key];
    }
    for (const key in lightRing) {
        const [property, index] = key.split('_');
        if (!groupedLightRings[index]) {
            groupedLightRings[index] = {};
        }
        groupedLightRings[index][property] = lightRing[key];
    }
    for (const key in additional) {
        const [property, index] = key.split('_');
        if (!groupedAdditionals[index]) {
            groupedAdditionals[index] = {};
        }
        groupedAdditionals[index][property] = additional[key];
    }

    return { groupedStretchCeilings, groupedProfils, groupedLightPlatforms, groupedLightRings, groupedAdditionals }
}