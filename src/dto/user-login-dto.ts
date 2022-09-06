import {UserDto} from "./user-dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto extends UserDto{
    @ApiProperty({
        type: "string",
        description: "Пароль",
        example: "lihfgqwe"
    })
    public password: string;
}