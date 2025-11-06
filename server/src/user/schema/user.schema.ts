import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Role } from "../role/role";
import { Order } from "src/order/schema/order.schema";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { PlintRetailOrder } from "src/plint-order/schema/plint-retail-order.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;
    @Prop()
    surname: string;
    @Prop()
    username: string;
    @Prop()
    password: string;
    @Prop({ default: Role.User })
    role: Role;
    @Prop()
    access_token: string;
    @Prop()
    sphere: Array<string>;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: Order.name }
        ]
    })
    order: Order[];
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: CoopCeilingOrder.name }
        ]
    })
    coopCeilingOrder: CoopCeilingOrder[];
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: PlintRetailOrder.name }
        ]
    })
    plintOrder: PlintRetailOrder[];
    @Prop({ required: false })
    chatId?: string;
};

export const UserSchema = SchemaFactory.createForClass(User);
