import { Value } from "sass";

export const searchFilter = (orders: any, user: string, buyer: string, cooperate: string, texture: string, paymentMethod: string) => {
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
    // if (groundTotal && groundTotal !== "0") {
    //     orders = orders.filter((e: any, i: any) => {
    //         return e.groundTotal === groundTotal
    //     })


    // }

    return orders
}

