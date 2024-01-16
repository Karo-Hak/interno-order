
export const searchFilter = (orders: any, user: string, buyer: string, cooperate: string, texture: string, paymentMethod: string, grTotal: string) => {
    if (user && user !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.user._id === user
        })
    }
    if (buyer && buyer !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.buyer._id === buyer
        })
    }
    if (cooperate && cooperate !== "0") {
        orders = orders.filter((e: any, i: any) => {
            if (e.cooperate !== null) {
                return e.cooperate._id === cooperate
            }
        })
    }
    if (texture && texture !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.texture._id === texture
        })
    }
    if (paymentMethod && paymentMethod !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.paymentMethod === paymentMethod
        })
    }
    console.log(grTotal);
    if (grTotal && grTotal !== "0") {
        if (grTotal === "payed") {
            orders = orders.filter((e: any, i: any) => {
                return e.groundTotal === 0
            })
        } else {
            orders = orders.filter((e: any, i: any) => {
                return e.groundTotal !== 0
            })
        }
    }

    return orders
}

