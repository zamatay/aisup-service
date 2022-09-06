import {UserLoginDto} from "./user-login-dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterDto extends UserLoginDto{
    @ApiProperty({
        type: "string",
        description: "Подтверждение пароля",
        example: "lihfgqwe"
    })
    public confirmPassword: string;
}