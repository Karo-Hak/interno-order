import { User } from "../schema/user.schema";

export class LoginUserDto {
    readonly name: string;
    readonly surname: string;
    readonly username: string;
    readonly role: string;
    readonly password: string;
    readonly access_token: string;
    readonly _id: string
    constructor(user: any) {
        this.name = user.name
        this.surname = user.surname
        this.username = user.username
        this.role = user.role
        this.access_token = user.access_token
        this._id = user._id
    }
}