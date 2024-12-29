import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Role } from "../role/role";
import { Order } from "src/order/schema/order.schema";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { PlintOrder } from "src/plint-order/schema/plint-order.schema";

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
            { type: mongoose.Schema.Types.ObjectId, ref: PlintOrder.name }
        ]
    })
    plintOrder: PlintOrder[];
};

export const UserSchema = SchemaFactory.createForClass(User);
