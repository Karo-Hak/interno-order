
export const filterOrder = (
    order: any,
    plintData: any,
) => {

    
    const plint: any = {}

    const groupedPlints: any = {}

    for (const [e, value] of Object.entries(order)) {
        if (e.substring(0, 5) === "plint" && value !== "Ընտրել Տեսակը") {
            plint[e] = value
        } 
    }

    

    for (const [elPlint, valuePlint] of Object.entries(plint)) {
        if (elPlint.substring(0, 7) === "plintId") {
            plintData.forEach((element: any) => {
                if (valuePlint === element._id) {
                    plint["plintName_" + elPlint.split('_')[1]] = element.name
                }
            });

        }
    }


    for (const [elPlint, valuePlint] of Object.entries(plint)) {
        const [property, index] = elPlint.split('_', 2);
        if (!groupedPlints[index]) {
            groupedPlints[index] = {};
        }
        groupedPlints[index][property.slice(5).toLowerCase()] = valuePlint;

    }

    const groupedPlintData = Object.values(groupedPlints).filter((el: any) => el.id);

    return { groupedPlintData }
}
