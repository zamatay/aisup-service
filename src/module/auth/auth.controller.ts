import { Body, Controller, Post } from "@nestjs/common";
import { UserRegisterDto } from "../../dto/user-register-dto";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "../../dto/user-login-dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('register')
    register(@Body() user: UserRegisterDto){
        return this.authService.register(user)
    }

    @Post('login')
    login(@Body() user: UserLoginDto){
        return this.authService.login(user)
    }

    @Post('refreshToken')
    refreshToken(@Body('refreshToken') refreshToken
    ){
        return this.authService.refreshToken(refreshToken)
    }
}
