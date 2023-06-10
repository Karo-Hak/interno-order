import { Value } from "sass";

export const searchFilter = (orders: any, user: string, buyer: string, cooperate: string, texture: string) => {
    if (user && user !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.user._id == user
        })
    }
    if (buyer && buyer !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.buyer._id == buyer
        })
    }
    if (cooperate && cooperate !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.cooperate._id == cooperate
        })
    }
    if (texture && texture !== "0") {
        orders = orders.filter((e: any, i: any) => {
            return e.texture._id == texture
        })
    }

    return orders
}

