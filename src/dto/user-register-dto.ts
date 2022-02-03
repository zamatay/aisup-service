import {UserLoginDto} from "./user-login-dto";

export class UserRegisterDto extends UserLoginDto{
    public confirmPassword: string;
}