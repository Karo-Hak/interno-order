import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Role } from "../role/role";
import { Order } from "src/order/schema/order.schema";

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
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: Order.name }
        ]
    })
    order: Order[];
};

export const UserSchema = SchemaFactory.createForClass(User);
